import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { api } from "../api.js";

export function registerIdentityResources(server: McpServer) {
  server.resource(
    "about",
    "persona://about",
    {
      description:
        "About Persona -- AI agent identity platform with self-learning personality",
    },
    async () => ({
      contents: [
        {
          uri: "persona://about",
          text: [
            "# Persona by Live Neon",
            "",
            "AI agent identity platform. Define, observe, and evolve structured identities for AI agents.",
            "",
            "## Key concepts",
            "- **Beliefs**: Identity traits across 5 categories (axiom, principle, voice, preference, boundary)",
            "- **Responsibilities**: Accountabilities across 5 categories (ownership, execution, collaboration, deliverables, monitoring)",
            "- **PBD (Pattern-Based Discovery)**: Extracts identity patterns from real content (commits, tweets, articles) and proposes new beliefs/responsibilities",
            "- **Three-layer hierarchy**: Organization -> Group -> Agent. Higher-level beliefs cascade down.",
            "- **Dynamic prompts**: Randomized per-invocation to prevent persona numbing",
            "- **Semantic dedup**: 3-tier duplicate detection (cosine similarity + LLM judgment)",
            "",
            "## Links",
            "- Website: https://agentpersona.live",
            "- API docs: https://agentpersona.live/llms.txt",
            "- OpenAPI: https://agentpersona.live/openapi.json",
          ].join("\n"),
          mimeType: "text/markdown",
        },
      ],
    })
  );
}
