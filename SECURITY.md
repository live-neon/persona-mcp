# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

**Email:** hello@liveneon.ai

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Scope

This security policy covers:
- The MCP server (`mcp-persona` npm package)
- Platform skills in this repository
- The Live Neon Persona API at persona.liveneon.ai

## What We Do

- API keys are SHA-256 hashed (plaintext never stored)
- SSRF protection on all user-provided URLs
- Rate limiting on all endpoints
- Row-level security on all database tables
- Input validation and parameterized queries
