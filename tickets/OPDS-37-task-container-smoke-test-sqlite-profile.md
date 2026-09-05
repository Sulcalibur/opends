# OPDS-37: Container smoke test for the single-container SQLite profile

**Flowlu ID:** 961
**Flowlu Label:** OPDS-37
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T14:30:00.000Z

## Description

Goal: The Dockerfile supports SQLite mode (app alone with a data volume), but it has never been validated in a container: migrations must run on boot and data must persist across restarts.

Tasks:
- Run the published image standalone with DATABASE_URL=sqlite and a data volume
- Verify migrations create the schema on first boot and /api/health passes
- Restart the container and confirm data persists; record findings

Acceptance Criteria:
- Single-container SQLite boot is verified and documented
- Migrations run automatically on boot inside the container
- Findings recorded in the ticket or the decision log
