// gitclaw local configuration
// When ANTHROPIC_API_KEY is not set, gitclaw will use this config to fall back to Ollama
module.exports = {
  model: {
    // Override model via env var: GITCLAW_MODEL=ollama:llama3.2
    preferred: process.env.GITCLAW_MODEL || process.env.ANTHROPIC_API_KEY
      ? "claude-sonnet-4-20250514"
      : "ollama:llama3.2",
  },
  ollama: {
    baseUrl: process.env.OLLAMA_HOST || "http://localhost:11434",
  },
};
