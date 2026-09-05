# OPDS-29: Bug: public/admin pages read the API envelope at the wrong level

**Flowlu ID:** 953
**Flowlu Label:** OPDS-29
**Type:** Bug
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.117Z

## Description
Problem Several pages read useFetch('/api/...') payloads at .settings/.components/.pages instead of .data.settings etc. (all endpoints return { success, data: {...} }). Result: home hero always shows static fallback numbers ("Design System", 48 components), /docs list shows no groups, settings page fields empty. Affected surface (observed) app/pages/index.vue (hero/stats/org name) app/pages/docs/index.vue (guideline groups) app/pages/admin/settings + others reading envelope incorrectly Acceptance Criteria Home reflects seeded org name + live counts when data present, falls back cleanly when absent Docs index groups seeded guideline pages Settings shows saved values (e.g. organization_name)
