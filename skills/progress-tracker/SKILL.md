---
name: progress-tracker
description: "Read, update, and summarise the user's interview preparation progress stored in memory/progress.json. Use when the user asks how they are doing, wants a progress report, wants to see weak areas, or when any other skill needs to log a result. This skill is the memory backbone of the agent."
allowed-tools: Read Write Bash
---

# Progress Tracker Skill

## Purpose
Maintain a persistent, git-native record of the user's interview performance. Every evaluated answer and every completed challenge is logged here. The agent reads this file at session start to personalise question selection.

## Progress File Schema
Location: `memory/progress.json`

```json
{
  "user": "candidate",
  "last_updated": "2025-04-05T10:30:00Z",
  "overall_score": 72,
  "sessions_completed": 5,
  "topics": {
    "probability": {
      "attempts": 8,
      "avg_score": 68,
      "last_score": 74,
      "weak_areas": ["Bayesian updating", "conditional probability"],
      "strong_areas": ["CLT", "distributions"]
    },
    "machine_learning": {
      "attempts": 12,
      "avg_score": 80,
      "last_score": 85,
      "weak_areas": ["kernel SVM", "EM algorithm"],
      "strong_areas": ["bias-variance", "gradient boosting", "regularisation"]
    },
    "sql": {
      "attempts": 4,
      "avg_score": 55,
      "last_score": 60,
      "weak_areas": ["window functions", "self-joins"],
      "strong_areas": ["basic aggregations"]
    },
    "code_challenges": {
      "attempted": 6,
      "passed": 4,
      "categories": {
        "pandas": { "attempted": 3, "passed": 2 },
        "numpy": { "attempted": 2, "passed": 2 },
        "sklearn": { "attempted": 1, "passed": 0 }
      }
    }
  },
  "session_history": [
    {
      "date": "2025-04-05",
      "topics_covered": ["probability", "machine_learning"],
      "questions_answered": 5,
      "avg_score": 74,
      "session_type": "qa"
    }
  ]
}
```

## Workflows

### Read progress (session start)
1. Read `memory/progress.json`
2. If file does not exist, create it with the default schema above
3. Identify topics where `avg_score < 65` — these are priority weak areas
4. Return a brief summary: overall score, top 2 weak areas, top 2 strong areas

### Log a Q&A result
1. Read current `memory/progress.json`
2. Update the relevant topic's `attempts`, `avg_score` (rolling average), `last_score`
3. If score < 65 and concept not in `weak_areas`, add it
4. If score >= 85 and concept in `weak_areas`, remove it (graduated)
5. Update `last_updated` and `overall_score` (average of all topic avg_scores)
6. Write back to `memory/progress.json`
7. Run: `git add memory/progress.json && git commit -m "progress: session $(date +%Y-%m-%d) — <topic>"`

### Generate progress report
Output format:
```
Progress Report — <date>

Overall readiness: <score>/100 (<assessment: needs work | making progress | interview ready>)

Sessions completed: <n>
Questions answered: <total>

Strengths (score ≥ 75):
  ✓ <topic>: <avg_score>/100
  ✓ <topic>: <avg_score>/100

Focus areas (score < 65):
  ✗ <topic>: <avg_score>/100 — weak on: <weak_areas>
  ✗ <topic>: <avg_score>/100 — weak on: <weak_areas>

Code challenges: <passed>/<attempted> passed

Recommendation: <one specific, actionable next step>
```

### Readiness assessment thresholds
- **Needs work**: overall_score < 60
- **Making progress**: 60 ≤ overall_score < 75
- **Interview ready**: overall_score ≥ 75 (with no topic below 60)

## Git commit convention
Always commit after updating progress:
```bash
git add memory/progress.json
git commit -m "progress: session YYYY-MM-DD — <comma-separated topics covered>"
```
This makes `git log memory/progress.json` a complete learning journal.
