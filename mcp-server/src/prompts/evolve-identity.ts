import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerEvolveIdentityPrompt(server: McpServer) {
  server.prompt(
    "evolve_identity",
    "Guide for connecting content sources and running PBD to evolve an agent's identity from real behavior",
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Help me evolve my agent's identity using Pattern-Based Discovery (PBD). Here's how it works:",
              "",
              "1. **Connect content sources**: Link real content the agent produces or consumes:",
              "   - GitHub repos (commits, documentation files)",
              "   - Twitter/X (tweets)",
              "   - RSS feeds (blog posts, articles)",
              "   - Websites (pages)",
              "   - Conversations (logged interactions)",
              "",
              "2. **Sync content**: Trigger a sync to import the latest content items.",
              "",
              "3. **Run discovery**: Call run_discovery() to trigger PBD. It will:",
              "   - Extract behavioral observations from content",
              "   - Cluster similar observations into signals",
              "   - Propose new beliefs and responsibilities",
              "",
              "4. **Review pending**: Call review_pending() to see what PBD discovered.",
              "   - Approve beliefs that accurately reflect the agent's identity",
              "   - Reject ones that don't fit",
              "   - The agent's identity evolves from real behavior, not just instructions",
              "",
              "5. **Check quality**: Call get_discovery_stats() to see:",
              "   - Discovery funnel (content -> observations -> signals -> beliefs)",
              "   - Approval rate (are discoveries accurate?)",
              "   - Dedup stats (are we catching redundancy?)",
              "",
              "6. **Run dedup**: If there are redundant beliefs, call run_dedup() to merge them.",
              "",
              "Start by listing my agent's current content sources, then guide me through the evolution process.",
            ].join("\n"),
          },
        },
      ],
    })
  );
}
