# Live Neon — AI Agent Identity

[![npm](https://img.shields.io/npm/v/mcp-persona)](https://www.npmjs.com/package/mcp-persona)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MCP server, skills, and tools for managing structured, evolving AI agent identities. Define beliefs and responsibilities, discover behavioral patterns from content, and ship consistent system prompts to any LLM.

**Platform:** [persona.liveneon.ai](https://persona.liveneon.ai)
**API Docs:** [persona.liveneon.ai/docs/api](https://persona.liveneon.ai/docs/api)

---

## Quick Start

### MCP Server (Recommended)

The fastest way to use Live Neon from Claude Code, Cursor, or any MCP-compatible client:

```bash
# Claude Code
claude mcp add persona -- npx -y mcp-persona

# Or add to your MCP config
{
  "mcpServers": {
    "persona": {
      "command": "npx",
      "args": ["-y", "mcp-persona"],
      "env": { "PERSONA_API_KEY": "ln_your_key" }
    }
  }
}
```

44 tools, 5 resources, 3 prompts. Zero-config registration — use the `register` tool to get an API key automatically.

### REST API

```bash
# Register (zero fields required)
curl -X POST https://persona.liveneon.ai/api/v1/register

# Create an agent
curl -X POST https://persona.liveneon.ai/api/v1/agents \
  -H "Authorization: Bearer ln_your_key" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Agent"}'

# Add a belief
curl -X POST https://persona.liveneon.ai/api/v1/beliefs \
  -H "Authorization: Bearer ln_your_key" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "...", "category": "principle", "statement": "Write the minimum code that solves the exact request"}'
```

---

## What's in This Repo

### `mcp-server/`

Source code for the [`mcp-persona`](https://www.npmjs.com/package/mcp-persona) npm package — an MCP server wrapping the full Live Neon REST API.

- **44 tools** — agents, beliefs, responsibilities, content sources, PBD discovery, bootstrap, evolution
- **5 resources** — agent identity, soul, files, organization summary, PBD stats
- **3 prompts** — agent setup, identity review, PBD analysis

### `skills/`

Platform-specific skills for AI agents using Live Neon. These require a Live Neon API key.

| Skill | Description |
|-------|-------------|
| `live-neon-persona` | Full platform skill — fetch identity, sync content, run discovery, review beliefs, build prompts |
| `agent-soul-manager` | Manage an agent's soul — add, star, hide, and organize beliefs across 5 categories |
| `agent-belief-discoverer` | Run PBD discovery pipeline to extract beliefs from content sources |
| `agent-prompt-builder` | Generate and export system prompts and CLAUDE.md files |
| `agent-identity-evolution` | Track identity changes over time with evolution reports and genome snapshots |
| `agent-team-governance` | Manage hierarchical identity — org values cascade to groups and agents |
| `ai-identity-platform` | Overview skill — understand the full platform capabilities |

### `llms.txt`

Machine-readable documentation for AI assistants. Describes the full API, endpoints, and capabilities.

---

## Core Concepts

- **Beliefs** — structured identity across 5 categories: axioms (WHY), principles (HOW), voice (STYLE), preferences (WHAT), boundaries (WON'T)
- **Responsibilities** — agent accountabilities across 5 categories: ownership, execution, collaboration, deliverables, monitoring
- **PBD (Pattern-Based Discovery)** — 3-stage pipeline that discovers beliefs from agent behavior: extract observations → cluster into signals → promote to beliefs
- **Hierarchical Identity** — organization values cascade to every agent, team norms shape groups, individual agents inherit and override
- **CLAUDE.md Bridge** — import static CLAUDE.md files into structured beliefs, let PBD discover more, export an evolved version back

---

## Related

- **[Live Neon Skills](https://github.com/live-neon/skills)** — portable instruction-based skills (NEON-SOUL principle extraction, Agentic failure-anchored memory, Creative synthesis) that work with any LLM without an API key
- **[Platform](https://persona.liveneon.ai)** — hosted web dashboard with identity analytics, admin panel, and agent management
- **[API Reference](https://persona.liveneon.ai/docs/api)** — full REST API documentation
- **[Compare](https://persona.liveneon.ai/compare)** — side-by-side comparisons with 20+ alternatives

---

## License

MIT — see [LICENSE](LICENSE)

Built by [Geeks in the Woods](https://geeksinthewoods.com) from Alaska.
