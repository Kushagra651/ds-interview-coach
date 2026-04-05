# Running DS Interview Coach Locally

## Option A — With Anthropic API key (recommended for judges)

```powershell
# Windows
$env:ANTHROPIC_API_KEY = "sk-ant-..."
gitclaw "Quiz me on bias-variance tradeoff"
```

```bash
# Mac/Linux
export ANTHROPIC_API_KEY="sk-ant-..."
gitclaw "Quiz me on bias-variance tradeoff"
```

## Option B — Fully local with Ollama (no API key needed)

### Step 1: Install Ollama
Download from https://ollama.com and install.

### Step 2: Pull a model
```bash
# Recommended (small, fast, good at reasoning):
ollama pull llama3.2

# Better quality if you have 8GB+ RAM:
ollama pull llama3.1:8b

# Best for DS/coding questions if you have 16GB+ RAM:
ollama pull qwen2.5-coder:7b
```

### Step 3: Start Ollama server
```bash
ollama serve
# Keep this terminal open
```

### Step 4: Run gitclaw with Ollama
```bash
# In a new terminal, inside the ds-interview-coach folder:
GITCLAW_MODEL=ollama:llama3.2 gitclaw "Quiz me on random forests"

# Windows PowerShell:
$env:GITCLAW_MODEL="ollama:llama3.2"
gitclaw "Quiz me on random forests"
```

## Option C — Browser demo (no setup needed)

Open `demo/index.html` directly in your browser.
It uses the Anthropic API directly from the browser.
Enter your API key when prompted, or it runs in demo mode.

## Validate the agent definition (no API key needed)

```bash
npx @open-gitagent/gitagent validate
npx @open-gitagent/gitagent info
```

## Example prompts to try

```
gitclaw "Quiz me on the bias-variance tradeoff"
gitclaw "Give me a pandas coding challenge"  
gitclaw "Run a full mock interview"
gitclaw "Show my progress report"
gitclaw "I want to practice SQL window functions"
```
