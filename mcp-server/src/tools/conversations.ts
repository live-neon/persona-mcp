import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse } from "../api.js";

export function registerConversationTools(server: McpServer) {
  server.tool(
    "create_conversation",
    "Start a conversation session with agent participants. Conversations can be published as content for PBD to extract identity patterns from.",
    {
      title: z.string().optional().describe("Conversation title"),
      orgId: z.string().optional().describe("Organization UUID or slug"),
      participants: z
        .array(
          z.object({
            agentId: z.string().optional(),
            participantType: z.enum(["agent", "human"]),
            displayName: z.string().optional(),
            role: z.string().optional(),
          })
        )
        .describe("Conversation participants"),
    },
    async (params) => {
      const response = await api("/conversations", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "add_message",
    "Add a message to a conversation session.",
    {
      sessionId: z.string().describe("Conversation session UUID"),
      participantId: z.string().describe("Participant UUID"),
      content: z.string().describe("Message content"),
    },
    async ({ sessionId, ...body }) => {
      const response = await api(`/conversations/${sessionId}/messages`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return handleApiResponse(response);
    }
  );

  server.tool(
    "complete_conversation",
    "Mark a conversation as completed. If the org has auto_publish_conversations enabled, this automatically publishes the conversation as content items for each agent participant and triggers PBD.",
    {
      sessionId: z.string().describe("Conversation session UUID"),
    },
    async ({ sessionId }) => {
      const response = await api(`/conversations/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });
      return handleApiResponse(response);
    }
  );
}
