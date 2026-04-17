import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse } from "../api.js";

export function registerEvolutionTools(server: McpServer) {
  server.tool(
    "snapshot_genome",
    "Capture the agent's current beliefs + responsibilities + dynamic prompt config as a point-in-time snapshot. Use for tracking identity evolution over time.",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) => {
      const response = await api(`/agents/${agentId}/snapshots`, {
        method: "POST",
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_diff",
    "See what beliefs and responsibilities were added or modified since a specific date. Useful for tracking identity evolution.",
    {
      agentId: z.string().describe("Agent UUID"),
      since: z.string().describe("ISO date (e.g., 2026-04-01)"),
    },
    async ({ agentId, since }) =>
      handleApiResponse(await api(`/agents/${agentId}/diff?since=${since}`))
  );

  server.tool(
    "run_dedup",
    "Scan and merge semantically duplicate beliefs/responsibilities. Uses embedding similarity to find clusters, then LLM judgment to synthesize the best statement. Set dryRun=true to preview without merging.",
    {
      agentId: z.string().optional().describe("Agent UUID (for agent-level dedup)"),
      orgId: z.string().optional().describe("Org UUID or slug (for org-level dedup)"),
      dryRun: z.boolean().optional().describe("Preview clusters without merging (default true)"),
    },
    async ({ agentId, orgId, dryRun }) => {
      const path = agentId
        ? `/agents/${agentId}/dedup`
        : `/organizations/${orgId}/dedup`;
      const response = await api(path, {
        method: "POST",
        body: JSON.stringify({ dryRun }),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "run_consensus",
    "Detect shared beliefs across agents in a group or org. When agents share semantically similar beliefs, they can be promoted to the group/org level.",
    {
      groupId: z.string().optional().describe("Group UUID"),
      orgId: z.string().optional().describe("Org UUID or slug"),
    },
    async ({ groupId, orgId }) => {
      const path = groupId
        ? `/groups/${groupId}/consensus`
        : `/organizations/${orgId}/consensus`;
      const response = await api(path, { method: "POST" });
      return handleApiResponse(response);
    }
  );
}
