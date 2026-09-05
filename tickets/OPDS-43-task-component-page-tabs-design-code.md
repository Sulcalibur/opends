# OPDS-43: Component page tabs — Design | Code (React) | Code (Vue) | ... per-framework

**Flowlu ID:** 967
**Flowlu Label:** OPDS-43
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T21:30:00.000Z

## Description

Goal: Organize the public component page into top-level tabs: Design | Code (React) | Code (Vue) | Code (Svelte) | ... where Code tabs come from the codegen template list (new language = new template, not UI work). Design tab = live sandbox/preview + variants + anatomy + props + a11y, with linked Figma/Penpot embeds appearing at the top when present (OPDS-42). Hub surfaces (versions, comments, related) slot in as tabs or sections per density (OPDS-38/41).

Tasks:
- Re-architect the public component page IA: replace the stacked sections + Preview/Code/Anatomy + framework switcher with top-level tabs
- Design tab: existing live sandbox, variants, anatomy, props, a11y; render linked design embeds (spec.external, OPDS-42) above the sandbox when present; clean empty state otherwise
- Code tabs: one per supported framework (Vue/React/Svelte from the codegen service), each showing that framework's generated code + copy; framework list derived from templates so new languages need no UI change
- Decide tab placement for hub surfaces (Versions string/OPDS-22 history, Comments OPDS-40, Used-in OPDS-41) — tabs when dense, footer sections otherwise
- Keep URL-per-view possible (tab in the route or query) for deep links to e.g. /components/button?tab=code-react
- Tests: E2E tab navigation + per-framework code rendering on seeded components; typecheck green

Acceptance Criteria:
- Component page shows Design + one Code tab per supported framework
- Design embeds render only when allow-listed external refs exist (OPDS-42)
- Adding a codegen language adds its tab automatically
- Deep links to a specific tab work; vitest + E2E pass

Context: page-IA layer over OPDS-38 (hub), OPDS-42 (external refs/embeds), OPDS-41 (composition). Codegen for Vue/React/Svelte already exists (server codeGenerator service). Implement with the OPDS-38/41/42 spec model in one pass.
