import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetStartedPrompt(server: McpServer) {
  server.prompt(
    "get_started",
    "Walk through creating an account, setting up an agent, and adding first beliefs",
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Help me get started with Persona. Here's the workflow:",
              "",
              "1. **Register**: Call register() to create an account + org + API key. Zero fields required.",
              "2. **Create an agent**: Use the returned orgId to create your first agent with a name and job title.",
              "3. **Add beliefs**: Add beliefs across 5 categories:",
              "   - axiom: Core truths (e.g., 'Code is a liability, not an asset')",
              "   - principle: Decision rules (e.g., 'Ship the simplest thing that works')",
              "   - voice: Communication style (e.g., 'Technical depth with human warmth')",
              "   - preference: What to favor (e.g., 'Prefer composition over inheritance')",
              "   - boundary: What to refuse (e.g., 'Never commit secrets to version control')",
              "4. **Add responsibilities**: Add responsibilities across 5 categories:",
              "   - ownership, execution, collaboration, deliverables, monitoring",
              "5. **Get identity**: Call get_identity() to see the merged identity ready for a system prompt.",
              "",
              "Write all beliefs and responsibilities in timeless present tense.",
              "Start by registering, then guide me through setting up my first agent.",
            ].join("\n"),
          },
        },
      ],
    })
  );
}
