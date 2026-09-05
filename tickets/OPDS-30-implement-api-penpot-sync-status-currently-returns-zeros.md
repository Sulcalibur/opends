# OPDS-30: Implement /api/penpot/sync-status (currently returns zeros)

**Flowlu ID:** 954
**Flowlu Label:** OPDS-30
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T15:30:00.000Z

## Description
Problem GET /api/penpot/sync-status is a stub returning { synced: 0, pending: 0, conflicts: 0 }. Tasks Define what sync status means (last push timestamps, counts, drift vs latest payload) Persist last sync metadata per source/API key and expose it Update Penpot plugin Status tab to consume it (currently "Coming in Phase B")

---
## Verification (2026-09-05, auto) — STILL STUB; PRODUCT DECISION NEEDED
server/api/penpot/sync-status.get.ts still returns hardcoded zeros on released main. NEW EVIDENCE: the shipped plugin (opends-penpot-plugin public/plugin.js, released 2ba5903) never calls /api/penpot/sync-status at runtime — only the non-shipped src/plugin/api/hub-api.ts does. Recommend deciding whether to build it (needs a consumer: plugin Status tab) or drop/re-scope the ticket (PROJECT-UNDERSTANDING.md OQ-4).
