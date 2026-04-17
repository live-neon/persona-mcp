import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse } from "../api.js";

export function registerBootstrapTools(server: McpServer) {
  server.tool(
    "get_recommendations",
    "Get bootstrap template recommendations based on an agent's profile. Uses vector similarity to find relevant identity templates from open-source repos, then tailors them with an LLM.",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) => {
      const response = await api("/bootstrap/recommend", {
        method: "POST",
        body: JSON.stringify({ agentId }),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "apply_recommendations",
    "Batch apply selected bootstrap beliefs and responsibilities to an agent. Updates existing items on conflict (upserts by statement).",
    {
      agentId: z.string().describe("Agent UUID"),
      items: z
        .array(
          z.object({
            type: z.enum(["belief", "responsibility"]),
            category: z.string(),
            statement: z.string(),
          })
        )
        .describe("Items to apply from recommendations"),
    },
    async ({ agentId, items }) => {
      const response = await api("/bootstrap/apply", {
        method: "POST",
        body: JSON.stringify({ agentId, items }),
      });
      return handleApiResponse(response);
    }
  );
}
