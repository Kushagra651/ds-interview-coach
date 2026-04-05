#!/usr/bin/env node
// local-demo.js — Run ds-interview-coach locally
// Groq (free):      $env:GROQ_API_KEY="gsk_..." then: node local-demo.js "Quiz me on X"
// Anthropic (paid): $env:ANTHROPIC_API_KEY="sk-ant-..." then: node local-demo.js "Quiz me on X"
// Ollama (local):   $env:OLLAMA_MODEL="tinyllama" then: node local-demo.js "Quiz me on X"

const fs   = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const PROVIDER = process.env.ANTHROPIC_API_KEY ? "anthropic"
               : process.env.GROQ_API_KEY       ? "groq"
               : "ollama";

const MODELS = {
  anthropic: "claude-haiku-4-5-20251001",
  groq:      "llama-3.1-8b-instant",
  ollama:    process.env.OLLAMA_MODEL || "tinyllama",
};

const soul  = fs.readFileSync(path.join(__dirname, "SOUL.md"), "utf8");
const rules = fs.readFileSync(path.join(__dirname, "RULES.md"), "utf8");
const skill = fs.readFileSync(path.join(__dirname, "skills/interview-qa/SKILL.md"), "utf8");

const progressPath = path.join(__dirname, "memory/progress.json");
let progress = { sessions: [] };
try { progress = JSON.parse(fs.readFileSync(progressPath, "utf8")); } catch {}

// Strict scoring instructions added for smaller models
const SCORING_RULES = `
CRITICAL FORMATTING RULES — follow exactly:
1. Ask ONE question. Wait for the answer. Then ask ONE follow-up.
2. After the user answers the follow-up, evaluate using EXACTLY this format:

Score: X/5
✓ Correct: [what they got right]
✗ Missing: [what was wrong or missing]
💡 Interviewer expects: [what a real interviewer wants]

3. X must be a single digit 1 through 5. Never use /100 or percentages.
4. Do NOT print git commands or file paths. Do NOT say "commit to git". Just evaluate.
5. Do NOT add markdown headers like **Topic:** or **Difficulty:** — just ask the question naturally.
`;

const SYSTEM = `${soul}\n\n---\n\n${rules}\n\n---\n\n# Active Skill\n${skill}\n\n---\n\n${SCORING_RULES}\n\n---\n\n# Recent Progress\n${JSON.stringify(progress.sessions.slice(-5), null, 2)}`;

const history = [];

async function chat(userMessage) {
  history.push({ role: "user", content: userMessage });
  let reply;

  if (PROVIDER === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 1024,
        system: SYSTEM,
        messages: history,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    reply = (await res.json()).content?.[0]?.text;

  } else if (PROVIDER === "groq") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODELS.groq,
        max_tokens: 1024,
        messages: [{ role: "system", content: SYSTEM }, ...history],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
    reply = (await res.json()).choices?.[0]?.message?.content;

  } else {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODELS.ollama,
        messages: [{ role: "system", content: SYSTEM }, ...history],
        stream: false,
      }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    reply = (await res.json()).message?.content;
  }

  reply = reply || "No response received.";
  history.push({ role: "assistant", content: reply });
  return reply;
}

function saveAndCommit(reply, question) {
  // Match Score: X/5 format strictly
  const match = reply.match(/Score:\s*([1-5])\/5/i);
  if (!match) return;

  const score = parseInt(match[1]);
  // Guess topic from question text
  const topicMap = [
    ["bias|variance|overfitting|underfitting|regularization", "ml-theory"],
    ["sql|query|join|window|cte|aggregate", "sql"],
    ["probability|distribution|bayesian|hypothesis|p-value|confidence", "statistics"],
    ["neural|backprop|gradient|transformer|attention|cnn|rnn", "deep-learning"],
    ["deploy|pipeline|airflow|docker|mlops|monitor|drift", "mlops"],
    ["pandas|numpy|sklearn|code|implement|write", "coding"],
  ];
  let topic = "interview-qa";
  for (const [pattern, t] of topicMap) {
    if (new RegExp(pattern, "i").test(question)) { topic = t; break; }
  }

  progress.sessions.push({
    timestamp: new Date().toISOString(),
    topic,
    question: question.slice(0, 80),
    score,
    note: `via local-demo (${PROVIDER}/${MODELS[PROVIDER]})`,
  });
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

  // Git commit
  try {
    execSync(`git -C "${__dirname}" add memory/progress.json`, { stdio: "ignore" });
    execSync(
      `git -C "${__dirname}" commit -m "progress: ${topic} scored ${score}/5 — ${new Date().toISOString().slice(0,10)}"`,
      { stdio: "ignore" }
    );
    console.log(`\n✓ Score ${score}/5 saved → memory/progress.json`);
    console.log(`✓ Committed to git: progress: ${topic} scored ${score}/5`);
  } catch {
    console.log(`\n✓ Score ${score}/5 saved → memory/progress.json`);
  }
}

async function main() {
  console.log(`\n🎯 DS Interview Coach — ${PROVIDER} / ${MODELS[PROVIDER]}`);
  console.log("─".repeat(52));
  console.log("Type your message, or 'quit' to exit\n");

  const cliPrompt = process.argv.slice(2).join(" ");
  if (cliPrompt) {
    console.log(`You: ${cliPrompt}\n`);
    const reply = await chat(cliPrompt);
    console.log(`Coach:\n${reply}\n`);
    saveAndCommit(reply, cliPrompt);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const firstQuestion = cliPrompt || "";

  const ask = () => {
    rl.question("You: ", async (input) => {
      const text = input.trim();
      if (!text || text.toLowerCase() === "quit") {
        console.log("\nSession ended. Run: git log memory/progress.json --oneline");
        rl.close();
        return;
      }
      try {
        const reply = await chat(text);
        console.log(`\nCoach:\n${reply}\n`);
        saveAndCommit(reply, firstQuestion || text);
      } catch (e) {
        console.error(`\nError: ${e.message}\n`);
      }
      ask();
    });
  };
  ask();
}

main().catch(e => { console.error(e.message); process.exit(1); });