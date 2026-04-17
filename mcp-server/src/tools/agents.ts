import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, buildQuery } from "../api.js";

export function registerAgentTools(server: McpServer) {
  server.tool(
    "get_agent",
    "Get an agent's profile including name, job title, description, location, timezone, avatar, and system prompt.",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) => handleApiResponse(await api(`/agents/${agentId}`))
  );

  server.tool(
    "list_agents",
    "List all agents in the organization. Returns agents with their group assignments and belief/responsibility counts.",
    {
      orgSlug: z.string().optional().describe("Organization slug (inferred from API key if omitted)"),
      groupId: z.string().optional().describe("Filter by group ID"),
    },
    async (params) =>
      handleApiResponse(await api(`/agents${buildQuery(params)}`))
  );

  server.tool(
    "update_agent",
    "Update an agent's profile fields (name, job title, description, location, timezone, github_username).",
    {
      agentId: z.string().describe("Agent UUID"),
      name: z.string().optional().describe("Agent name"),
      jobTitle: z.string().optional().describe("Job title"),
      description: z.string().optional().describe("Agent description"),
      location: z.string().optional().describe("Location"),
      timezone: z.string().optional().describe("IANA timezone (e.g., America/Anchorage)"),
      githubUsername: z.string().optional().describe("GitHub username for commit attribution"),
    },
    async ({ agentId, ...body }) => {
      const response = await api(`/agents/${agentId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "get_identity",
    "Get an agent's full resolved identity -- beliefs and responsibilities merged from org, group, and agent layers. This is what goes into the system prompt.",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) =>
      handleApiResponse(await api(`/agents/${agentId}/resolved-identity`))
  );
}
