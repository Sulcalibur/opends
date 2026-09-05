# OPDS-30: Implement /api/penpot/sync-status (currently returns zeros)

**Flowlu ID:** 954
**Flowlu Label:** OPDS-30
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.117Z

## Description
Problem GET /api/penpot/sync-status is a stub returning { synced: 0, pending: 0, conflicts: 0 }. Tasks Define what sync status means (last push timestamps, counts, drift vs latest payload) Persist last sync metadata per source/API key and expose it Update Penpot plugin Status tab to consume it (currently "Coming in Phase B")
