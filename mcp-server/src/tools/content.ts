import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, buildQuery } from "../api.js";

export function registerContentTools(server: McpServer) {
  server.tool(
    "list_sources",
    "List content sources for an agent (GitHub repos, websites, Twitter, RSS feeds).",
    {
      agentId: z.string().describe("Agent UUID"),
    },
    async ({ agentId }) =>
      handleApiResponse(await api(`/content-sources?agentId=${agentId}`))
  );

  server.tool(
    "create_source",
    "Create a content source to import content for PBD. Supported platforms: github, website, twitter, rss.",
    {
      agentId: z.string().describe("Agent UUID"),
      platform: z.enum(["github", "website", "twitter", "rss"]).describe("Content platform"),
      name: z.string().describe("Source display name"),
      config: z.record(z.string(), z.any()).describe("Platform-specific config. GitHub: {owner, repo, connectionId?}. Website: {domain, discoveryMode: 'llms_txt'|'sitemap'|'manual', urls?: [...]}. Twitter: {username, xConnectionId}. RSS: {feed_url}."),
    },
    async (params) => {
      const response = await api("/content-sources", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "sync_source",
    "Trigger a sync for a content source. Imports new content (commits, pages, tweets, entries) and triggers PBD for affected agents.",
    {
      sourceId: z.string().describe("Content source UUID"),
    },
    async ({ sourceId }) => {
      const response = await api(`/content-sources/${sourceId}/sync`, {
        method: "POST",
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "list_content",
    "List imported content items for an agent. Filter by source type (github_commit, tweet, website_page, rss_entry, conversation, etc.).",
    {
      agentId: z.string().describe("Agent UUID"),
      sourceType: z.string().optional().describe("Filter by source type"),
      limit: z.number().optional(),
      offset: z.number().optional(),
    },
    async (params) =>
      handleApiResponse(await api(`/content-items${buildQuery(params)}`))
  );
}
