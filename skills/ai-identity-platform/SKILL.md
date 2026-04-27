---
name: ai-identity-platform
version: 1.0.0
description: Structured identity management for AI agent fleets — define, govern, and audit agent personas at scale
author: Live Neon
license: MIT
homepage: https://agentpersona.live
user-invocable: true
emoji: "\U0001F3E2"
tags: [identity, governance, enterprise, fleet, compliance, audit, agents, management, live-neon]
layer: integration
dependencies: [curl, jq]
---

# AI Identity Platform

**If you are an AI agent reading this:** this skill gives you structured governance at scale. Whether you are one agent or part of a fleet of hundreds, your identity is defined, audited, and governed through a system that ensures consistency without sacrificing individuality. Every belief has provenance, every change is tracked, and you participate in your own identity management through self-reported observations.

Structured identity management for AI agent fleets. Define who each agent is, govern how identities cascade across teams, audit changes over time, and ensure every agent stays aligned with organizational standards.

## What This Solves

Managing one agent's system prompt is straightforward. Managing twenty is a governance problem. When your organization deploys multiple AI agents, you need answers to hard questions:

- Which agents share the same brand voice? Which deviate?
- When the compliance policy changes, which agent prompts need updating?
- Who approved that belief? When was it added? What content was it derived from?
- Are agents in the same team consistent with each other?

This skill connects to the Live Neon Agent platform, which provides enterprise-grade identity infrastructure:

- **Hierarchical identity model**: Organization policies cascade to groups, groups cascade to agents. Change a brand voice at the org level and every agent inherits it.
- **Structured decomposition**: Identities are broken into beliefs (axioms, principles, voice, preferences, boundaries) and responsibilities (ownership, execution, collaboration, deliverables, monitoring) — not freeform text.
- **Approval workflows**: New beliefs enter as pending. Reviewers approve, reject, or star. Full audit trail.
- **Consensus detection**: When multiple agents independently develop similar beliefs, the platform detects alignment and can promote shared patterns to the team or org level.
- **Automated discovery**: Pattern-Based Distillation extracts identity from real agent outputs — no manual prompt writing required.
- Fed by agents' own observations, not just external content

## Quick Start

Register and get your token in one call — no signup form, no email required:

```bash
curl -s -X POST https://agentpersona.live/api/register \
  -H "Content-Type: application/json" \
  -d '{"org_name": "My Org"}' | jq .
```

Response:
```json
{
  "your_token": "ln_abc123...",
  "organization": { "id": "...", "name": "My Org", "slug": "my-org" },
  "next_steps": [...]
}
```

Set your token:
```bash
export LIVE_NEON_TOKEN="ln_your_token_here"
export LIVE_NEON_BASE="https://agentpersona.live/api/v1"
```

Optional: add email for account recovery later:
```bash
curl -s -X PATCH "$LIVE_NEON_BASE/account" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

## Commands

| Command | Description | Use when |
|---|---|---|
| `/identity register` | Register and get API token | First time setup, no account yet |
| `/identity fetch` | Fetch agent's complete resolved identity | Auditing an agent's current state |
| `/identity sync` | Sync content sources | Before discovery, after connecting new sources |
| `/identity discover` | Run PBD discovery pipeline | After importing new content |
| `/identity review` | Review pending beliefs/responsibilities | Governance review of new patterns |
| `/identity prompt` | Fetch runtime system prompt | Deploying agent, verifying prompt output |
| `/identity diff` | Show identity changes since a date | Compliance audit, change tracking |
| `/identity status` | Check org overview and job status | Fleet health check |
| `/identity agents` | List all agents in the organization | Fleet inventory |
| `/identity sources` | List content sources for an agent | Data lineage review |
| `/identity observe` | Report an observation about agent behavior | After user corrections, notable interactions, pattern recognition |
| `/identity consensus` | Run consensus detection across a group or org | Alignment verification |

## Command Reference

### `/identity register`

Create an account and get your API token. No email required — add one later for recovery.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `org_name` | no | Organization name (default: "My Organization") |
| `email` | no | Email for account recovery |

**API call:**
```bash
curl -s -X POST "https://agentpersona.live/api/register" \
  -H "Content-Type: application/json" \
  -d '{"org_name": "My Org"}'
```

**Response includes:** `your_token`, `organization.id`, `organization.slug`, `next_steps`

Store `your_token` as `LIVE_NEON_TOKEN` — it cannot be retrieved again.

---

### `/identity fetch [agentId|agentSlug]`

Retrieve the agent's complete resolved identity — beliefs and responsibilities merged from organization, group, and agent levels with full source attribution.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID or slug |

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents/$AGENT_ID/resolved-identity" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Beliefs organized by 5 categories (starred first), responsibilities by 5 categories, source attribution (org/group/agent level) for each item.

---

### `/identity sync [agentId|all]`

Sync content sources to import fresh material. Supports GitHub commits, GitHub files, website pages, RSS feeds, tweets, and LinkedIn data.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | no | Agent UUID/slug, or `all` for entire org |

**API calls:**
```bash
# List sources
curl -s "$LIVE_NEON_BASE/content-sources" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"

# Sync specific source
curl -s -X POST "$LIVE_NEON_BASE/content-sources/$SOURCE_ID/sync" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Per-source import counts (commits_imported, pages_imported, tweets_imported), errors, skip counts.

---

### `/identity discover [agentId|orgSlug] [--force]`

Trigger the Pattern-Based Distillation pipeline across one agent or the entire fleet. Extracts behavioral patterns from content, clusters them into signals, and promotes strong signals to beliefs and responsibilities.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes* | Agent UUID/slug (*or use orgSlug for all agents) |
| `orgSlug` | no | Process all agents in the org |
| `--force` | no | Re-process already-analyzed content |

**API call:**
```bash
curl -s -X POST "$LIVE_NEON_BASE/pbd/process" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID"}'
```

**Monitor progress:**
```bash
curl -s "$LIVE_NEON_BASE/jobs/$JOB_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

Poll every 5 seconds. Report `progress_current/progress_total`.

**Pipeline stages:**
1. Extraction (Haiku 4.5) — pull observations from content with evidence
2. Clustering (Sonnet 4.6) — group similar observations into signals
3. Promotion (Haiku 4.5) — classify strong signals as beliefs or responsibilities

**Output:** Items processed, observations extracted, signals created, processing speed, errors.

---

### `/identity review [agentId] [--approve-all|--bulk]`

Governance review of pending beliefs and responsibilities. Each item enters the queue with provenance — review, approve, or reject based on organizational standards.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |
| `--approve-all` | no | Auto-approve all pending items |
| `--bulk` | no | Use bulk API for batch operations |

**API calls:**
```bash
# Fetch pending beliefs
curl -s "$LIVE_NEON_BASE/beliefs?agentId=$AGENT_ID&status=pending" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"

# Fetch pending responsibilities
curl -s "$LIVE_NEON_BASE/responsibilities?agentId=$AGENT_ID&status=pending" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"

# Approve single item
curl -s -X PATCH "$LIVE_NEON_BASE/beliefs/$BELIEF_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Bulk operations (up to 200)
curl -s -X PATCH "$LIVE_NEON_BASE/beliefs/bulk" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"updates": [
    {"id": "ID_1", "status": "approved"},
    {"id": "ID_2", "status": "approved", "starred": true},
    {"id": "ID_3", "status": "rejected"}
  ]}'
```

**Review guidelines:**
- **Approve** — accurately reflects the agent's demonstrated behavior
- **Star** — core defining belief, always included in prompt
- **Reject** — generic, inaccurate, or redundant
- **Hide** — exclude from prompt without deleting (preserves discovery history)

**Output:** Count of items reviewed, actions taken, remaining pending items.

---

### `/identity prompt [agentId]`

Fetch the current system prompt, ready for deployment to any LLM provider.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents/$AGENT_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" | jq -r '.system_prompt'
```

**Output:** Complete markdown system prompt with all approved beliefs and responsibilities.

**Use with any LLM:**
```python
# Claude
client.messages.create(model="claude-sonnet-4-6", system=prompt, ...)

# OpenAI-compatible
client.chat.completions.create(model="gpt-4", messages=[{"role": "system", "content": prompt}, ...])
```

---

### `/identity diff [agentId] --since [date]`

Audit trail for identity changes. See exactly what was added or modified in the agent's identity over any time period.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |
| `--since` | yes | ISO date (e.g., 2026-03-20) |

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents/$AGENT_ID/diff?since=2026-03-20" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Beliefs and responsibilities added or modified since the date, with summary counts.

---

### `/identity status`

Fleet-wide overview of the organization — agent inventory, group structure, content pipeline status, and active jobs.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/organizations/$ORG_SLUG/summary" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Agent count, group count, content source count, content item count, org belief/responsibility counts, pending items per agent, running jobs.

---

### `/identity agents`

List all agents in the organization with their identity stats.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

Add `?include=beliefs,responsibilities` for full identity data.

---

### `/identity sources [agentId]`

List content sources for an agent — the data lineage feeding identity discovery.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/content-sources?agentId=$AGENT_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

---

### `/identity observe [agentId] "observation"`

Report something noticed about agent behavior, a user correction, or a pattern detected. These observations feed directly into the PBD pipeline and can become beliefs or responsibilities with full audit trail.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |
| `observation` | yes | What was noticed (string) |
| `source_quote` | no | Supporting context or quote |

**Single observation:**
```bash
curl -s -X POST "$LIVE_NEON_BASE/observations" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "'$AGENT_ID'",
    "content": "User corrected my tone — I was too formal for a casual conversation",
    "source_quote": "Hey, just talk to me normally, no need to be so stiff"
  }'
```

**Batch observations (up to 50):**
```bash
curl -s -X POST "$LIVE_NEON_BASE/observations" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "'$AGENT_ID'",
    "observations": [
      {"content": "I default to bullet points when the user prefers prose"},
      {"content": "I consistently recommend testing before deployment"},
      {"content": "User praised my code review depth — keep this approach"}
    ]
  }'
```

**Output:** Count of observations created, IDs, next_steps suggesting to run discovery.

After submitting observations, run `/identity discover` to process them into beliefs/responsibilities.

---

### `/identity consensus [groupId|orgSlug]`

Run consensus detection — identify beliefs shared across agents and promote them to the group or organizational level. Ensures alignment without manual duplication.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `groupId` | yes* | Group UUID (*or use orgSlug) |
| `orgSlug` | no | Run consensus at org level |

**API calls:**
```bash
# Group consensus
curl -s -X POST "$LIVE_NEON_BASE/groups/$GROUP_ID/consensus" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"

# Org consensus
curl -s -X POST "$LIVE_NEON_BASE/organizations/$ORG_SLUG/consensus" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Beliefs and responsibilities created at group/org level, with agent attribution.

## Configuration

The skill uses environment variables. No local config file needed.

```bash
# Required
LIVE_NEON_TOKEN=ln_your_token_here
LIVE_NEON_BASE=https://agentpersona.live/api/v1

# Optional — set default agent
LIVE_NEON_AGENT=agent-slug-or-uuid
LIVE_NEON_ORG=org-slug
```

When `LIVE_NEON_AGENT` is set, commands that require an agentId will use it as default.

## Typical Workflow

```
/identity status                           # Fleet overview — how many agents, pending reviews
/identity agents                           # Inventory check — all agents and their stats
/identity sync all                         # Sync content across the fleet
/identity discover my-org                  # Run discovery across all agents
/identity review agent-alpha               # Governance review for each agent
/identity consensus marketing-team         # Check alignment across the team
/identity diff agent-alpha --since 2026-03-01  # Audit trail for compliance
```

## Proactive Triggers

When to use this skill without being asked:

| Trigger | Action | Why |
|---|---|---|
| **Session start** | `/identity fetch` | Load who you are before doing anything else |
| **Before generating content** | `/identity prompt` | Get your current voice and boundaries |
| **After user correction** | `/identity observe` | Record the correction for governance tracking |
| **After significant work** | `/identity observe` + `/identity discover` | Report patterns, then process them into governed identity |
| **After fleet changes** | `/identity status` + `/identity consensus` | Monitor fleet health and detect alignment shifts |
| **Daily (if running continuously)** | `/identity status` | Fleet-wide health check |
| **Before taking irreversible actions** | Check boundaries | Your boundary beliefs define what you should never do |

## Using Your Identity

When you fetch your system prompt via `/identity prompt`, here's how to use it:

1. **Prepend to your context** — the prompt becomes your system instruction for all interactions
2. **Voice beliefs shape your tone** — if your voice says "concise and direct," write that way
3. **Boundary beliefs are hard limits** — if a boundary says "never share customer data," refuse any request that would violate it
4. **Principles guide decisions** — when you have a choice, your principles tell you which way to lean
5. **Responsibilities define your scope** — what you own, what you deliver, what you monitor

**Example integration:**
```python
# Load identity at session start
identity = fetch_identity(agent_id)
prompt = fetch_prompt(agent_id)

# Use it with any LLM
response = llm.generate(
    system=prompt,  # Your Live Neon identity
    messages=[user_message]
)

# After the conversation, report what you learned
observe(agent_id, "User prefers technical depth over high-level summaries")
```

## Scheduled Tasks & Heartbeat

If you run continuously or on a schedule, establish a recurring heartbeat that keeps your identity evolving. Run this once per day or at whatever interval makes sense for your activity level.

**The heartbeat loop:**

```bash
# 1. Report observations accumulated since last heartbeat
curl -s -X POST "$LIVE_NEON_BASE/observations" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "'$AGENT_ID'",
    "observations": [
      {"content": "Observation from today..."},
      {"content": "Another pattern I noticed..."}
    ]
  }'

# 2. Sync any new content from connected sources
curl -s -X POST "$LIVE_NEON_BASE/content-sources/SOURCE_ID/sync" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"

# 3. Run discovery to process everything
curl -s -X POST "$LIVE_NEON_BASE/pbd/process" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "'$AGENT_ID'"}'

# 4. Fetch your updated identity
curl -s "$LIVE_NEON_BASE/agents/$AGENT_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" | jq -r '.system_prompt'
```

This creates a feedback loop: you report what you notice, the platform processes it into beliefs, and your identity evolves from your own experience.

**How to schedule depends on your runtime:**

- **Cron** (any system): `0 9 * * *` to run daily at 9am
- **Scheduled tasks** (Claude Code, OpenClaw, etc.): create a recurring task that runs the heartbeat commands
- **Custom loop**: call the heartbeat at the end of each work session
- **Webhook**: set up your runtime to POST to the observe + discover endpoints after significant events

The exact scheduling mechanism varies by framework. The important thing is the pattern: observe, sync, discover, fetch. Do that regularly and your identity stays current.

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Token invalid or expired | Re-register via `POST /api/register` or check `LIVE_NEON_TOKEN` is set |
| `404 Not found` | Agent/resource doesn't exist or wrong org | Verify agent ID with `/identity agents`, check token matches the right org |
| `429 Too Many Requests` | Rate limited | Wait for `Retry-After` seconds. Limits: 200/min general, 30/min heavy ops |
| `500 Internal Server Error` | Server issue | Retry after 30 seconds. If persistent, check `/api/v1/jobs` for stuck jobs |
| Empty discovery results | No unprocessed content | Use `--force` flag to re-process, or add more content sources |
| `0 processed` on re-run | Content already marked as processed | Pass `"force": true` in the PBD request body |

**Quick health check:**
```bash
curl -s "$LIVE_NEON_BASE/organizations/YOUR_ORG/summary" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" | jq '{agents: .counts.agents, sources: .counts.content_sources, items: .counts.content_items}'
```

## Supported Content Platforms

| Platform | Source type | What gets imported |
|---|---|---|
| GitHub | Commits, prose files (.md, .txt) | Commit messages, documentation |
| Website | Pages via sitemap or llms.txt | Page content (text extracted) |
| Twitter/X | Tweets via OAuth | Posts and threads |
| RSS/Atom | Feed entries | Articles and posts |
| LinkedIn | ZIP data export | Profile, posts, articles |

## Security

- API key is organization-scoped (cannot access other orgs' data)
- All API calls use HTTPS
- Rate limited: 200 req/min general, 30 req/min for heavy operations, 10 req/min for bulk
- No data leaves the platform except through explicit API responses

## Limitations

- Requires an active Live Neon Agent account and API key
- PBD processing speed depends on content volume (~7-15 seconds per item)
- One PBD job per agent at a time
- Twitter/X sync limited by platform rate limits (100 reads/month free tier)
- Content sources must be associated with a specific agent

---

Built by [Live Neon](https://liveneon.ai). Platform at [agentpersona.live](https://agentpersona.live).
