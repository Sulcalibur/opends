# OPDS-40: [Epic, later] Comments on design-system content (component/docs pages)

**Flowlu ID:** 964
**Flowlu Label:** OPDS-40
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T20:00:00.000Z

## Description

Goal: Parked follow-up to the component-hub direction: per-audience discussion on component and docs pages (Team role + comments per the IA doc visibility matrix). Intentionally NOT in Phase A — needs a real engine: storage (PB + SQL twins), API, threaded UI, role rules, visibility toggles.

Tasks:
- Design the data model + auth rules (which roles can comment on which visibility tiers)
- Backend: comments table + repository twins + API routes
- Frontend: threaded comment UI on component/docs pages; admin visibility toggle wired to real data (currently a hardcoded mock)

Acceptance Criteria:
- Team members can comment on component/docs pages per visibility settings
- Comments respect Public/Team/Admin tiers
