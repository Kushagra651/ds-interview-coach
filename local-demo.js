#!/usr/bin/env node
// local-demo.js — Run ds-interview-coach locally with Ollama (no API key needed)
// Usage: node local-demo.js "Quiz me on bias-variance tradeoff"

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = process.env.OLLAMA_MODEL || "tinyllama";

// Load agent files
const agentDir = __dirname;
const soul = fs.readFileSync(path.join(agentDir, "SOUL.md"), "utf8");
const rules = fs.readFileSync(path.join(agentDir, "RULES.md"), "utf8");
const interviewQA = fs.readFileSync(
  path.join(agentDir, "skills/interview-qa/SKILL.md"),
  "utf8"
);

// Load progress memory
const progressPath = path.join(agentDir, "memory/progress.json");
let progress = { sessions: [] };
try {
  progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
} catch {}

// Build system prompt from agent files
const SYSTEM_PROMPT = `${soul}

---

${rules}

---

# Active Skill: Interview Q&A

${interviewQA}

---

# Current Progress Memory
${JSON.stringify(progress, null, 2)}

---

Keep responses concise. You are running in local mode with a small model — be direct and practical.`;

const history = [];

async function chat(userMessage) {
  history.push({ role: "user", content: userMessage });

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const reply = data.message?.content || "No response";
  history.push({ role: "assistant", content: reply });

  // Auto-save to progress.json if a score is mentioned
  const scoreMatch = reply.match(/Score:\s*(\d)\/5/i);
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1]);
    progress.sessions.push({
      timestamp: new Date().toISOString(),
      topic: "interview-qa",
      question: history[history.length - 3]?.content || "unknown",
      score,
      note: `Local session with ${MODEL}`,
    });
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
    console.log(`\n✓ Score logged to memory/progress.json (${score}/5)`);
  }

  return reply;
}

async function main() {
  console.log(`\n🎯 DS Interview Coach — Local Mode (${MODEL})`);
  console.log("─".repeat(50));
  console.log("Commands: type your message, or 'quit' to exit");
  console.log("─".repeat(50) + "\n");

  // If a prompt was passed as CLI arg, use it first
  const cliPrompt = process.argv.slice(2).join(" ");
  if (cliPrompt) {
    console.log(`You: ${cliPrompt}\n`);
    try {
      const reply = await chat(cliPrompt);
      console.log(`Coach: ${reply}\n`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
      console.error(
        "\nMake sure Ollama is running: ollama serve\nAnd tinyllama is pulled: ollama pull tinyllama"
      );
      process.exit(1);
    }
  }

  // Interactive REPL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = () => {
    rl.question("You: ", async (input) => {
      const text = input.trim();
      if (!text || text.toLowerCase() === "quit") {
        console.log("\nSession ended. Progress saved to memory/progress.json");
        rl.close();
        return;
      }

      try {
        const reply = await chat(text);
        console.log(`\nCoach: ${reply}\n`);
      } catch (e) {
        console.error(`Error: ${e.message}\n`);
      }

      ask();
    });
  };

  ask();
}

main();