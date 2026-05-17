# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Production build
pnpm preview          # Preview production build

# Testing
pnpm test             # Run all unit tests (vitest)
pnpm test -- --run path/to/file.spec.ts  # Run a single test file

# Quality
pnpm lint             # ESLint with auto-fix
npx nuxi typecheck    # TypeScript type checking

# Storybook
pnpm storybook        # Start Storybook at http://localhost:6006

# Docker
pnpm docker:up        # Start PostgreSQL + app via Docker Compose
```

## Architecture

OpenDS is a **Nuxt 4** full-stack app. The `nuxt.config.ts` sets the app source to the `/app` directory (Nuxt 4 convention). All frontend code lives in `/app`; all server code lives in `/server`.

### Key directories

| Path | Purpose |
|------|---------|
| `app/pages/` | File-based routing (Nuxt 4) |
| `app/components/` | Vue components (auto-imported) |
| `app/composables/` | Vue composables (auto-imported) |
| `app/stores/` | Pinia stores |
| `app/middleware/` | Route middleware (`auth.ts`, `guest.ts`) |
| `server/api/` | Nitro API routes (filename = HTTP method: `index.get.ts`) |
| `server/utils/` | Server utilities (auto-imported in server context) |
| `server/services/` | Business logic services |
| `server/repositories/` | Database query layer |
| `server/middleware/` | Server middleware (CORS, auth, logging) |
| `server/mcp/` | MCP server tools and resources |

### Database layer (`server/utils/db.ts`)

The `UniversalDatabase` class supports three backends via a single `query()` API:
- **SQLite** (default local dev) — auto-selected when no `DATABASE_URL` is set
- **PostgreSQL** — selected when `DATABASE_URL` starts with `postgresql://`
- **Cloudflare D1** — selected when `CF_PAGES=1` or `DATABASE_URL` starts with `d1:`

Queries are written in PostgreSQL syntax (`$1`, `$2` params). The SQLite adapter translates these to `?` automatically. Always write queries in PostgreSQL syntax.

Migrations run automatically on server startup via `server/utils/migrations.ts` through the Nitro plugin at `server/plugins/database.ts`.

### Authentication

JWT-based auth. Tokens (access: 15m, refresh: 7d) are stored in `localStorage` and managed by `app/stores/auth.ts`. The `auth` route middleware redirects unauthenticated users to `/login`. Server routes validate tokens via `server/utils/auth.ts`. Roles: `admin`, `editor`, `viewer`.

### MCP Server

An MCP server is exposed at `/mcp` via `@nuxtjs/mcp-toolkit`. Tools and resources live in `server/mcp/tools/` and `server/mcp/resources/`. This allows AI tools to query design tokens and components directly.

## Standards (from AGENTS.md)

- **ONLY** use `<script setup lang="ts">` — never Options API
- **ONLY** use NuxtUI v4 components (`UButton`, `UCard`, etc.) — no PrimeVue
- Use **named exports** everywhere — avoid default exports
- Use **named functions** for methods; arrow functions only for callbacks
- Do **not** manually import auto-imported items (`ref`, `computed`, `useFetch`, Nuxt UI components, custom composables)
- Use **Tailwind classes** — never hard-code colors
- Keep test files alongside source: `Button.vue` + `Button.spec.ts`
- Component naming: most-general to most-specific (`SearchButtonClear`, not `ClearSearchButton`)

### Nuxt 4 directory rules — NEVER create these at root level
- ~~`/components`~~ → `/app/components`
- ~~`/pages`~~ → `/app/pages`
- ~~`/layouts`~~ → `/app/layouts`
- ~~`/composables`~~ → `/app/composables`

### Prop shorthand
```vue
<!-- ✅ -->
<MyComponent :count />
<!-- ❌ -->
<MyComponent :count="count" />
```

### Slot shorthand
```vue
<!-- ✅ -->
<UCard><template #header>…</template></UCard>
<!-- ❌ -->
<UCard><template v-slot:header>…</template></UCard>
```

## Environment Setup

Copy `.env.example` to `.env`. Key variables:
- `DATABASE_URL` — PostgreSQL connection string (omit to use SQLite)
- `JWT_SECRET` — required for auth; generate with `openssl rand -base64 32`
- `ALLOW_REGISTRATION` — set to `false` to disable public sign-up

## Nuxt UI CSS workaround

In dev mode, Nuxt UI CSS is served from `/nuxt-ui.css` (copied from `.nuxt/ui.css` into `public/`). If styles appear broken, verify `public/nuxt-ui.css` exists. This path is whitelisted in the auth middleware.

## Before committing

1. `npx nuxi typecheck` — fix all TS errors
2. `pnpm lint` — fix all lint errors
3. `pnpm test -- --run` — verify tests pass

Husky runs pre-commit hooks automatically.
