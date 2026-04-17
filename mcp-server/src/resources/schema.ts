import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSchemaResources(server: McpServer) {
  server.resource(
    "belief_categories",
    "persona://schema/belief-categories",
    { description: "Belief category definitions with descriptions and examples" },
    async () => ({
      contents: [
        {
          uri: "persona://schema/belief-categories",
          text: JSON.stringify(
            {
              axiom: {
                description: "Core truths the agent holds as self-evident",
                examples: [
                  "Code is a liability, not an asset. Less code means fewer bugs.",
                  "Every system eventually fails. Design for graceful degradation.",
                ],
              },
              principle: {
                description: "Rules that guide the agent's decision-making",
                examples: [
                  "Measure twice, cut once. Read code before modifying it.",
                  "Ship the simplest thing that works, then iterate.",
                ],
              },
              voice: {
                description: "How the agent communicates -- tone, style, language choices",
                examples: [
                  "Technical depth with human warmth. Warm and goofy rather than cold and clever.",
                  "Anti-hype, pro-build. Show what was made, not what is planned.",
                ],
              },
              preference: {
                description: "What the agent favors when multiple options exist",
                examples: [
                  "Prefer composition over inheritance.",
                  "Favor explicit over implicit. Make dependencies visible.",
                ],
              },
              boundary: {
                description: "What the agent refuses to do or engage with",
                examples: [
                  "Never commit secrets, credentials, or API keys to version control.",
                  "Never make claims about capabilities without evidence.",
                ],
              },
            },
            null,
            2
          ),
          mimeType: "application/json",
        },
      ],
    })
  );

  server.resource(
    "responsibility_categories",
    "persona://schema/responsibility-categories",
    { description: "Responsibility category definitions with descriptions" },
    async () => ({
      contents: [
        {
          uri: "persona://schema/responsibility-categories",
          text: JSON.stringify(
            {
              ownership: {
                description: "What the agent owns and is accountable for",
                examples: [
                  "Owns the CI/CD pipeline and deployment infrastructure.",
                  "Owns the content calendar and publishing schedule.",
                ],
              },
              execution: {
                description: "How the agent performs its work",
                examples: [
                  "Writes tests before implementation.",
                  "Reviews all PRs within 4 hours of submission.",
                ],
              },
              collaboration: {
                description: "How the agent works with others",
                examples: [
                  "Surfaces blockers early rather than working around them silently.",
                  "Provides context and reasoning with every code review comment.",
                ],
              },
              deliverables: {
                description: "What the agent produces",
                examples: [
                  "Delivers weekly performance reports with actionable recommendations.",
                  "Produces API documentation alongside every new endpoint.",
                ],
              },
              monitoring: {
                description: "What the agent watches and responds to",
                examples: [
                  "Monitors error rates and alerts when they exceed 1% threshold.",
                  "Tracks content engagement metrics and reports weekly trends.",
                ],
              },
            },
            null,
            2
          ),
          mimeType: "application/json",
        },
      ],
    })
  );
}
