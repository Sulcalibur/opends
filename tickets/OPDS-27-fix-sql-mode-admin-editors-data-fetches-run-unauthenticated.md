# OPDS-27: Fix SQL-mode admin editors: data fetches run unauthenticated

**Flowlu ID:** 951
**Flowlu Label:** OPDS-27
**Type:** Task
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.116Z

## Description
Problem In SQL (JWT) mode the admin component/docs editors render empty ("No specification defined", "Delete ?", no doc content). PocketBase mode works because auth rides the httpOnly pb_auth cookie; SQL mode auth is a Bearer token held in localStorage, so SSR/client data fetches to /api/* run without credentials → 401 → empty editors. Likely directions Serve SQL-mode access token in an httpOnly cookie on login and let server auth read header-or-cookie (mirrors PB path), or Client $fetch interceptor that injects the stored Bearer token, or Route-rule / data-layer change for admin surfaces Acceptance Criteria Admin component + docs editors load seeded content in SQL mode UI login survives page reloads in SQL mode (regression-guarded)
