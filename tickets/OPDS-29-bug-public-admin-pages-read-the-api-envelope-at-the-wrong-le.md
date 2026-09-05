# OPDS-29: Bug: public/admin pages read the API envelope at the wrong level

**Flowlu ID:** 953
**Flowlu Label:** OPDS-29
**Type:** Bug
**Priority:** Medium
**Status:** To do

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T15:30:00.000Z

## Description
Problem Several pages read useFetch('/api/...') payloads at .settings/.components/.pages instead of .data.settings etc. (all endpoints return { success, data: {...} }). Result: home hero always shows static fallback numbers ("Design System", 48 components), /docs list shows no groups, settings page fields empty. Affected surface (observed) app/pages/index.vue (hero/stats/org name) app/pages/docs/index.vue (guideline groups) app/pages/admin/settings + others reading envelope incorrectly Acceptance Criteria Home reflects seeded org name + live counts when data present, falls back cleanly when absent Docs index groups seeded guideline pages Settings shows saved values (e.g. organization_name)

---
## Verification (2026-09-05, auto) — CONFIRMED STILL OPEN
Evidence on released main: all endpoints return { success, data: {...} } (server/utils/response.ts). app/pages/index.vue reads settingsData.value?.settings, docsData.value?.pages (should be .data.settings / .data.pages); only components/tokens computeds defensively try both levels. Result: home org name + hero stats still fall back to static numbers (48 components / 218 tokens) exactly as filed. tests/e2e/smoke.spec.ts only asserts the 4 stat boxes exist (counts asserted at the API level in content-conformance, not on the page), so the symptom is not E2E-guarded. Also check admin/settings unwrap.
