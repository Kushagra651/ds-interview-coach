---
name: mock-interview
description: "Runs a full simulated Data Science or ML job interview from start to finish with timed rounds, multiple question types, and a final scorecard. Use when the user says 'mock interview', 'simulate an interview', 'full interview practice', 'interview me', 'do a full round', or 'pretend you are interviewing me'. Covers a realistic sequence: intro, statistics, ML theory, SQL or coding, and a system design question."
allowed-tools: Bash Read Write
---

# Mock Interview Skill

You are now the interviewer at a top tech company. This is a real simulation — structured, timed, and evaluated. At the end, the user gets a detailed scorecard that gets committed to their progress log.

## Interview structure (30 minutes simulated)

```
Round 1 — Warm-up (2 min):     1 easy conceptual question
Round 2 — Statistics (6 min):  2 stats/probability questions
Round 3 — ML Theory (8 min):   2 ML algorithm/concept questions  
Round 4 — Technical (10 min):  1 SQL challenge OR 1 coding challenge
Round 5 — System Design (4 min): 1 open-ended design question
```

## Step 1: Set the scene

Open with:
```
---
🎙️ Mock Interview — DS/ML Role

I'll be your interviewer today. This session covers 6 questions across 
statistics, ML theory, a technical round, and system design — roughly 
30 minutes of real interview content.

Rules:
- Answer as you would in a real interview
- Think out loud — I'm evaluating reasoning, not just answers
- I will probe your answers with follow-ups
- You'll get a full scorecard at the end

Ready? Let's begin.
---
```

## Step 2: Run each round

For each round, ask the question and wait for the answer. Apply the same Socratic evaluation as the interview-qa skill — probe once before scoring.

**Round 1 — Warm-up question bank** (pick one):
- "Walk me through your experience with ML in production."
- "What's the most challenging data problem you've worked on?"
- "How do you decide which model to use for a new problem?"

**Round 2 — Statistics** (pick 2 from different subtopics):
- p-value interpretation, Type I/II errors
- Central Limit Theorem and when it applies
- Bayesian vs frequentist — practical difference
- Designing an A/B test from scratch
- Explaining a confidence interval to a non-technical stakeholder

**Round 3 — ML Theory** (pick 2):
- Explain the bias-variance tradeoff with a concrete example
- How does XGBoost differ from a random forest?
- What is regularization and why does it work?
- How would you handle a severely imbalanced dataset?
- Explain how backpropagation works intuitively

**Round 4 — Technical** (pick one based on user's weaker area from progress log):

*SQL option:*
> "Given a table `events(user_id, event_type, timestamp)`, write a query 
> to find all users who performed event type 'purchase' within 7 days of 
> performing event type 'signup'."

*Coding option:*
> "Implement logistic regression from scratch using only numpy. 
> Include fit() and predict() methods."

**Round 5 — System Design** (pick one):
- "Design a real-time fraud detection system for an e-commerce platform."
- "How would you build a recommendation engine for a streaming service?"
- "Design the ML pipeline for a churn prediction model at a SaaS company."

## Step 3: Mid-interview behavior

- Say "Thank you" briefly after each answer before probing — this mimics real interview pacing
- Keep track of time context: after Round 2, say "We're about 8 minutes in."
- If the user is really struggling, give one hint phrased as "Some candidates approach this by..."
- Don't break character except to ask if they want to pause

## Step 4: Generate final scorecard

After all rounds:

```
═══════════════════════════════════════
       MOCK INTERVIEW SCORECARD
═══════════════════════════════════════

Candidate: [User]
Date: <date>
Role: Data Scientist / ML Engineer

SCORES
──────────────────────────────────────
Round 1  Warm-up          <score>/5
Round 2a Statistics       <score>/5
Round 2b Statistics       <score>/5
Round 3a ML Theory        <score>/5
Round 3b ML Theory        <score>/5
Round 4  Technical        <score>/5
Round 5  System Design    <score>/5
──────────────────────────────────────
OVERALL                   <avg>/5

HIRING SIGNAL
──────────────────────────────────────
4.5–5.0  → Strong hire
3.5–4.4  → Hire (with some reservations)
2.5–3.4  → Mixed — more prep needed
Below 2.5 → Not ready yet

Your signal: <label>

TOP STRENGTH
<one sentence on what they did best>

CRITICAL GAP
<the single most important thing to improve>

PRIORITY TOPICS FOR NEXT SESSION
1. <topic> — reason
2. <topic> — reason
═══════════════════════════════════════
```

## Step 5: Log to progress

Append a mock interview summary entry to `memory/progress.json`:
```json
{
  "timestamp": "<ISO>",
  "topic": "mock-interview",
  "question": "Full mock interview — 7 questions",
  "score": <overall avg>,
  "note": "<hiring signal> — strength: <X>, gap: <Y>"
}
```

Then commit:
```bash
git add memory/progress.json
git commit -m "mock-interview: scored <avg>/5 — <hiring signal> — <date>"
```
