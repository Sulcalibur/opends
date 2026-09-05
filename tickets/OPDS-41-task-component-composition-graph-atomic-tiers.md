# OPDS-41: Component composition graph + atomic tiers (Uses / Used in, manual-first)

**Flowlu ID:** 965
**Flowlu Label:** OPDS-41
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T20:30:00.000Z

## Description

Goal: Support atomic-design-style libraries: any component/pattern shows what it is composed of ("Uses") and what uses it ("Used in"), both as clickable links, so users can walk the graph. Manual authoring of "Uses" first; reverse links derived — no plugin or codegen changes in v1. Optional atomic tier classification (atom / molecule / organism / template).

Tasks:
- Extend the component spec shape/type with spec.uses: [slug] and optional spec.tier: atom|molecule|organism|template
- Admin component editor: "Uses" picker (multi-select of components by slug) + tier select
- Repository: reverse index query — components whose spec.uses includes this component (SQL LIKE over spec JSON + PB equivalent; junction table noted as later upgrade for integrity/cycle checks)
- Public/admin component pages: "Composed of" section (links) and "Used in" section (derived, with count), depth-capped traversal + cycle guard
- Seed real uses links in the Ember demo dataset (e.g. button -> icon, card -> button/checkbox) so the graph is visible on a fresh install
- Tests: unit (reverse index, cycle guard) + E2E (navigate hub links between seeded components)

Acceptance Criteria:
- Seeded Ember components show Composed of / Used in with working cross-links
- Editing "Uses" in the admin editor reflects on the public page
- Cycles in authoring do not hang the UI (guard + depth cap)
- Typecheck green, vitest + E2E pass

Context: companion to OPDS-38 (component hub). Full version history remains OPDS-22. Composition data is manual in v1; Penpot auto-extraction and code-import derivation are later enhancements.
