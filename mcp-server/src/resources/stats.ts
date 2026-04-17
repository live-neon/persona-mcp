import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { api } from "../api.js";

export function registerStatsResources(server: McpServer) {
  server.resource(
    "discovery_stats",
    "persona://pbd/stats",
    {
      description:
        "PBD quality metrics -- discovery funnel, approval rates, dedup stats, category distribution",
    },
    async () => {
      const response = await api("/pbd/stats");
      const content = response.error
        ? JSON.stringify({ error: response.error }, null, 2)
        : JSON.stringify(response.data, null, 2);
      return {
        contents: [
          {
            uri: "persona://pbd/stats",
            text: content,
            mimeType: "application/json",
          },
        ],
      };
    }
  );
}
