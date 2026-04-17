import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerReviewPendingPrompt(server: McpServer) {
  server.prompt(
    "review_pending",
    "Review and approve or reject pending beliefs and responsibilities discovered by PBD",
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Help me review pending beliefs and responsibilities for my agents.",
              "",
              "For each pending item, I need to decide:",
              "- **Approve**: The belief/responsibility accurately reflects the agent's identity",
              "- **Reject**: It doesn't fit or is inaccurate",
              "- **Edit + Approve**: The core idea is right but the wording needs improvement",
              "",
              "Guidelines for good beliefs:",
              "- Written in timeless present tense (no dates, no 'I noticed')",
              "- Specific enough to be actionable",
              "- Not redundant with existing beliefs (check for similar ones)",
              "- Categorized correctly (axiom/principle/voice/preference/boundary)",
              "",
              "Start by calling review_pending() to see all pending items, then walk me through each one.",
            ].join("\n"),
          },
        },
      ],
    })
  );
}
