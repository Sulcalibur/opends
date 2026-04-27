# OpenDS v1.0 Design Document

**Date**: 2026-04-27
**Status**: Approved
**Target**: v1.0 Release (12-week timeline)

---

## 1. Executive Summary

OpenDS is a self-hosted design system documentation platform for small teams and startups. It combines design token management, component documentation, and living style guides in one deployable package — the self-hosted alternative to Zeroheight and Storybook Cloud.

**Value Proposition**: All-in-one completeness. Tokens + components + docs + code generation in a single self-hosted tool that small teams can deploy in minutes.

**Success Metric**: The public docs site is professional enough that teams are proud to share it with stakeholders.

---

## 2. Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│  Layer 3: Presentation                   │
│  ├─ Public Docs Site (public users)      │
│  ├─ Admin Dashboard (admin/editors)      │
│  ├─ Component Viewer                     │
│  └─ Token Browser                        │
├─────────────────────────────────────────┤
│  Layer 2: Domain Services                │
│  ├─ Token Engine                         │
│  ├─ Component Registry                   │
│  ├─ Doc Publisher                        │
│  ├─ Code Generator                       │
│  └─ Search Index                         │
├─────────────────────────────────────────┤
│  Layer 1: Foundation                     │
│  ├─ Auth (JWT + RBAC)                    │
│  ├─ Database (PostgreSQL/SQLite/D1)      │
│  ├─ Validation (Zod)                     │
│  ├─ Error Handling (standardized)        │
│  ├─ Middleware (CORS, logger, security)  │
│  └─ Testing (Vitest + Playwright)        │
└─────────────────────────────────────────┘
```

**Key Principle**: Layer N never talks to Layer N-2 directly. Services talk to repositories. Handlers talk to services.

---

## 3. Foundation Layer Detail

### 3.1 Authentication

- JWT-based auth with `bcryptjs` password hashing
- Role-based access control: `admin` | `editor` | `viewer`
- Middleware sets `event.context.user` after verifying JWT from `Authorization` header or cookie
- Token refresh mechanism with rotation
- Remove hardcoded API keys from auth middleware (use proper JWT validation)

### 3.2 Repository Pattern

Every entity gets a typed repository:

```typescript
interface Repository<T> {
  findAll(filter?: FilterOptions): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateInput<T>): Promise<T>;
  update(id: string, data: UpdateInput<T>): Promise<T>;
  delete(id: string): Promise<void>;
  findBySlug?(slug: string): Promise<T | null>;
}
```

Repositories: `token.repository.ts`, `component.repository.ts`, `user.repository.ts`, `documentation.repository.ts`, `settings.repository.ts`, `search.repository.ts`, `mcp-key.repository.ts`

### 3.3 Validation

- Zod schemas at every API boundary
- Use `readValidatedBody(event, schema)` from `h3-zod`
- Shared schemas in `server/schemas/` (e.g., `token.schema.ts`, `component.schema.ts`)

### 3.4 Error Handling

Standardized response envelope:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```

Error codes:

- `AUTH_UNAUTHORIZED` — Missing/invalid token
- `AUTH_FORBIDDEN` — Insufficient permissions
- `VALIDATION_ERROR` — Schema validation failed
- `NOT_FOUND` — Resource doesn't exist
- `CONFLICT` — Resource already exists
- `INTERNAL_ERROR` — Unexpected server error

### 3.5 Testing Strategy

- **Unit**: Services and utilities (Vitest)
- **Integration**: Repository + database (SQLite in-memory via UniversalDatabase)
- **E2E**: Critical user paths (Playwright)
  - Login → Create token → View public docs
  - Create component → Edit component → Generate code
  - Create doc → Publish → View on public site

---

## 4. Domain Services Layer

### 4.1 Token Engine

- **Hierarchy**: Parent/child tokens with dot-notation paths (`color.primary.500`)
- **Types**: `value` (concrete), `reference` (points to another token), `alias` (semantic name)
- **Export formats**: CSS custom properties, JSON, SCSS variables
- **Validation**: Circular reference detection, type consistency
- **Operations**: CRUD + resolve references + export

### 4.2 Component Registry

- **Spec structure**: JSONB fields for props, slots, events, examples
- **Dependencies**: Component A depends on Component B (for build ordering)
- **Categories**: Group components by type (form, navigation, feedback, etc.)
- **Tags**: Free-form labels for filtering
- **Operations**: CRUD + dependency resolution + spec validation

### 4.3 Doc Publisher

- **Content**: Markdown with shortcode support
- **Hierarchy**: Parent/child pages with automatic slug generation
- **Workflow**: Draft → Published (with optional scheduled publish)
- **URL scheme**: `/docs/[slug]`
- **Operations**: CRUD + publish/unpublish + hierarchy management

### 4.4 Code Generator

- **Vue**: Complete template system in `src/design-system/templates/vue/`
- **React**: Template system in `src/design-system/templates/react/` (v1.0)
- **Svelte**: Template system in `src/design-system/templates/svelte/` (v1.0)
- **Output**: Component source code with prop types, slots, and example usage
- **Operations**: Generate from component spec → return source code

### 4.5 Search Index

- **Backend**: PostgreSQL Full-Text Search (existing triggers)
- **Unified endpoint**: `/api/search?q=query` returns mixed results
- **Result types**: Token, Component, Documentation Page
- **Ranking**: Relevance score + type boosting
- **UI**: CMD+K spotlight overlay with instant results

---

## 5. Presentation Layer

### 5.1 Public Docs Site

**Header**: Logo, search (CMD+K), theme toggle (light/dark)
**Left Sidebar**: Navigation tree (hierarchical docs + component list + token categories)
**Main Content**: Rendered markdown with component/token embeds
**Right TOC** (optional): Auto-generated table of contents for long pages

**Page Types**:

- `/components/[slug]` — Component detail with live preview, props table, code examples
- `/tokens/[path]` — Token detail with visual swatches
- `/docs/[slug]` — Documentation page with markdown rendering

### 5.2 Component Pages

- **Live Preview**: Interactive component with prop controls (sliders, toggles, selects)
- **Props Table**: Type, default, description, required flag
- **Code Examples**: Framework toggle (Vue/React/Svelte) + syntax highlighting + one-click copy
- **Design Tab**: Penpot frame embed (v1.1)

### 5.3 Token Pages

- **Color tokens**: Visual swatch blocks with hex/rgba values
- **Spacing tokens**: Measured boxes showing the actual spacing value
- **Typography tokens**: Rendered text sample with font family, size, weight, line-height
- **Reference tokens**: Link to source token with visual indication

### 5.4 Admin Dashboard

- **Utilitarian but cohesive**: Data tables with sorting/filtering, inline editing
- **Token Editor**: Visual editor for token values with live preview
- **Component Builder**: Form-based spec builder with live preview
- **Doc Editor**: WYSIWYG markdown editor (Milkdown) with shortcode support
- **Settings Panel**: Branding (logo, colors), registration toggle, API keys

### 5.5 Dark Mode

First-class support. All UI components support dark mode via Nuxt UI's color mode. Public docs and admin dashboard both respect system preference with manual override.

---

## 6. Cross-Cutting Concerns

### 6.1 Embedding & Linking

**Shortcode syntax for docs:**

```markdown
# My Design Doc

Here is our primary button:
::component{slug="button"}

Our brand colors:
::token-group{path="color.primary"}
```

**Component embed (`::component{slug}`)**:

- Compact card with name + description + 3 tabs (Live/Design/Code)
- MVP: Shows card linking to full component page
- v1.1: Rich embed with interactive preview

**Token embed (`::token{path}`)**:

- Inline color swatch for color tokens
- Text sample for typography tokens
- Measured box for spacing tokens

**Token group (`::token-group{path}`)**:

- Grid of all tokens under a path (e.g., all `color.primary.*` variants)

### 6.2 Data Flow

**Request lifecycle:**

1. Request → Nitro route
2. Middleware (CORS → Logger → Security → Auth)
3. Validation (Zod schema)
4. Handler calls Domain Service
5. Service calls Repository
6. Repository uses UniversalDatabase
7. Database → Repository → Service → Handler
8. Handler returns `{ success, data }` envelope

### 6.3 External Integrations

- **Penpot**: Webhook endpoint for token/component sync
- **MCP Server**: AI tool read access to tokens/components (write in v1.1)
- **Plugin API**: Design tools push/pull tokens

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

- **Week 1**: Auth system overhaul (RBAC, proper JWT middleware)
- **Week 2**: Repository pattern + error handling standardization
- **Week 3**: Zod validation everywhere + testing setup
- **Week 4**: Code review + foundation polish

### Phase 2: Domain Services (Weeks 5-8)

- **Week 5**: Token Engine (hierarchy, references, export)
- **Week 6**: Component Registry (spec structure, dependencies)
- **Week 7**: Doc Publisher (hierarchy, publish workflow)
- **Week 8**: Search Index (FTS triggers, unified endpoint)

### Phase 3: Presentation (Weeks 9-11)

- **Week 9**: Public docs site structure + routing + navigation
- **Week 10**: Component pages (preview + props + code) + Token pages (swatches)
- **Week 11**: Admin dashboard polish (tables, inline editing, markdown editor)

### Phase 4: Polish & Launch (Week 12)

- **Week 12**: E2E testing, documentation, deployment guide, release

### Post-v1.0 (v1.1)

- Rich component/token embeds in docs
- React/Svelte codegen polish
- Comments/reviews on components
- Analytics dashboard
- OAuth integration
- Figma integration

---

## 8. Technology Stack

- **Frontend**: Nuxt 4.2.2, Vue 3, NuxtUI v4, TypeScript, Tailwind CSS
- **Backend**: Nitro + h3, Zod validation
- **Database**: PostgreSQL (primary), SQLite (dev), Cloudflare D1 (edge)
- **Auth**: JWT + bcryptjs
- **Editor**: Milkdown (markdown)
- **Testing**: Vitest + Playwright
- **Deployment**: Docker Compose, Coolify

---

## 9. Standards & Conventions

- `<script setup lang="ts">` exclusively
- Composition API only (no Options API)
- Named functions for methods, arrow functions for callbacks
- Named exports preferred
- Auto-imports (no manual Vue/Nuxt/NuxtUI imports)
- `ui` prop for NuxtUI styling overrides
- Props with TypeScript interfaces
- `const props =` only when props used in script
- `#default` slot shorthand

---

## 10. Design Decisions

| Decision           | Rationale                                                            |
| ------------------ | -------------------------------------------------------------------- |
| Foundation-first   | A solid base makes all future features easier                        |
| Self-hosted        | Target audience (small teams) values data ownership and cost control |
| All-in-one         | Differentiation from single-purpose tools                            |
| NuxtUI v4 only     | Consistency, modern Vue patterns, no PrimeVue legacy                 |
| Repository pattern | Clean separation, testable, swappable backends                       |
| PostgreSQL primary | Proven, powerful FTS, JSONB for specs                                |

---

_Document version: 1.0_
_Next step: Implementation planning via writing-plans skill_
