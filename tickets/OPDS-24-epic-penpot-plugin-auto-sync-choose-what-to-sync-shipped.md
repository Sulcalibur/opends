# OPDS-24: [Epic] Penpot plugin — auto-sync + choose-what-to-sync (shipped)

**Flowlu ID:** 948
**Flowlu Label:** OPDS-24
**Type:** Task
**Priority:** Medium
**Status:** Done / Review

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.116Z

## Description
Goal Zero-click design-token/component sync from Penpot to OpenDS while the panel is open, with user-selectable sync scope. Delivered (working tree of opends-penpot-plugin + opends/) Sync-on-open + debounced watch loop (~4s poll, ~2s debounce) with fingerprint change detection Pure logic in OPENDSCORE-START/END marker block; npm test = 15/15 node:test cases Scope selection: everything / all tokens / all components / choose components (checkbox picker) Components ingestion: new POST /api/penpot/components (API-key auth, dedupe by slugified name, status review) + FK fix in /api/penpot/tokens E2E regression tests for the import contract in opends/tests/e2e/content-conformance.spec.ts (10/10) Remaining child tasks (this epic is not fully closed) Manual verification inside a real Penpot instance (npm run serve → plugin manager) — not yet done Component code export (CSS/SVG/HTML) — later phase Decide whether Penpot migrates to the generic /api/design-tools ingestion path Acceptance Criteria Edit a library token/component with the panel open → pushed without clicks Scope respected by watch loop (out-of-scope edits never push)
