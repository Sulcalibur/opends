# Task Plan: OpenDS Implementation

## Phase 2 — COMPLETE

- OPDS-5: Token Engine Service (format conversion) — 9 tests
- OPDS-6: Code Generator Service (framework code gen) — 7 tests
- OPDS-7: Documentation Service (auth + service + tests) — 11 tests
- OPDS-8: Search Service (service + indexing + tests) — 9 tests
- Full server suite: 98 tests passing, 0 failures
- Commit: `0e93ee4`

## Phase 3 — IN PROGRESS

### Goal

Build the public-facing UI: documentation site, component detail pages, global search, dark mode, and polish the admin dashboard.

### OPDS-9: Public Docs Site + Search/Dark Mode — COMPLETE

- [x] Task 13: Build Public Docs Site
  - `app/pages/docs/[slug].vue` — public component documentation
  - `app/pages/docs/index.vue` — docs listing
  - `app/components/docs/DocRenderer.vue` — Markdown/HTML rendering with syntax highlighting
  - Dark mode support for docs pages
- [x] Task 15: Global Search + Dark Mode Toggle
  - `app/components/layout/SearchModal.vue` — global search with Cmd/Ctrl+K
  - Integrate with `server/api/search.post.ts` endpoint
  - `app/components/layout/ThemeToggle.vue` — dark mode with localStorage persistence
  - Smooth theme transitions
- Commit: `01ea60d`

### OPDS-10: Component Detail Page — COMPLETE

- [x] Task 14: Build Component Detail Page
  - `app/pages/components/[id].vue` — component detail view with tabs (Preview, Documentation, Code)
  - `app/pages/components/index.vue` — public components listing with search/filter
  - `app/components/component-detail/ComponentSpec.vue` — metadata, props, slots, events display
  - `app/components/component-detail/CodeGenerator.vue` — Vue/React/Svelte code generation with copy-to-clipboard
  - Responsive layout with sidebar navigation
- Commit: `72a88b6`

### OPDS-11: Admin Dashboard Polish — IN PROGRESS

- [ ] Task 16: Polish Admin Dashboard
  - `app/components/admin/AdminTable.vue` — reusable table with sorting/filtering/pagination
  - Refactor `app/pages/admin/index.vue` with summary cards and charts
  - Polish tokens, components, docs, settings admin pages
  - Consistent NuxtUI v4 styling, responsive layouts

## Key Questions

1. How to handle markdown rendering and syntax highlighting in Nuxt 4?
2. Should component preview use an iframe or inline rendering?
3. What's the best approach for dark mode in NuxtUI v4?

## Decisions Made

- Use NuxtUI v4 ONLY for all new UI components
- Keep all new components in `/app/components/`
- Use Composition API + `<script setup>` exclusively
- Follow existing service layer patterns for API integration

## Status

**Currently in Phase 3** — OPDS-10 complete. Starting OPDS-11 (Admin Dashboard Polish).
