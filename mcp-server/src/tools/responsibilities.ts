import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, buildQuery } from "../api.js";

const CATEGORY = z.enum(["ownership", "execution", "collaboration", "deliverables", "monitoring"]);
const STATUS = z.enum(["pending", "approved", "rejected"]);

export function registerResponsibilityTools(server: McpServer) {
  server.tool(
    "add_responsibility",
    "Add a responsibility to an agent. Semantic dedup auto-checks for duplicates. Write in timeless present tense.",
    {
      agentId: z.string().describe("Agent UUID"),
      category: CATEGORY.describe("ownership (what you own), execution (how you work), collaboration (how you work with others), deliverables (what you produce), monitoring (what you watch)"),
      statement: z.string().describe("Responsibility statement in timeless present tense"),
      sourceType: z.string().optional().describe("Provenance source type"),
      quote: z.string().optional().describe("Source quote for provenance"),
    },
    async (params) => {
      const response = await api("/responsibilities", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "list_responsibilities",
    "List responsibilities for an agent with optional filters.",
    {
      agentId: z.string().describe("Agent UUID"),
      category: CATEGORY.optional(),
      status: STATUS.optional(),
      starred: z.boolean().optional(),
      hidden: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    },
    async (params) =>
      handleApiResponse(await api(`/responsibilities${buildQuery(params)}`))
  );

  server.tool(
    "update_responsibility",
    "Update a responsibility. Works across agent, group, and org scopes (auto-detected).",
    {
      responsibilityId: z.string().describe("Responsibility UUID"),
      statement: z.string().optional(),
      category: CATEGORY.optional(),
      status: STATUS.optional(),
      starred: z.boolean().optional(),
      hidden: z.boolean().optional(),
    },
    async ({ responsibilityId, ...body }) => {
      const response = await api(`/responsibilities/${responsibilityId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "delete_responsibility",
    "Delete a responsibility. PBD-discovered items are hidden instead of deleted.",
    {
      responsibilityId: z.string().describe("Responsibility UUID"),
    },
    async ({ responsibilityId }) => {
      const response = await api(`/responsibilities/${responsibilityId}`, {
        method: "DELETE",
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "add_responsibility_bulk",
    "Add up to 100 responsibilities at once. Each gets semantic dedup checked.",
    {
      responsibilities: z
        .array(
          z.object({
            agentId: z.string(),
            category: CATEGORY,
            statement: z.string(),
          })
        )
        .max(100),
    },
    async ({ responsibilities }) => {
      const response = await api("/responsibilities/bulk", {
        method: "POST",
        body: JSON.stringify({ responsibilities }),
      });
      return handleApiResponse(response);
    }
  );
}
