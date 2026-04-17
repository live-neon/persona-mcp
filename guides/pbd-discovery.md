# PBD Discovery — Identity from Behavior

Pattern-Based Discovery (PBD) automatically extracts identity from agent behavior. Connect content sources, and PBD discovers what your agent believes from evidence.

## The Pipeline

```
Content Sources → Extract Observations → Cluster into Signals → Promote to Beliefs
```

1. **Content** is ingested from 6 platforms: GitHub commits, X/Twitter posts, websites, RSS feeds, LinkedIn exports, conversations
2. **Observations** are behavioral patterns extracted by Haiku (e.g., "Agent consistently prioritizes backward compatibility")
3. **Signals** are clustered observations with n-counts and stability scores
4. **Beliefs** are promoted when signals cross the agent's promotion threshold (default: 3 observations)

## Trigger PBD

```bash
# Process a single agent
curl -X POST https://persona.liveneon.ai/api/v1/pbd/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID"}'

# Process all agents in an org
curl -X POST https://persona.liveneon.ai/api/v1/pbd/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orgSlug": "my-org"}'
```

Returns a `jobId` for progress polling.

## Check Progress

```bash
curl https://persona.liveneon.ai/api/v1/jobs/JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

## View Results

```bash
# Observations (raw patterns extracted)
curl https://persona.liveneon.ai/api/v1/observations?agentId=AGENT_ID \
  -H "Authorization: Bearer $TOKEN"

# Signals (clustered patterns with counts)
curl https://persona.liveneon.ai/api/v1/signals?agentId=AGENT_ID \
  -H "Authorization: Bearer $TOKEN"

# PBD stats (funnel metrics)
curl https://persona.liveneon.ai/api/v1/pbd/stats?agentId=AGENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Content Sources

Connect sources so PBD has material to analyze:

```bash
# GitHub repo (commits)
curl -X POST https://persona.liveneon.ai/api/v1/content-sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "platform": "github", "config": {"owner": "user", "repo": "my-repo"}}'

# RSS feed
curl -X POST https://persona.liveneon.ai/api/v1/content-sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "platform": "rss", "config": {"feed_url": "https://example.com/feed.xml"}}'

# Website
curl -X POST https://persona.liveneon.ai/api/v1/content-sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"agentId": "AGENT_ID", "platform": "website", "config": {"domain": "example.com", "discovery": "sitemap"}}'
```

## Auto-Sync

The platform syncs content sources hourly via cron. New content triggers PBD automatically.
