# OPDS-25: [Epic] Figma plugin (later — parked)

**Flowlu ID:** 949
**Flowlu Label:** OPDS-25
**Type:** Task
**Priority:** Low
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T11:49:59.116Z

## Description
Goal Figma plugin for OpenDS, in the style of the Penpot plugin. Parked — not started. Context that makes this cheaper App already ships Figma converters: server/api/design-tools/converters.ts (figmaStyleToOpenDS, figmaNodeToOpenDS) Generic design-tool API namespace exists (server/api/design-tools/*) with OAuth-shaped plugin-interface and docs/DESIGN-TOOLS-API.md docs/AGENTS note the multi-tool roadmap ("Penpot, Figma, and more") Open decision Figma plugin ingestion target: bespoke /api/figma/* mirror vs the generic /api/design-tools/* path (converters ready). Consider also migrating Penpot onto the generic path so there is one ingestion contract. Acceptance Criteria (when started) Sync tokens (and later components) from a Figma file to OpenDS Same choose-what-to-sync + auto-sync-while-open pattern as Penpot plugin
