# OPDS-27: Fix SQL-mode admin editors: data fetches run unauthenticated

**Flowlu ID:** 951
**Flowlu Label:** OPDS-27
**Type:** Task
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T15:30:00.000Z

## Description
Problem In SQL (JWT) mode the admin component/docs editors render empty ("No specification defined", "Delete ?", no doc content). PocketBase mode works because auth rides the httpOnly pb_auth cookie; SQL mode auth is a Bearer token held in localStorage, so SSR/client data fetches to /api/* run without credentials → 401 → empty editors. Likely directions Serve SQL-mode access token in an httpOnly cookie on login and let server auth read header-or-cookie (mirrors PB path), or Client $fetch interceptor that injects the stored Bearer token, or Route-rule / data-layer change for admin surfaces Acceptance Criteria Admin component + docs editors load seeded content in SQL mode UI login survives page reloads in SQL mode (regression-guarded)

---
## Verification (2026-09-05, auto) — CONFIRMED STILL OPEN
Evidence on released main (9c54bb2): app/composables/useApi.ts is cookie-only ("pb_auth cookie is sent automatically — no manual Authorization header"); admin editor pages fetch via useApi/useFetch without a Bearer; the mode-aware store (app/stores/auth.ts) has a SQL Bearer wrapper but nothing routes these page fetches through it. tests/e2e/admin.spec.ts (committed 7a08178) skips both editor tests with reason: "SQL-mode admin editors render empty: their data fetches run without auth … SQL mode needs an SSR Bearer-injection layer." Suggested fix direction confirmed: wire admin fetches through the store wrapper (authStore.request) or an SSR header-injection layer, then re-enable the two skipped E2E tests as regression guards.
