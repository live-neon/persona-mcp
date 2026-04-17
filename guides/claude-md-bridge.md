# CLAUDE.md Import & Export Bridge

Import static CLAUDE.md files into structured beliefs. Let PBD discover more from behavior. Export an evolved version back to your repo.

## The Loop

```
Static CLAUDE.md → Import → Structured Beliefs → PBD Discovery → Export → Evolved CLAUDE.md
```

You started with 4 rules. 30 days later, you have 47 beliefs backed by evidence.

## Import

```bash
# Dry run — preview what will be extracted
curl -X POST https://persona.liveneon.ai/api/v1/agents/AGENT_ID/import-claude-md \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "YOUR CLAUDE.MD CONTENT HERE", "dryRun": true}'

# Import for real
curl -X POST https://persona.liveneon.ai/api/v1/agents/AGENT_ID/import-claude-md \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "YOUR CLAUDE.MD CONTENT HERE"}'
```

The LLM parser:
- Decomposes rules into categorized beliefs and responsibilities
- Deduplicates against existing beliefs (semantic similarity)
- Tracks provenance (source: "claude_md_import")

## Export

```bash
curl -X POST https://persona.liveneon.ai/api/v1/agents/AGENT_ID/dynamic-prompt \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "claude_md"}'
```

Returns a natural, well-structured CLAUDE.md (not bullet lists) that weaves beliefs into sections:
- Axioms become "why" paragraphs
- Principles become "how" guidelines
- Voice becomes style notes
- Starred beliefs get prominence

## Supported Formats

The importer handles any agent identity file:
- CLAUDE.md (Claude Code)
- .cursorrules (Cursor)
- AGENTS.md (cross-platform)
- agents.yaml (CrewAI)
- copilot-instructions.md (GitHub Copilot)
- .windsurfrules (Windsurf)
- Any system prompt text
