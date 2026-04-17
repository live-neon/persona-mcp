import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api, handleApiResponse, textResult, setApiKey } from "../api.js";

export function registerRegisterTools(server: McpServer) {
  server.tool(
    "register",
    "Create a new Persona account, organization, and API key in one call. Zero fields required. Returns your API key (ln_ prefix) immediately. The key is auto-stored for this session, so subsequent tool calls are authenticated automatically.",
    {
      email: z.string().optional().describe("Optional email for account recovery"),
      displayName: z.string().optional().describe("Optional display name"),
      orgName: z.string().optional().describe("Optional organization name"),
    },
    async (params) => {
      const response = await api(
        "/register",
        { method: "POST", body: JSON.stringify(params) },
        true // skip auth for registration
      );
      if (response.error) {
        return textResult(`Error: ${response.error}`);
      }
      // Auto-store the key for this session
      const data = response.data as Record<string, unknown> | null;
      const token = data?.your_token as string | undefined;
      if (token) {
        setApiKey(token);
      }
      return handleApiResponse(response);
    }
  );
}
