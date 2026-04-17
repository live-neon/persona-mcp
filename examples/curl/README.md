# curl Examples

Copy-paste commands for every major API operation.

## Register

```bash
curl -X POST https://persona.liveneon.ai/api/v1/register
# Save the your_token value
export TOKEN="ln_..."
```

## Create Agent

```bash
curl -X POST https://persona.liveneon.ai/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Agent", "description": "A coding assistant"}'
```

## Add Belief

```bash
curl -X POST https://persona.liveneon.ai/api/v1/beliefs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "category": "principle", "statement": "Write tests before implementation"}'
```

## Add Responsibility

```bash
curl -X POST https://persona.liveneon.ai/api/v1/responsibilities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "category": "ownership", "statement": "Own the CI/CD pipeline"}'
```

## Import CLAUDE.md

```bash
curl -X POST https://persona.liveneon.ai/api/v1/agents/AGENT_ID/import-claude-md \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "# CLAUDE.md\n\n## Rules\n- Always write tests first\n- Keep it simple", "dryRun": true}'
```

## Export CLAUDE.md

```bash
curl -X POST https://persona.liveneon.ai/api/v1/agents/AGENT_ID/dynamic-prompt \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "claude_md"}'
```

## Run PBD Discovery

```bash
curl -X POST https://persona.liveneon.ai/api/v1/pbd/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID"}'
```

## List Beliefs

```bash
curl https://persona.liveneon.ai/api/v1/beliefs?agentId=AGENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Get Agent with System Prompt

```bash
curl https://persona.liveneon.ai/api/v1/agents/AGENT_ID \
  -H "Authorization: Bearer $TOKEN"
```
