import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Tools
import { registerRegisterTools } from "./tools/register.js";
import { registerAgentTools } from "./tools/agents.js";
import { registerBeliefTools } from "./tools/beliefs.js";
import { registerResponsibilityTools } from "./tools/responsibilities.js";
import { registerOrgIdentityTools } from "./tools/org-identity.js";
import { registerGroupIdentityTools } from "./tools/group-identity.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerContentTools } from "./tools/content.js";
import { registerConversationTools } from "./tools/conversations.js";
import { registerEvolutionTools } from "./tools/evolution.js";
import { registerJobTools } from "./tools/jobs.js";
import { registerBootstrapTools } from "./tools/bootstrap.js";

// Resources
import { registerSchemaResources } from "./resources/schema.js";
import { registerIdentityResources } from "./resources/identity.js";
import { registerStatsResources } from "./resources/stats.js";

// Prompts
import { registerGetStartedPrompt } from "./prompts/get-started.js";
import { registerEvolveIdentityPrompt } from "./prompts/evolve-identity.js";
import { registerReviewPendingPrompt } from "./prompts/review-pending.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "persona",
    version: "1.0.0",
  });

  // Register all tools (44 total)
  registerRegisterTools(server);
  registerAgentTools(server);
  registerBeliefTools(server);
  registerResponsibilityTools(server);
  registerOrgIdentityTools(server);
  registerGroupIdentityTools(server);
  registerDiscoveryTools(server);
  registerContentTools(server);
  registerConversationTools(server);
  registerEvolutionTools(server);
  registerJobTools(server);
  registerBootstrapTools(server);

  // Register resources (5 total)
  registerSchemaResources(server);
  registerIdentityResources(server);
  registerStatsResources(server);

  // Register prompts (3 total)
  registerGetStartedPrompt(server);
  registerEvolveIdentityPrompt(server);
  registerReviewPendingPrompt(server);

  return server;
}
