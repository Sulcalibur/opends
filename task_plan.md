# Task Plan: OpenDS MVP v1.0

## Goal

Complete critical gaps to reach a stable v1.0 MVP for personal use - functional user management, complete token/component workflows, basic Vue code generation, and polished self-hosted deployment.

## Phases

### Phase 1: Foundation Fixes (Priority: Critical)

- [ ] Add GET single token endpoint (`/api/tokens/[id].get.ts`)
- [ ] Add user CRUD endpoints (POST, PUT, DELETE `/api/users/`)
- [ ] Fix auth middleware TODOs (3 endpoints missing auth checks)
- [ ] Add user management UI in admin panel

### Phase 2: Component Workflow Completion (Priority: High)

- [ ] Implement component edit functionality in admin UI
- [ ] Implement component delete functionality in admin UI
- [ ] Add component version/review system (currently stubbed)

### Phase 3: Vue Code Generation (Priority: Medium)

- [ ] Create Vue component templates directory structure
- [ ] Implement basic Vue component code generator
- [ ] Integrate codegen with design tokens
- [ ] Add codegen UI in admin panel

### Phase 4: Polish & Stabilization (Priority: Medium)

- [ ] Fix any remaining bugs from Phase 1-3
- [ ] Test Docker/Coolify deployment flow
- [ ] Update documentation for v1.0
- [ ] Run full test suite and fix failures

## Key Questions

1. ✅ User scope confirmed: Personal/Learning project
2. ✅ Tech stack confirmed: Nuxt 4.2.2 + Vue 3 + NuxtUI v4 + PostgreSQL
3. ✅ Integration priority: Penpot only
4. ✅ Code generation: Vue templates only

## Decisions Made

- **Scope**: Personal project, keep tight and focused
- **Codegen**: Vue only, no React/Svelte for MVP
- **Design Tools**: Penpot only, Figma deferred
- **Deployment**: Self-hosted only (Docker/Coolify)
- **Priority**: Fix critical gaps before adding features

## Errors Encountered

- (To be populated during implementation)

## Status

**Currently in Phase 1** - Starting with foundation fixes

## Current Check

- Phase 1 Progress: 0/4 complete
- Phase 2 Progress: 0/3 complete
- Phase 3 Progress: 0/4 complete
- Phase 4 Progress: 0/4 complete

**Total: 0/15 tasks complete**
