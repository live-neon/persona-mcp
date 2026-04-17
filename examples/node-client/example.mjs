/**
 * Live Neon Persona — Node.js API Client Example
 *
 * Register, create an agent, add beliefs, and fetch the system prompt.
 * No dependencies — uses native fetch (Node 18+).
 *
 * Usage:
 *   node example.mjs
 */

const BASE_URL = "https://persona.liveneon.ai/api/v1";

async function main() {
  // 1. Register
  console.log("Registering...");
  const regResp = await fetch(`${BASE_URL}/register`, { method: "POST" });
  const regData = await regResp.json();
  const token = regData.your_token;
  const orgSlug = regData.organization.slug;
  console.log(`  Token: ${token.slice(0, 20)}...`);
  console.log(`  Org: ${orgSlug}`);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 2. Create an agent
  console.log("\nCreating agent...");
  const agentResp = await fetch(`${BASE_URL}/agents`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: "Node Bot", description: "Created from Node.js" }),
  });
  const agent = await agentResp.json();
  const agentId = agent.id;
  console.log(`  Agent: ${agent.name} (${agentId.slice(0, 8)}...)`);

  // 3. Add beliefs in bulk
  console.log("\nAdding beliefs...");
  const beliefsResp = await fetch(`${BASE_URL}/beliefs/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      agentId,
      beliefs: [
        { category: "axiom", statement: "Simplicity is the ultimate sophistication" },
        { category: "principle", statement: "Fail fast, fail loud — silent failures are dishonest" },
        { category: "voice", statement: "Be direct and concise, expand only for trade-offs" },
        { category: "boundary", statement: "Never add features beyond what was asked" },
      ],
    }),
  });
  const beliefsData = await beliefsResp.json();
  console.log(`  Created: ${beliefsData.created} beliefs`);

  // 4. Get the system prompt
  console.log("\nRegenerating prompt...");
  await fetch(`${BASE_URL}/agents/${agentId}/regenerate-prompt`, {
    method: "POST",
    headers,
  });

  const getResp = await fetch(`${BASE_URL}/agents/${agentId}`, { headers });
  const agentData = await getResp.json();
  console.log(`\n--- System Prompt ---`);
  console.log(agentData.system_prompt?.slice(0, 500) + "...");

  console.log(`\n\nDashboard: https://persona.liveneon.ai/${orgSlug}/agents/${agentId}`);
}

main().catch(console.error);
