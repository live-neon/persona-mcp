import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, jsonResult, buildQuery } from "../api.js";

export function registerDiscoveryTools(server: McpServer) {
  server.tool(
    "run_discovery",
    "Trigger Pattern-Based Discovery (PBD) for an agent or entire org. Extracts behavioral patterns from imported content and proposes new beliefs and responsibilities. Returns a jobId for progress polling.",
    {
      agentId: z.string().optional().describe("Agent UUID (for single agent)"),
      orgId: z.string().optional().describe("Org UUID or slug (processes all agents in org)"),
      force: z.boolean().optional().describe("Re-process already-processed content items"),
    },
    async (params) => {
      const response = await api("/pbd/process", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_discovery_stats",
    "Get PBD quality metrics: discovery funnel (content -> observations -> signals -> beliefs), approval rates, dedup stats, category distribution, and job performance.",
    {
      orgSlug: z.string().optional().describe("Organization slug (inferred from API key if omitted)"),
      agentId: z.string().optional().describe("Scope to a single agent"),
      since: z.string().optional().describe("ISO date filter for time-windowed metrics"),
    },
    async (params) =>
      handleApiResponse(await api(`/pbd/stats${buildQuery(params)}`))
  );

  server.tool(
    "list_observations",
    "View raw observations extracted by PBD from content. Each observation is a behavioral pattern with a source quote.",
    {
      agentId: z.string().describe("Agent UUID"),
      contentItemId: z.string().optional().describe("Filter by content item"),
      signalId: z.string().optional().describe("Filter by signal"),
      limit: z.number().optional(),
      offset: z.number().optional(),
    },
    async (params) =>
      handleApiResponse(await api(`/observations${buildQuery(params)}`))
  );

  server.tool(
    "list_signals",
    "View clustered signals with n-counts and stability scores. Signals are groups of similar observations that may be promoted to beliefs or responsibilities.",
    {
      agentId: z.string().describe("Agent UUID"),
      promoted: z.boolean().optional().describe("Filter: true=promoted, false=unpromoted"),
      minNCount: z.number().optional().describe("Minimum n-count threshold"),
      predictCategory: z.boolean().optional().describe("Use AI to predict category for unpromoted signals"),
      limit: z.number().optional(),
      offset: z.number().optional(),
    },
    async ({ predictCategory, ...params }) => {
      const query = buildQuery({
        ...params,
        predict_category: predictCategory,
      });
      return handleApiResponse(await api(`/signals${query}`));
    }
  );

  server.tool(
    "review_pending",
    "List all beliefs and responsibilities awaiting approval for an agent. Returns both pending beliefs and pending responsibilities in one call.",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) => {
      const [beliefsRes, responsibilitiesRes] = await Promise.all([
        api(`/beliefs?agentId=${agentId}&status=pending`),
        api(`/responsibilities?agentId=${agentId}&status=pending`),
      ]);
      // Handle errors gracefully
      const beliefs = beliefsRes.error ? [] : beliefsRes.data;
      const responsibilities = responsibilitiesRes.error ? [] : responsibilitiesRes.data;
      return jsonResult({
        pending_beliefs: beliefs,
        pending_responsibilities: responsibilities,
        errors: [beliefsRes.error, responsibilitiesRes.error].filter(Boolean),
      });
    }
  );
}
