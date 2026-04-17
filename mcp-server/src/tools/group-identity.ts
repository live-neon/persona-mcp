import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse } from "../api.js";

const BELIEF_CATEGORY = z.enum(["axiom", "principle", "voice", "preference", "boundary"]);
const RESP_CATEGORY = z.enum(["ownership", "execution", "collaboration", "deliverables", "monitoring"]);

export function registerGroupIdentityTools(server: McpServer) {
  server.tool(
    "get_group_beliefs",
    "Get group-level beliefs. These cascade to all agents in the group.",
    {
      groupId: z.string().describe("Group UUID"),
    },
    async ({ groupId }) =>
      handleApiResponse(await api(`/groups/${groupId}/beliefs`))
  );

  server.tool(
    "add_group_belief",
    "Add a group-level belief that cascades to all agents in the group.",
    {
      groupId: z.string().describe("Group UUID"),
      category: BELIEF_CATEGORY,
      statement: z.string().describe("Belief statement in timeless present tense"),
    },
    async ({ groupId, ...body }) => {
      const response = await api(`/groups/${groupId}/beliefs`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_group_responsibilities",
    "Get group-level responsibilities.",
    {
      groupId: z.string().describe("Group UUID"),
    },
    async ({ groupId }) =>
      handleApiResponse(await api(`/groups/${groupId}/responsibilities`))
  );

  server.tool(
    "add_group_responsibility",
    "Add a group-level responsibility.",
    {
      groupId: z.string().describe("Group UUID"),
      category: RESP_CATEGORY,
      statement: z.string().describe("Responsibility statement in timeless present tense"),
    },
    async ({ groupId, ...body }) => {
      const response = await api(`/groups/${groupId}/responsibilities`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );
}
