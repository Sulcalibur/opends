# OpenDS MVP v1.0 Design Document

**Date:** 2026-03-12  
**Status:** Draft  
**Target:** Stable v1.0 for personal use

---

## Problem Statement

OpenDS v0.2.0 has solid foundations but critical gaps prevent it from being a usable MVP:

- Missing user CRUD operations
- Incomplete component workflows (edit/delete missing)
- Basic code generation stubs not functional
- Auth middleware has TODOs

We need to close these gaps to reach a stable v1.0.

---

## Constraints

1. **Personal/Learning scope** - Keep it tight, no enterprise features
2. **Vue only** - No React/Svelte codegen for MVP
3. **Penpot only** - No Figma integration yet
4. **Self-hosted only** - No SaaS/multi-tenant complexity
5. **Tech stack fixed** - Nuxt 4.2.2 / Vue 3 / NuxtUI v4 / PostgreSQL

---

## Approach: Incremental Gap-Filling

Rather than adding new features, we'll complete what's partially built:

1. **Finish auth system** - Add missing user CRUD
2. **Complete token API** - Add missing GET endpoint
3. **Finish component admin** - Implement edit/delete
4. **Make codegen real** - Replace stubs with Vue templates

**Why this approach?**

- Lower risk than adding new features
- Builds on existing solid foundation
- Gets us to usable product faster
- Easier to test and stabilize

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        OpenDS v1.0                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Nuxt 4 + NuxtUI v4)                              │
│  ├── Public: Component docs, Token viewer                   │
│  └── Admin: User mgmt, Token mgmt, Component mgmt, Settings │
├─────────────────────────────────────────────────────────────┤
│  Backend (Nitro + h3)                                       │
│  ├── Auth: JWT-based with bcrypt                            │
│  ├── API: RESTful endpoints for all resources               │
│  └── MCP: Tools for AI integration                          │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)                                      │
│  ├── Users, Tokens, Components, Docs                        │
│  └── Settings, API Keys                                     │
├─────────────────────────────────────────────────────────────┤
│  Integrations                                               │
│  └── Penpot: Token/component import                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User → Admin UI → API Route → Repository → PostgreSQL
2. Penpot → Webhook → API Route → Repository → PostgreSQL
3. MCP Tool → API Route → Repository → PostgreSQL
4. Public Docs → API Route → Repository → PostgreSQL
```

---

## Components & Responsibilities

### Phase 1: Foundation Fixes

#### 1.1 Token API Completion

**Missing:** GET single token endpoint

**Component:** `server/api/tokens/[id].get.ts`
**Responsibility:** Retrieve single token by ID with full details
**Data:** Returns token object with metadata
**Auth:** Required (admin or token viewer role)

#### 1.2 User CRUD

**Missing:** POST, PUT, DELETE endpoints + admin UI

**Components:**

- `server/api/users/index.post.ts` - Create user
- `server/api/users/[id].put.ts` - Update user
- `server/api/users/[id].delete.ts` - Delete user
- `app/pages/admin/users/index.vue` - User management UI

**Responsibility:** Full user lifecycle management
**Data:** User profiles with roles (admin/editor/viewer)
**Auth:** Admin only

#### 1.3 Auth Middleware Fixes

**Missing:** Auth checks on 3 endpoints

**Component:** `server/middleware/auth.ts` + endpoint files
**Responsibility:** Ensure all admin endpoints verify JWT and roles

### Phase 2: Component Workflow

#### 2.1 Component Edit

**Missing:** Edit functionality in admin

**Components:**

- `app/pages/admin/components/[id]/edit.vue` - Edit form
- Existing PUT endpoint may need updates

**Responsibility:** Modify component metadata, examples, documentation

#### 2.2 Component Delete

**Missing:** Delete functionality

**Components:**

- Add delete button to admin component list
- Ensure DELETE endpoint works

**Responsibility:** Remove component with confirmation

#### 2.3 Version/Review System

**Missing:** Currently stubbed

**Decision:** For MVP, implement basic version tracking (created_at, updated_at, version number). Full review workflow deferred.

### Phase 3: Vue Code Generation

#### 3.1 Template System

**New Component:** `server/templates/vue/`

**Structure:**

```
server/templates/vue/
├── component/
│   ├── base.vue.template
│   ├── with-props.vue.template
│   └── with-slots.vue.template
├── composable/
│   └── use[Name].ts.template
└── index.ts (template registry)
```

**Responsibility:** Generate Vue 3 code from component definitions

#### 3.2 Code Generator

**Component:** `server/utils/codeGenerator.ts` (exists but stubbed)

**Responsibility:**

- Load templates
- Replace placeholders with component data
- Return generated code string

#### 3.3 Admin UI

**Component:** Add to `app/pages/admin/components/[id]/index.vue`

**Responsibility:** Button to generate code, display in modal

### Phase 4: Polish

#### 4.1 Testing

- Run full test suite
- Fix any failures
- Add tests for new endpoints

#### 4.2 Deployment

- Verify Docker Compose works
- Test Coolify deployment flow
- Document deployment steps

---

## Error Handling Strategy

### API Errors

- Use `createError` from h3 for consistent error responses
- Return `{ success: false, error: string }` format
- Log errors server-side
- Display user-friendly messages in UI

### Auth Errors

- 401 for missing/invalid token
- 403 for insufficient permissions
- Redirect to login on 401 in UI

### Database Errors

- Wrap in try/catch
- Return 500 with generic message
- Log full error details

---

## Testing Strategy

### Unit Tests

- Repository functions
- Utility functions (codeGenerator)
- Keep alongside files: `*.spec.ts`

### Integration Tests

- API endpoint testing with Vitest
- Test happy paths and error cases

### Manual Testing

- Full user flow in browser
- Penpot integration testing
- Code generation verification

---

## Open Questions

1. **User roles** - Do we need more than admin/editor/viewer for personal use?
   - _Recommendation:_ Keep simple for MVP

2. **Component versioning** - How deep do we go?
   - _Recommendation:_ Basic timestamps only for MVP

3. **Codegen templates** - How many variations?
   - _Recommendation:_ 2-3 basic templates for MVP

4. **Penpot sync** - Manual trigger or webhook?
   - _Recommendation:_ Both available, manual for control

---

## Success Criteria

✅ **v1.0 Complete when:**

1. All 15 tasks in task_plan.md are complete
2. Full test suite passes
3. Can deploy with Docker/Coolify without errors
4. Can create users, manage tokens, document components
5. Can generate basic Vue code from components
6. Can import from Penpot

---

## Timeline Estimate

- **Phase 1:** 3-4 days
- **Phase 2:** 2-3 days
- **Phase 3:** 3-4 days
- **Phase 4:** 2-3 days

**Total: 10-14 days** (depending on availability)

---

_Ready for implementation. Created by: Design Agent_  
_Date: 2026-03-12_
