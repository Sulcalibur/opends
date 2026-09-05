# OPDS-28: Bug: API keys created via admin UI fail to validate in SQL mode

**Flowlu ID:** 952
**Flowlu Label:** OPDS-28
**Type:** Bug
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.117Z

## Description
Problem POST /api/admin/api-keys stores a SHA-256 hash in mcp_api_keys, but in SQL mode validateApiKey() (server/utils/auth.ts) looks up the RAW key in the legacy api_keys table → a key created through the UI never validates, breaking Penpot plugin / MCP / plugin endpoints on SQL installs. (PocketBase mode validates against the hash — correct.) Suggested fix Make the SQL validator hash the presented key and look up mcp_api_keys (consistent with creation + PB mode), or drop the legacy raw-key path. Acceptance Criteria Key created via admin UI validates against /api/plugin/health, /api/penpot/tokens and /api/penpot/components in SQL mode Existing hard-coded dev keys keep working
