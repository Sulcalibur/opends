# OPDS-23: [Epic] Demo design system + fresh-install seeding + E2E (shipped)

**Flowlu ID:** 947
**Flowlu Label:** OPDS-23
**Type:** Task
**Priority:** Medium
**Status:** Done / Review

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T15:30:00.000Z

## Description
Goal Ship a complete demo design system ("Ember") with OpenDS so a fresh instance has content, plus a seed path and an end-to-end test flow proving every surface works. Delivered (working tree of opends/) design-system-data/: 130 tokens (tokens.json), 8 components with full spec (components/*.json), 5 docs pages + manifest, config.json (org "Ember"), README scripts/seed-demo.mjs + "pnpm seed:demo" — pushes dataset through the public API, idempotent tests/e2e/ — hermetic Playwright harness (webServer SQLite temp DB, global setup seeds, teardown cleans) with content-conformance (seed contract, search, codegen, export, admin write flows, Penpot import contract), public smoke, admin suites Results: Playwright 19 passed / 2 documented skips; Vitest 237/237 Bugs fixed along the way SQLite adapter: INSERT…RETURNING rows lost, $N param reuse broke — server/utils/db.ts Migration runner dropped comment-led CREATE TABLE + broke on triggers — server/utils/migrations.ts; schema missing docs/api-key tables added Settings async transaction, JSON values unparsed, PG-only casts — repositories Vue 3.5.26 vs 3.5.38 duplicate runtime (crash: reading 'ce') fixed via pnpm.overrides Client auth mode-aware (SQL + PocketBase) — app/stores/auth.ts Acceptance Criteria pnpm seed:demo populates a fresh instance; re-run is a no-op pnpm test:e2e and vitest pass on a clean checkout (Node 20/22)

---
## Verification (2026-09-05, auto)
Deliverables released on opends main (9c54bb2, commit 76743aa + 7a08178). Re-ran gates on released main: vitest 237/237, Playwright 21 passed / 2 documented skips (editor pages — see OPDS-27). Status Done / Review confirmed accurate. Triage: ready-for-human (ship verification of the demo dataset on a fresh install via the published image is tracked under OPDS-36/37).
