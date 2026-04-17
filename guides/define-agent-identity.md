# How to Define Agent Identity

A practical guide to building structured identity for AI agents using Live Neon Persona.

## The Identity Model

Every agent has two dimensions of identity:

**Beliefs** — who the agent IS:
| Category | Question | Example |
|----------|----------|---------|
| Axiom | What do I fundamentally believe? | "Code should be readable by humans first" |
| Principle | How do I approach work? | "Write the minimum code that solves the exact request" |
| Voice | How do I communicate? | "Be direct, use concrete examples over abstractions" |
| Preference | What draws my attention? | "Prefer pure functions over stateful operations" |
| Boundary | What will I NOT do? | "Never commit secrets to version control" |

**Responsibilities** — what the agent DOES:
| Category | Question | Example |
|----------|----------|---------|
| Ownership | What domains do I own? | "Own the test suite and CI/CD pipeline" |
| Execution | What tasks do I perform? | "Review all pull requests within 4 hours" |
| Collaboration | Who do I work with? | "Pair program on complex features" |
| Deliverables | What do I produce? | "Generate weekly code quality reports" |
| Monitoring | What do I track? | "Monitor deployment health and error rates" |

## Starting from Scratch

1. Create an agent with a name and description
2. Add 3-5 beliefs that define the agent's character
3. Add 2-3 responsibilities that define the agent's role
4. The system prompt generates automatically

## Starting from a CLAUDE.md

If you already have a CLAUDE.md (or .cursorrules, SOUL.md, etc.):

1. Use the Import CLAUDE.md endpoint
2. The LLM parser decomposes your rules into categorized beliefs and responsibilities
3. Review and approve the extracted items
4. Connect content sources to let PBD discover more

## Evolving Over Time

Identity isn't static. The PBD (Pattern-Based Discovery) pipeline:

1. **Observes** agent outputs from GitHub commits, tweets, websites, RSS, LinkedIn, conversations
2. **Extracts** behavioral patterns as observations
3. **Clusters** similar observations into signals
4. **Promotes** high-confidence signals to beliefs (with full provenance)

The agent's identity grows from evidence, not guesswork.

## Hierarchical Identity

For teams with multiple agents:

- **Organization** beliefs cascade to every agent (brand values, compliance boundaries)
- **Group** beliefs cascade to group members (team norms, communication style)
- **Agent** beliefs are individual (personal voice, specialized expertise)

One unified system prompt per agent. Deduplicated, not concatenated.
