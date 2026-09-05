# OPDS-22: [Epic] Version history for design-system content

**Flowlu ID:** 946
**Flowlu Label:** OPDS-22
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.104Z

## Description
Goal Version history for OpenDS content — tokens, components, and docs — so teams can see what changed, when, and restore a previous version of a design system. Currently parked: this is a requested feature with the design still open. Open design questions (resting — not started) What gets versioned: token values, component specs, doc pages, or the whole design-system state? Storage approach: audit trail rows vs snapshot table vs diff records (SQL and PocketBase modes). Who can view and restore: admin-only vs editor; per-entity or whole-system restore. How auto-sync from Penpot/Figma interacts with versioning (each push = new version?). UI: history drawer on entity pages + diff view; nothing decided yet. Next step Write a short design note (opends/openspec change proposal) capturing scope + storage before implementation. Acceptance Criteria Change history visible per token/component/doc with author + timestamp Admin can restore a previous version Works in SQL and PocketBase modes Status: parked/backlog — deliberately no implementation yet.
