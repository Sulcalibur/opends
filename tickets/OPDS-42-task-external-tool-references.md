# OPDS-42: External tool references on components and docs (generic links + safe embeds: Miro, Jira, Figma, etc.)

**Flowlu ID:** 966
**Flowlu Label:** OPDS-42
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T21:00:00.000Z

## Description

Goal: Generalize the component-hub "sources" into one generic model: components AND docs pages can carry external references to any tool (Miro, Jira, Figma, Slack, GitHub, Notion, Storybook, Penpot, ...). Render as an icon link by default; embed via iframe ONLY for an admin-configured allow-list of hosts (Miro live-embed, Figma embed, Storybook, public Notion). No live API/status in v1 — Jira-style connected integrations are a later epic.

Tasks:
- Replace the named-slot spec.sources design in OPDS-38 with a generic spec.external: [{ type, label, url, embed? }] (keep version as its own scalar)
- Tool registry: known types with icon + embeddability flag (penpot, storybook, miro, figma, jira, slack, github, notion, generic); unknown types render as generic link
- Apply the same external-reference model to docs pages (component + docs surfaces)
- Embed allow-list: instance-level admin setting (hosts permitted to iframe), enforced in UI and reflected in CSP frame-src
- Default rendering: icon + label link; iframe embed only for allow-listed, embeddable types with clean empty/fallback states
- Seed Ember demo with realistic external references (e.g. Miro research board on a component, Jira issue link on a doc page, Figma frame)
- Security tests: non-allow-listed or non-embeddable URLs never render as iframe; CSP updated accordingly

Acceptance Criteria:
- Components and docs pages render external references as links; Miro/Figma/Storybook embed only when host is allow-listed
- Admin can configure the embed allow-list; CSP frame-src follows it
- New tools can be added via the registry without schema changes
- Typecheck green, vitest + E2E pass

Context: supersedes the named-slot rendering in OPDS-38; implement OPDS-38 with this generic model. Design principle: OpenDS aggregates, never re-implements; iframes are a security decision (allow-list only). Connected integrations with live API status (Jira cards etc.) are a later epic.
