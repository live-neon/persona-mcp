import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, buildQuery } from "../api.js";

export function registerJobTools(server: McpServer) {
  server.tool(
    "get_job",
    "Check the progress of a background job (PBD discovery, content sync, dedup, consensus, avatar generation). Returns status, progress_current/progress_total, and result when complete.",
    {
      jobId: z.string().describe("Job UUID"),
    },
    async ({ jobId }) => handleApiResponse(await api(`/jobs/${jobId}`))
  );

  server.tool(
    "list_jobs",
    "List background jobs with optional filters by agent, status, or job type.",
    {
      agentId: z.string().optional().describe("Filter by agent"),
      status: z.enum(["queued", "running", "completed", "failed"]).optional(),
      jobType: z.enum(["pbd", "sync", "consensus", "backfill", "avatar", "dedup"]).optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    },
    async (params) =>
      handleApiResponse(await api(`/jobs${buildQuery(params)}`))
  );
}
