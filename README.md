# DS Interview Coach 🎯

> A ruthlessly honest Data Science & ML interview coach that lives in a git repo.

Built for the [GitAgent Hackathon](https://github.com/open-gitagent/gitagent) using the [gitagent](https://github.com/open-gitagent/gitagent) standard, powered by [gitclaw](https://github.com/open-gitagent/gitclaw), and deployable serverlessly via [clawless](https://github.com/open-gitagent/clawless).

---

## What it does

The DS Interview Coach challenges you with real Data Science and ML interview questions, evaluates your answers Socratically (no spoon-feeding), runs your code, and tracks your progress — all inside a git repo.

The killer feature: **your progress lives in git**. Every session is committed to `memory/progress.json`. Run `git log memory/progress.json` and see your entire learning journey.

---

## Skills

| Skill | What it does |
|-------|-------------|
| `interview-qa` | Generates questions across stats, ML, SQL, deep learning. Probes your answers. Scores 1–5. |
| `code-challenge` | Gives you a Python coding challenge. Executes your code. Evaluates correctness + quality. |
| `progress-tracker` | Reads your history. Shows weak areas. Recommends what to study next. |
| `mock-interview` | Full 30-min simulated interview across all domains. Generates a hiring signal scorecard. |

---

## Quickstart

### Run locally with gitclaw

```bash
# Install gitclaw
npm install -g gitclaw

# Clone this repo
git clone https://github.com/Kushagra651/ds-interview-coach
cd ds-interview-coach

# Set your API key
export ANTHROPIC_API_KEY="sk-..."

# Start coaching
gitclaw "Quiz me on random forests"
gitclaw "Give me a coding challenge"
gitclaw "Run a full mock interview"
gitclaw "Show my progress"
```

### Deploy in the browser with clawless

```bash
npm install clawcontainer
```

```javascript
import { ClawContainer } from 'clawcontainer';

const cc = new ClawContainer('#app', {
  template: 'gitclaw',
  repo: 'https://github.com/Kushagra651/ds-interview-coach',
  env: { ANTHROPIC_API_KEY: 'sk-...' }
});
await cc.start();
```

### Validate the agent

```bash
npx gitagent validate
npx gitagent info
```

---

## The git-native memory concept

Every time you complete a Q&A session, the agent commits your score to git:

```bash
git log memory/progress.json --oneline
# a3f1c2e progress: statistics scored 4/5 — 2025-04-05T10:30:00Z
# 9b2d4a1 progress: ml-theory scored 2/5 — 2025-04-04T20:15:00Z
# 5e8f3c0 mock-interview: scored 3.4/5 — Mixed — 2025-04-03T18:00:00Z
```

Your entire interview prep history is version-controlled. You can branch it, diff it, and share it.

---

## Repo structure

```
ds-interview-coach/
├── agent.yaml              # Manifest
├── SOUL.md                 # Personality and identity
├── RULES.md                # Hard behavioral constraints
├── memory/
│   └── progress.json       # Git-native session log
└── skills/
    ├── interview-qa/
    │   └── SKILL.md        # Q&A with Socratic evaluation
    ├── code-challenge/
    │   └── SKILL.md        # Python coding challenges + execution
    ├── progress-tracker/
    │   └── SKILL.md        # Progress analytics + study planner
    └── mock-interview/
        └── SKILL.md        # Full simulated interview + scorecard
```

---

## Example session

```
You: Quiz me on statistics

Coach: Let's start. Here's your question:

You run an A/B test. The p-value comes back as 0.03. Your manager
says "great, the result is significant, ship it." What do you say?

You: I'd say the result is statistically significant at the 5% level,
     meaning there's only a 3% chance we'd see this result if the
     null hypothesis were true.

Coach: That's a reasonable start. But here's my follow-up: your
       manager wants to ship immediately. What are the things
       you'd check *before* agreeing to that — and why might a
       p-value of 0.03 alone not be enough?

You: [attempts deeper answer]

Coach: Score: 4/5
       ✓ Correct on significance definition and null hypothesis framing
       ✗ Missed: practical significance (effect size), multiple testing
         correction if this was one of many tests, and sample size
         adequacy (were you sufficiently powered?)
       💡 Interviewers love candidates who ask "is this practically
          meaningful?" not just "is this statistically significant?"

[Logged to memory/progress.json | Committed to git]
```

---

Built with ❤️ for the GitAgent Hackathon by Kushagra
