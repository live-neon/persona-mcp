# mcp-persona

MCP server for [Persona](https://agentpersona.live) -- AI agent identity platform with self-learning personality.

Gives any MCP-compatible agent (Claude Desktop, Claude Code, Cursor, Windsurf) direct access to manage its identity, run pattern-based discovery, and evolve its beliefs from real behavior.

## Install

```json
{
  "mcpServers": {
    "persona": {
      "command": "npx",
      "args": ["-y", "mcp-persona"],
      "env": {
        "PERSONA_API_KEY": "ln_your_key"
      }
    }
  }
}
```

Or via Claude Code CLI:

```bash
claude mcp add persona -- npx -y mcp-persona
```

## Get an API key

```bash
curl -X POST https://agentpersona.live/api/v1/register
```

Zero fields required. Returns your `ln_` API key immediately.

## What's included

**44 tools** across identity management, beliefs, responsibilities, PBD discovery, content sources, conversations, evolution, jobs, and bootstrap.

**5 resources** for schema definitions, identity data, and discovery stats.

**3 prompts** for getting started, evolving identity, and reviewing pending items.

## Key tools

| Tool | What it does |
|------|-------------|
| `register` | Create account + org + API key in one call |
| `get_identity` | Get merged identity (org + group + agent beliefs) |
| `add_belief` | Add a belief with semantic dedup |
| `run_discovery` | Trigger PBD to extract patterns from content |
| `review_pending` | See beliefs/responsibilities awaiting approval |
| `get_discovery_stats` | PBD quality metrics and funnel stats |
| `complete_conversation` | Mark conversation done, auto-triggers PBD |
| `run_dedup` | Merge semantically duplicate beliefs |
| `snapshot_genome` | Capture identity at a point in time |

## Environment variables

| Name | Required | Description |
|------|----------|-------------|
| `PERSONA_API_KEY` | Yes | API key (`ln_` prefix) from registration |
| `PERSONA_BASE_URL` | No | API base URL (default: `https://agentpersona.live/api/v1`) |

## Development

```bash
cd mcp-server
npm install
npm run build
npm run inspect    # Opens MCP Inspector
```

## Links

- Website: https://agentpersona.live
- API docs: https://agentpersona.live/llms.txt
- OpenAPI: https://agentpersona.live/openapi.json
- GitHub: https://github.com/live-neon/persona-mcp
