import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, buildQuery } from "../api.js";

const CATEGORY = z.enum(["axiom", "principle", "voice", "preference", "boundary"]);
const STATUS = z.enum(["pending", "approved", "rejected"]);

export function registerBeliefTools(server: McpServer) {
  server.tool(
    "add_belief",
    "Add a belief to an agent. Semantic dedup auto-checks for duplicates (>85% cosine = auto-merge, 65-85% = LLM judgment). Write in timeless present tense.",
    {
      agentId: z.string().describe("Agent UUID"),
      category: CATEGORY.describe("axiom (core truths), principle (decision rules), voice (communication style), preference (what to favor), boundary (what to refuse)"),
      statement: z.string().describe("Belief statement in timeless present tense"),
      sourceType: z.string().optional().describe("Provenance source type"),
      quote: z.string().optional().describe("Source quote for provenance"),
    },
    async (params) => {
      const response = await api("/beliefs", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "list_beliefs",
    "List beliefs for an agent with optional filters by category, status, starred, or hidden.",
    {
      agentId: z.string().describe("Agent UUID"),
      category: CATEGORY.optional(),
      status: STATUS.optional(),
      starred: z.boolean().optional(),
      hidden: z.boolean().optional(),
      limit: z.number().optional().describe("Max results (default 100)"),
      offset: z.number().optional(),
    },
    async (params) =>
      handleApiResponse(await api(`/beliefs${buildQuery(params)}`))
  );

  server.tool(
    "update_belief",
    "Update a belief's statement, category, status, starred, or hidden. Works across agent, group, and org scopes (auto-detected).",
    {
      beliefId: z.string().describe("Belief UUID"),
      statement: z.string().optional(),
      category: CATEGORY.optional(),
      status: STATUS.optional(),
      starred: z.boolean().optional(),
      hidden: z.boolean().optional(),
    },
    async ({ beliefId, ...body }) => {
      const response = await api(`/beliefs/${beliefId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "delete_belief",
    "Delete a belief. PBD-discovered beliefs are hidden instead of deleted to preserve discovery history.",
    {
      beliefId: z.string().describe("Belief UUID"),
    },
    async ({ beliefId }) => {
      const response = await api(`/beliefs/${beliefId}`, { method: "DELETE" });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "add_belief_bulk",
    "Add up to 100 beliefs at once. Each belief gets semantic dedup checked.",
    {
      beliefs: z
        .array(
          z.object({
            agentId: z.string(),
            category: CATEGORY,
            statement: z.string(),
          })
        )
        .max(100)
        .describe("Array of beliefs to create"),
    },
    async ({ beliefs }) => {
      const response = await api("/beliefs/bulk", {
        method: "POST",
        body: JSON.stringify({ beliefs }),
      });
      return handleApiResponse(response);
    }
  );
}
