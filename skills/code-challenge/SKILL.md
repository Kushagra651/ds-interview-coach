---
name: code-challenge
description: "Give the user a Python coding challenge relevant to data science (pandas, numpy, sklearn, statistics). Execute their submitted code via Node.js child_process, compare output to expected, and give line-by-line feedback. Use when the user asks for a coding problem, wants to practice Python DS skills, or needs to test their implementation."
allowed-tools: Bash Write Read
---

# Code Challenge Skill

## Purpose
Present a realistic DS/ML Python coding challenge. Accept the user's solution. Run it in a sandboxed Node.js subprocess. Compare actual vs expected output. Give structured feedback on correctness, efficiency, and code quality.

## Challenge Categories
- **pandas**: data cleaning, groupby, merge, pivot, apply, window functions
- **numpy**: vectorised operations, broadcasting, linear algebra
- **statistics**: implement a statistical test, compute metrics from scratch
- **sklearn**: build a pipeline, cross-validate, tune hyperparameters
- **algorithms**: implement a ML algorithm from scratch (e.g., k-means, linear regression via gradient descent)

## Difficulty Levels
- **Easy**: Single function, one concept, expected output is a number or small DataFrame
- **Medium**: Multi-step pipeline, requires combining 2–3 concepts
- **Hard**: Algorithm from scratch, efficiency matters, edge cases present

## Workflow

### Step 1 — Present the challenge
Format:
```
Challenge: <name>
Category: <category>
Difficulty: <difficulty>
Time limit: <5 | 10 | 15> minutes

Problem:
<clear problem statement with input/output specification>

Input:
<exact input data as Python code or description>

Expected output:
<exact expected output — show this upfront so the user can self-verify>

Constraints:
- <constraint 1, e.g., "do not use a for loop">
- <constraint 2, e.g., "result must be a DataFrame with columns ['x', 'y']">
```

### Step 2 — Wait for the user's solution
The user submits Python code. Accept it as a code block.

### Step 3 — Execute the code
Write the user's solution to a temp file and run it using the following Node.js runner script. Save this as `/tmp/run_solution.js`:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

const code = fs.readFileSync('/tmp/solution.py', 'utf8');
try {
  const result = execSync(`python3 -c "${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`, {
    timeout: 10000,
    encoding: 'utf8'
  });
  console.log('OUTPUT:', result);
} catch (err) {
  console.log('ERROR:', err.stderr || err.message);
}
```

Write the user's code to `/tmp/solution.py`, then run: `node /tmp/run_solution.js`

### Step 4 — Compare and evaluate

**If output matches expected:**
```
✓ Correct output

Code quality review:
- Efficiency: <O(n) analysis or pandas idiom assessment>
- Readability: <naming, structure>
- Pythonic: <any non-idiomatic patterns>
- Edge cases not handled: <list any>

Optimised solution (if theirs can be improved):
<cleaner version with explanation>
```

**If output does not match:**
```
✗ Output mismatch

Your output:   <actual>
Expected:      <expected>

Line-by-line diagnosis:
- Line <N>: <what went wrong and why>

Hint: <one targeted hint, not the solution>
```

### Step 5 — Update progress
Log the challenge name, category, pass/fail, and timestamp to `memory/progress.json`.

## Node Compatibility Note
All challenges must use standard Python 3 libraries + pandas/numpy/sklearn. No system binaries, no GPU dependencies. This ensures compatibility with clawless WebContainer environments.
