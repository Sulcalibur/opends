# OPDS-44: MCP admin controls — on/off toggle + in-app connection details

**Flowlu ID:** 968
**Flowlu Label:** OPDS-44
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T22:00:00.000Z

## Description

Goal: Give admins control over the MCP server and make its details visible in the app. MCP currently runs whenever the app runs (mounted via @nuxtjs/mcp-toolkit at POST /mcp, Bearer mcp-key; keys created on the admin API Keys page; docs in docs/MCP.md) — there is no toggle and no in-app surface showing the endpoint, auth, or tools.

Tasks:
- Add mcp_enabled (default on) to the settings store (PB + SQL)
- Server guard: when disabled, /mcp and its tool endpoints refuse cleanly (404/403) without leaking tool existence
- Admin surface (Integrations/Connections area): shows the MCP endpoint URL, auth method (Bearer key, link to API Keys page), available tools list, docs link — and the on/off switch
- Toggle state respected immediately without a full restart where the toolkit allows; otherwise document the restart requirement honestly
- Settings API never exposes internal-only flags to the public endpoint
- Tests: E2E toggle off -> MCP endpoint disabled; toggle on -> re-enabled

Acceptance Criteria:
- Admin can turn MCP off and on; the /mcp endpoint honours the flag
- MCP connection details (endpoint, auth, tools) are visible in-app
- Typecheck green, vitest + E2E pass

Context: MCP is mounted in nuxt.config via @nuxtjs/mcp-toolkit (route /mcp, dir mcp). Existing key management on the admin API Keys page stays authoritative. Respects the one-mode-per-deployment data rule.
