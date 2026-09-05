# OPDS-34: Publish a clean docker-compose that pulls the GHCR image

**Flowlu ID:** 958
**Flowlu Label:** OPDS-34
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T14:30:00.000Z

## Description

Goal: Current docker-compose.yml uses build: . so every user compiles the app. Part 5 needs a compose file that references the published image so setup is pull-and-up.

Tasks:
- Switch the opends service to image: ghcr.io/opends:<tag> with a documented default tag
- Keep the PocketBase 0.39.10 service pinned as-is
- Document the single-container SQLite profile alongside PocketBase mode

Acceptance Criteria:
- docker compose up works on a fresh machine with zero build output
- README and site docs reference the published compose file
- SQLite single-container path is documented next to PocketBase mode
