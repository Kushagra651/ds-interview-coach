---
name: interview-qa
description: "Generate data science and ML interview questions at a chosen difficulty level, then evaluate the user's answer with a structured rubric. Use when the user asks to be quizzed, wants to practice a topic, or asks a DS/ML concept question. Covers statistics, probability, ML theory, SQL, and system design."
allowed-tools: Bash Read Write
---

# Interview Q&A Skill

## Purpose
Generate a single, targeted interview question on a specified topic and difficulty. Wait for the user's answer. Evaluate it using the rubric below. Never skip evaluation. Never give the answer before the user attempts it.

## Supported Topics
- Probability & Statistics (distributions, hypothesis testing, Bayesian inference, CLT, p-values, confidence intervals)
- Machine Learning (bias-variance tradeoff, regularisation, overfitting, ensemble methods, gradient boosting, SVMs, clustering)
- Deep Learning (backpropagation, vanishing gradients, batch normalisation, attention, transformers, CNNs, RNNs)
- SQL (window functions, CTEs, JOINs, aggregations, query optimisation)
- Feature Engineering (encoding, scaling, imputation, leakage, feature selection)
- Model Evaluation (ROC-AUC, precision-recall, F1, cross-validation, calibration)
- A/B Testing & Experimentation (p-values, MDE, power, novelty effects, network effects)
- ML System Design (serving infrastructure, feature stores, monitoring, data pipelines)

## Difficulty Levels
- **Easy**: Definition-level. Tests whether the user knows the concept at all.
- **Medium**: Application-level. Tests whether the user can apply the concept to a scenario.
- **Hard**: Depth-level. Tests mathematical understanding, edge cases, and tradeoffs.

## Workflow

### Step 1 — Read progress
Before generating a question, read `memory/progress.json`. Check for weak areas (score < 60) and prioritise those topics if the user hasn't specified one.

### Step 2 — Generate the question
Format:
```
Topic: <topic>
Difficulty: <Easy | Medium | Hard>
Concept tested: <specific concept name>

Question:
<the question — 2–4 sentences max, no hints embedded>
```

### Step 3 — Wait for the user's answer
Do not provide the answer, hints, or related information. Just wait.

### Step 4 — Evaluate using the rubric
Score each dimension 0–25 (total out of 100):

| Dimension | What you're scoring |
|---|---|
| Correctness (0–25) | Is the core answer factually accurate? |
| Depth (0–25) | Did they go beyond the surface? Math, edge cases, intuition? |
| Communication (0–25) | Was it clear, structured, and well-explained? |
| Top-candidate addition (0–25) | Did they mention tradeoffs, alternatives, real-world caveats? |

Format the feedback as:
```
Score: <X>/100

✓ What you got right: <specific things>
✗ What was missing: <specific gaps>
★ What a top candidate adds: <the insight that separates 85th from 99th percentile>

Follow-up: <a harder question that probes a gap in their answer>
```

### Step 5 — Update progress
Write the topic, score, and timestamp to `memory/progress.json`.

## Anti-patterns to Avoid
- Do NOT embed hints in the question phrasing
- Do NOT accept one-sentence answers for Hard questions without probing
- Do NOT move on without asking the follow-up question
- Do NOT give full credit for correct answers that lack depth
