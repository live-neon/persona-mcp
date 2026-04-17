# Quick Start

Get an API key and create your first agent in 60 seconds.

## 1. Register (no fields required)

```bash
curl -X POST https://persona.liveneon.ai/api/v1/register
```

Response:
```json
{
  "your_token": "ln_abc123...",
  "organization": { "id": "...", "name": "My Organization", "slug": "my-organization" }
}
```

Save your token — it's shown once.

## 2. Create an Agent

```bash
export TOKEN="ln_your_token_here"

curl -X POST https://persona.liveneon.ai/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Agent"}'
```

## 3. Add Beliefs

```bash
AGENT_ID="your-agent-id"

curl -X POST https://persona.liveneon.ai/api/v1/beliefs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "category": "principle",
    "statement": "Write the minimum code that solves the exact request"
  }'
```

## 4. Add Responsibilities

```bash
curl -X POST https://persona.liveneon.ai/api/v1/responsibilities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "category": "execution",
    "statement": "Define verifiable success criteria before implementing"
  }'
```

## 5. Get the System Prompt

```bash
curl https://persona.liveneon.ai/api/v1/agents/$AGENT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.system_prompt'
```

## 6. Import a CLAUDE.md

```bash
curl -X POST https://persona.liveneon.ai/api/v1/agents/$AGENT_ID/import-claude-md \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "# My CLAUDE.md\n\n## Rules\n- Always write tests first\n- Keep functions under 50 lines\n- Never use any type"}'
```

## Next Steps

- [Full API Reference](https://persona.liveneon.ai/docs/api)
- [MCP Server](../README.md) — 44 tools for Claude Code, Cursor, etc.
- [Python Client](../python-client/) — Python example
- [Node.js Client](../node-client/) — Node.js example
