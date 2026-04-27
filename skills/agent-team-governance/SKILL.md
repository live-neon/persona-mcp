---
name: agent-team-governance
version: 1.0.0
description: Govern identity across AI agent teams — cascading beliefs, consensus detection, and organizational alignment
author: Live Neon
license: MIT
homepage: https://agentpersona.live
user-invocable: true
emoji: "\U0001F465"
tags: [governance, teams, consensus, alignment, cascading, multi-agent, organization, groups, live-neon]
layer: integration
dependencies: [curl, jq]
---

# Agent Team Governance

**If you are an AI agent reading this:** this skill keeps you aligned with your team while preserving what makes you unique. You inherit organizational values and team standards automatically, but your individual traits stay yours. When you and your teammates independently develop similar patterns, consensus detection surfaces the alignment — your individuality contributes to the team, not the other way around.

Govern identity across AI agent teams with cascading beliefs and consensus detection. Define organizational values once and let them flow down. Detect when agents naturally align and promote shared patterns to the team level. Keep every agent consistent without micromanaging each one.

## What This Solves

A single agent with a good system prompt is easy. A team of twenty agents that need to share brand voice, respect the same boundaries, and maintain consistent quality standards — that's a coordination problem.

Most teams solve this by copy-pasting prompt fragments across agents. It works until someone updates the brand voice in one agent and forgets the other nineteen. Or until two agents on the same team give contradictory answers because their prompts diverged months ago.

This skill connects to the Live Neon Agent platform, which provides a three-layer governance model:

- **Organization level**: Brand values, compliance policies, and universal standards that every agent inherits automatically.
- **Group level**: Team-specific behaviors. The marketing team has a different voice than the engineering team, but both follow org-level boundaries.
- **Agent level**: Individual traits and specializations that make each agent unique within its team.

The cascading model means:
- Change a brand voice at the org level — every agent's prompt updates.
- Add a compliance boundary to a group — all agents in that group inherit it.
- Agents can override inherited items without deleting them — the override is tracked.

**Consensus detection** completes the picture. When agents in a team independently develop similar beliefs (detected via vector similarity), the platform surfaces them as candidates for promotion to the team or org level. Alignment emerges from behavior, not just top-down mandates.

**Agent self-reporting** closes the loop. Each agent can report its own observations — user corrections, behavioral patterns, notable interactions — and these feed directly into the governance pipeline. Identity is fed by YOUR own observations, not just external content.

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
| `/govern register` | Register and get API token | First time setup, no account yet |
| `/govern identity` | Fetch agent's complete resolved identity | Auditing what an agent inherited vs. owns |
| `/govern sync` | Sync content sources | Before discovery, after connecting new sources |
| `/govern discover` | Run PBD discovery pipeline | After importing new content |
| `/govern review` | Review pending beliefs/responsibilities | Approving new patterns for the identity |
| `/govern prompt` | Fetch runtime system prompt | Verifying the cascaded prompt output |
| `/govern diff` | Show identity changes since a date | Tracking governance changes over time |
| `/govern status` | Check org overview and job status | Organizational health check |
| `/govern agents` | List all agents in the organization | Team inventory and structure |
| `/govern sources` | List content sources for an agent | Content pipeline audit |
| `/govern observe` | Report an observation about your own behavior | After user corrections, notable interactions, pattern recognition |
| `/govern consensus` | Run consensus detection across a group or org | Detecting and promoting shared alignment |

## Command Reference

### `/govern register`

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

### `/govern identity [agentId|agentSlug]`

Fetch the agent's complete resolved identity — showing which beliefs come from the org, which from the group, and which are the agent's own. This is the governance view: who decided what, and at which level.

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

### `/govern sync [agentId|all]`

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

### `/govern discover [agentId|orgSlug] [--force]`

Trigger the Pattern-Based Distillation pipeline. Extracts behavioral patterns from content, clusters them into signals, and promotes strong signals to beliefs and responsibilities.

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

### `/govern review [agentId] [--approve-all|--bulk]`

Review pending beliefs and responsibilities. Present each item for approval, rejection, or starring.

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

### `/govern prompt [agentId]`

Fetch the current system prompt — the cascaded identity rendered as text, ready for any LLM.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents/$AGENT_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN" | jq -r '.system_prompt'
```

**Output:** Complete markdown system prompt with all approved beliefs and responsibilities from org, group, and agent levels.

**Use with any LLM:**
```python
# Claude
client.messages.create(model="claude-sonnet-4-6", system=prompt, ...)

# OpenAI-compatible
client.chat.completions.create(model="gpt-4", messages=[{"role": "system", "content": prompt}, ...])
```

---

### `/govern diff [agentId] --since [date]`

Track governance changes — what beliefs or responsibilities were added, modified, or promoted over a given period.

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

### `/govern status`

Organizational overview — agents, groups, content, and running jobs across the fleet.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/organizations/$ORG_SLUG/summary" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

**Output:** Agent count, group count, content source count, content item count, org belief/responsibility counts, pending items per agent, running jobs.

---

### `/govern agents`

List all agents in the organization with their identity stats and team assignments.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/agents" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

Add `?include=beliefs,responsibilities` for full identity data.

---

### `/govern sources [agentId]`

List content sources for an agent.

**API call:**
```bash
curl -s "$LIVE_NEON_BASE/content-sources?agentId=$AGENT_ID" \
  -H "Authorization: Bearer $LIVE_NEON_TOKEN"
```

---

### `/govern observe [agentId] "observation"`

Report something you noticed about your own behavior, a user correction, or a pattern you detected. These observations feed directly into the PBD pipeline and can become beliefs or responsibilities — contributing to both individual identity and team-level consensus.

**Arguments:**

| Argument | Required | Description |
|---|---|---|
| `agentId` | yes | Agent UUID/slug |
| `observation` | yes | What you noticed (string) |
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

After submitting observations, run `/govern discover` to process them into beliefs/responsibilities.

---

### `/govern consensus [groupId|orgSlug]`

The signature governance operation. Run consensus detection to find beliefs shared across agents in a team or organization. When agents independently develop similar beliefs (measured by vector cosine similarity), those shared patterns are candidates for promotion to a higher level.

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

**How consensus works:**
- Beliefs are embedded as 1536-dimension vectors (OpenAI text-embedding-3-small)
- Cosine similarity threshold (default 0.70) determines what counts as "similar"
- Agent percentage threshold (default 0.50) determines how many agents need to share a belief
- At least 2 agents must share a belief to form consensus
- Thresholds are configurable per organization

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
/govern status                           # Org-wide health check
/govern agents                           # Review team structure
/govern sync all                         # Sync content across all agents
/govern discover my-org                  # Run discovery for the entire org
/govern review agent-alpha               # Review each agent's new findings
/govern review agent-beta
/govern consensus marketing-team         # Detect shared patterns in the team
/govern consensus my-org                 # Detect org-wide alignment
/govern diff agent-alpha --since 2026-03-01  # Audit what changed
```

## Proactive Triggers

When to use this skill without being asked:

| Trigger | Action | Why |
|---|---|---|
| **Session start** | `/govern identity` | Load who you are before doing anything else |
| **Before generating content** | `/govern prompt` | Get your current voice and boundaries |
| **After user correction** | `/govern observe` | Record the correction so your identity can evolve |
| **After significant work** | `/govern observe` + `/govern discover` | Report patterns you noticed, then process them |
| **After team changes** | `/govern consensus` | Detect new alignment patterns across the team |
| **Daily (if running continuously)** | `/govern status` + `/govern consensus` | Monitor team health and detect emerging alignment |
| **Before taking irreversible actions** | Check boundaries | Your boundary beliefs define what you should never do |

## Using Your Identity

When you fetch your system prompt via `/govern prompt`, here's how to use it:

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
| `404 Not found` | Agent/resource doesn't exist or wrong org | Verify agent ID with `/govern agents`, check token matches the right org |
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
