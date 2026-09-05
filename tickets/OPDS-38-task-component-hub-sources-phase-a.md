# OPDS-38: Component hub — aggregate OpenDS/Storybook/Penpot/Research/Version sources on the component page (Phase A)

**Flowlu ID:** 962
**Flowlu Label:** OPDS-38
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T20:00:00.000Z

## Description

Goal: Make one component page the hub for every source about that component. OpenDS stays an aggregator: native docs + code (already exist) plus optional panels for Storybook (embed), Penpot (deep link), Research (linked docs), and Version. Driven by a spec.sources metadata block — no new engines.

Tasks:
- Extend the component spec shape/type with spec.sources: { penpot?: {fileId, frameId, url}, storybook?: {url}, research?: [docRefs], version?: string }
- Persist sourceId/fileId on penpot-imported components (plugin already stores spec.source + sourceId — expose fileId in the import payload and seed data)
- Admin component editor: read/edit spec.sources fields
- Public component detail page: render source sections with clean empty states when absent
- Penpot section: deep link built from fileId/frameId (verify iframe embeddability; fall back to link + note)
- Storybook section: iframe embed rendered ONLY when a storybook.url is present; whitelist frame-src in CSP for configured hosts
- Research section: link to docs pages (Research doc category allowed in the docs model)
- Version section: semantic version string + last-updated (updated_at) — full history stays OPDS-22
- Tests: unit + E2E for seeded component hub rendering, empty states, embed-only-when-url

Acceptance Criteria:
- Seeded Ember components render the hub sections (Penpot link, version, empty states)
- No Storybook iframe is rendered when no storybook.url is set
- Penpot deep link resolves from spec source metadata
- Typecheck green, vitest + E2E pass

---
## Amendment (2026-09-05)
IMPLEMENTATION NOTE: OPDS-42 supersedes the named-slot spec.sources design in this ticket. Build the hub on the generic spec.external array model ({ type, label, url, embed? }) + tool registry from OPDS-42, with version as its own scalar. Composition ("Uses") is OPDS-41.
