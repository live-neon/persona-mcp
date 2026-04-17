import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse } from "../api.js";

const BELIEF_CATEGORY = z.enum(["axiom", "principle", "voice", "preference", "boundary"]);
const RESP_CATEGORY = z.enum(["ownership", "execution", "collaboration", "deliverables", "monitoring"]);

export function registerOrgIdentityTools(server: McpServer) {
  server.tool(
    "get_org_beliefs",
    "Get organization-level beliefs. These cascade to all agents in the org.",
    {
      orgId: z.string().describe("Organization UUID or slug"),
    },
    async ({ orgId }) =>
      handleApiResponse(await api(`/organizations/${orgId}/beliefs`))
  );

  server.tool(
    "add_org_belief",
    "Add an organization-level belief that cascades to all agents.",
    {
      orgId: z.string().describe("Organization UUID or slug"),
      category: BELIEF_CATEGORY,
      statement: z.string().describe("Belief statement in timeless present tense"),
    },
    async ({ orgId, ...body }) => {
      const response = await api(`/organizations/${orgId}/beliefs`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_org_responsibilities",
    "Get organization-level responsibilities. These cascade to all agents.",
    {
      orgId: z.string().describe("Organization UUID or slug"),
    },
    async ({ orgId }) =>
      handleApiResponse(await api(`/organizations/${orgId}/responsibilities`))
  );

  server.tool(
    "add_org_responsibility",
    "Add an organization-level responsibility that cascades to all agents.",
    {
      orgId: z.string().describe("Organization UUID or slug"),
      category: RESP_CATEGORY,
      statement: z.string().describe("Responsibility statement in timeless present tense"),
    },
    async ({ orgId, ...body }) => {
      const response = await api(`/organizations/${orgId}/responsibilities`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_org_summary",
    "Get a full organization overview in one call: groups, agents (with belief/responsibility counts), org-level beliefs and responsibilities, content source and item counts.",
    {
      orgId: z.string().describe("Organization UUID or slug"),
    },
    async ({ orgId }) =>
      handleApiResponse(await api(`/organizations/${orgId}/summary`))
  );
}
