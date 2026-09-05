# OPDS-28: Bug: API keys created via admin UI fail to validate in SQL mode

**Flowlu ID:** 952
**Flowlu Label:** OPDS-28
**Type:** Bug
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T19:30:00.000Z

## Description
Problem POST /api/admin/api-keys stores a SHA-256 hash in mcp_api_keys, but in SQL mode validateApiKey() (server/utils/auth.ts) looks up the RAW key in the legacy api_keys table → a key created through the UI never validates, breaking Penpot plugin / MCP / plugin endpoints on SQL installs. (PocketBase mode validates against the hash — correct.) Suggested fix Make the SQL validator hash the presented key and look up mcp_api_keys (consistent with creation + PB mode), or drop the legacy raw-key path. Acceptance Criteria Key created via admin UI validates against /api/plugin/health, /api/penpot/tokens and /api/penpot/components in SQL mode Existing hard-coded dev keys keep working

---
## Verification (2026-09-05, auto) — CONFIRMED STILL OPEN
Evidence on released main: server/utils/auth.ts validateApiKey SQL branch (lines 31-40) does a RAW lookup `SELECT id FROM api_keys WHERE key = $1 AND deleted_at IS NULL` in the legacy api_keys table; the admin create route (server/api/admin/api-keys/index.ts:59) writes a sha256 key_hash into mcp_api_keys via McpApiKeyRepository; only the PocketBase branch hashes and checks mcp_api_keys (auth.ts:17-29). So admin-UI-created keys fail validation in SQL mode exactly as filed. Note: hard-coded dev keys (auth.ts:6-11) bypass and keep legacy raw api_keys rows working — but those are static strings in source (dev-only; do not ship as real secrets).

---
## Verification 2 (2026-09-05, auto) — FIXED, awaiting checks
Fix released on main (bb7e17c): server/utils/auth.ts SQL branch now falls back to a sha256-hash lookup via McpApiKeyRepository.findByHash on mcp_api_keys after the legacy raw api_keys check — mirrors the PB path. Legacy rows and hard-coded dev keys still work (AC 2). Verification: vitest 237/237, E2E 21 passed (SQL-mode temp instance), typecheck green. Suggested regression guard (future): create a key via the admin API then call /api/plugin/health with it in SQL mode.
