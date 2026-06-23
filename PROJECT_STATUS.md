# OpenDS — Session Summary (June 23, 2026)

## What was accomplished

### Phase 0 — Codebase Cleanup (65+ files deleted)
- Removed old Express stack: `server.js`, `src/`, `Serve/`
- Stripped `local-docs/` from 29 → 8 files (kept deployment, dev, quick-start guides)
- Purged 20+ research markdown files from `opends-penpot-plugin/`
- Removed debug screenshots, log files, stale JSON backups from root and `opends/`

### Phase 1 — Design Token Foundation
- `design-tokens.css` — authoritative token file with light + dark themes, exact values from design reference (Sweet Salmon `#FF6B4A`, Light Gold `#FFD166`)
- `dark-mode.css` — stripped from 389 → 30 lines (no glassmorphism, no glow)
- `animations.css` — stripped from 652 → 36 lines (150-300ms transitions only)
- `main.css` — removed GDS/MOJ government theme, added Salmon color scale for NuxtUI

### Phase 2 — Layout Shell
- 5 layout components built from design reference: `DocsHeader`, `DocsSidebar`, `DocsToc`, `DocsFooter`, `AdminSidebar`
- `layouts/default.vue` and `layouts/admin.vue` updated
- Old duplicate `AdminSidebar.vue` in `components/admin/` deleted

### Phase 3 — Screen Rebuild (17 pages)
**Public (5):** Home, Login, Register, Component detail (live sandbox with variant/size/icon/loading controls, variants grid, props table, a11y grid), Tokens

**Admin (10):** Dashboard, Token editor (three-column: tree + table + edit panel), Component editor (three-column: variants + canvas + prop editor with tabs), Docs editor (Milkdown), Users, Settings, Visibility, API Keys, New Component, New Token

**Docs:** Component detail page rebuilt with design reference layout

### Phase 4 — API & Auth Infrastructure
- Login flow fixed: changed from `useFetch` to `$fetch` for form submissions, corrected API response path (`data.data.tokens`), use `saveAuth()` instead of non-existent `setTokens()`
- Auth middleware made SSR-safe (skips on server, hydrates on client)
- New endpoint: `GET /api/components/by-slug/:slug` with full spec parsing
- Button component seeded in SQLite for testing
- `requireAuth()` fixed: switched from non-existent `sessions` table to JWT verification via `JwtService.verify()`
- API key creation fixed: added `key_hash` to repository interface, fixed `RETURNING *` dead-end in SQLite adapter, created `mcp_api_keys` table in SQLite

### Phase 5 — Test Suite
- Vitest: 22 files, 237 tests — ALL GREEN (all runs)
- Playwright: 13 tests, 11 pass, 2 timeout (component editor + docs editor — SSR hydration delay)

## Known Issues

1. **Login sometimes fails in browser** — API works via curl, but SSR renders error on the login page. Root cause: SSR Toaster crash (`Cannot read properties of null (reading 'ce')`). Workaround: restart server, then login immediately.
2. **Database connection drops on HMR rebuild** — Nuxt dev server rebuilds kill the SQLite connection. Added auto-reconnect in `db.ts` `query()` method, but still unstable.
3. **Primary color not picking up Salmon** — `app.config.ts` has inline color values, but NuxtUI v4's `@theme` block in `main.css` doesn't consistently register the Salmon color scale. Buttons show default green.
4. **2 Playwright tests timeout** — component editor + docs editor pages render slow during SSR.
5. **`admin/docs/[slug].vue` deleted** — duplicate route conflict resolved by keeping `[...slug].vue`.

## API Quick Reference

### Penpot Plugin Endpoints (use API Key for auth)
- `GET  /api/plugin/health` — connection test
- `POST /api/penpot/tokens` — push token payload
- `GET  /api/penpot/sync-status` — fetch sync stats

### MCP Server
- Endpoint: `POST /mcp` (auth: `Bearer <mcp-api-key>`)
- 5 tools + 1 resource exposed via `@nuxtjs/mcp-toolkit`

## File Counts
- Vue files (pages, components, layouts): 975
- TypeScript files (API, repos, services, utils): 1,806
- SQL migrations: 143
- Test files: 290
- **Total source:** 3,060

## Next Steps
1. Fix SSR Toaster crash on login page
2. Debug browser login flow (API works, browser doesn't)
3. Penpot plugin: `npm run build` → fix type errors → test in Penpot
4. Marketing site content + Directus CMS integration
5. Docker self-host story
