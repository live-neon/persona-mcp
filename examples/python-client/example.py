"""
Live Neon Persona — Python API Client Example

Register, create an agent, add beliefs, and fetch the system prompt.
No dependencies beyond requests.

Usage:
  pip install requests
  python example.py
"""

import requests
import json

BASE_URL = "https://persona.liveneon.ai/api/v1"


def main():
    # 1. Register (zero fields required)
    print("Registering...")
    resp = requests.post(f"{BASE_URL}/register")
    resp.raise_for_status()
    data = resp.json()
    token = data["your_token"]
    org_slug = data["organization"]["slug"]
    print(f"  Token: {token[:20]}...")
    print(f"  Org: {org_slug}")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    # 2. Create an agent
    print("\nCreating agent...")
    resp = requests.post(
        f"{BASE_URL}/agents",
        headers=headers,
        json={"name": "Python Bot", "description": "A test agent created from Python"},
    )
    resp.raise_for_status()
    agent = resp.json()
    agent_id = agent["id"]
    print(f"  Agent: {agent['name']} ({agent_id[:8]}...)")

    # 3. Add beliefs
    beliefs = [
        ("axiom", "Code should be readable by humans first, machines second"),
        ("principle", "Write tests before implementation"),
        ("voice", "Explain decisions with concrete examples, not abstract theory"),
        ("preference", "Prefer pure functions over stateful operations"),
        ("boundary", "Never commit secrets or credentials to version control"),
    ]

    print("\nAdding beliefs...")
    for category, statement in beliefs:
        resp = requests.post(
            f"{BASE_URL}/beliefs",
            headers=headers,
            json={"agentId": agent_id, "category": category, "statement": statement},
        )
        resp.raise_for_status()
        print(f"  [{category}] {statement}")

    # 4. Add responsibilities
    responsibilities = [
        ("ownership", "Own the test suite and maintain >80% coverage"),
        ("execution", "Review all pull requests within 4 hours"),
        ("collaboration", "Pair program on complex features"),
    ]

    print("\nAdding responsibilities...")
    for category, statement in responsibilities:
        resp = requests.post(
            f"{BASE_URL}/responsibilities",
            headers=headers,
            json={"agentId": agent_id, "category": category, "statement": statement},
        )
        resp.raise_for_status()
        print(f"  [{category}] {statement}")

    # 5. Fetch the generated system prompt
    print("\nFetching system prompt...")
    resp = requests.post(
        f"{BASE_URL}/agents/{agent_id}/regenerate-prompt",
        headers=headers,
    )
    resp.raise_for_status()

    resp = requests.get(f"{BASE_URL}/agents/{agent_id}", headers=headers)
    resp.raise_for_status()
    agent_data = resp.json()
    prompt = agent_data.get("system_prompt", "(no prompt generated)")
    print(f"\n--- System Prompt ---\n{prompt[:500]}...")

    # 6. Import a CLAUDE.md
    print("\n\nImporting CLAUDE.md...")
    claude_md = """# My Agent

## Principles
- Always validate inputs at system boundaries
- Prefer composition over inheritance
- Log decisions, not just outcomes

## Boundaries
- Never use eval() or dynamic code execution
- Never store passwords in plaintext
"""
    resp = requests.post(
        f"{BASE_URL}/agents/{agent_id}/import-claude-md",
        headers=headers,
        json={"content": claude_md, "dryRun": True},
    )
    resp.raise_for_status()
    result = resp.json()
    print(f"  Would create: {result.get('beliefs_created', 0)} beliefs, {result.get('responsibilities_created', 0)} responsibilities")
    for item in result.get("items", []):
        print(f"  [{item['type']}:{item['category']}] {item['statement']}")

    print(f"\n\nDashboard: https://persona.liveneon.ai/{org_slug}/agents/{agent_id}")


if __name__ == "__main__":
    main()
