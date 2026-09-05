# E2E tests (Playwright)

Fresh-instance end-to-end coverage for OpenDS. The suite boots a throwaway
SQLite-mode app (temp DB per run, deleted on teardown), registers the first
admin, seeds the **Ember** demo design system through the public API, and then
asserts the product against that deterministic content.

## Run

```bash
pnpm test:e2e                 # from opends/
```

Requirements:

- pnpm and a Node LTS (20/22 — Docker uses 20) whose `better-sqlite3` binding
  is available. On machines where the default Node lacks the binding (e.g.
  Node 26 before `better-sqlite3` ships prebuilds for it), run under an LTS:
  `PATH="$HOME/.nvm/versions/node/v22.23.0/bin:$PATH" pnpm test:e2e`
- Chromium: `npx playwright install chromium`

## What it verifies

| File | Covers |
| --- | --- |
| `global-setup.ts` | Waits for the app, registers/seeds the Ember demo content (`scripts/seed-demo.mjs`); fails loudly if nothing imported |
| `content-conformance.spec.ts` | **Seed contract**: token/component/doc counts and contents match `design-system-data/` exactly · by-slug component spec (variants/props/a11y) · search across components/tokens/docs · token export · codegen for vue/react/svelte · admin write flows (create→read→delete token, update component, non-admin cannot write settings) |
| `smoke.spec.ts` | Browser checks of the public site (home branding/stats, component detail, docs render, auth screens, UI login) |
| `admin.spec.ts` | Browser checks of authenticated admin surfaces |

The browser specs (`smoke.spec.ts`, `admin.spec.ts`) were skipped while every
route crashed during client mount with
`TypeError: Cannot read properties of null (reading 'ce')` — a Vue
custom-element/Teleport-path error caused by **two Vue runtimes in one client
bundle** (`@milkdown/vue@7.17.3` resolved `vue@3.5.26` while the rest of the
app used `vue@3.5.38`). The `pnpm.overrides` in `package.json` force a single
Vue 3.5.38 (see `pnpm-lock.yaml`). With that fixed, the browser suites run for
real.

## Design notes

- `webServer` boots `nuxt dev` in **SQL mode** (`POCKETBASE_URL=''`,
  `DATABASE_URL=sqlite:<temp>`, `ALLOW_REGISTRATION=true`) — no Docker or
  PocketBase needed, matching a fresh SQL install. Set `reuseExistingServer`
  off (CI) to always boot fresh; leave on to reuse a manually started server
  during development.
- Seeding goes through the real HTTP API on purpose: it exercises the same
  contract an end-user's first token import / component creation does, and it
  is idempotent (re-runs skip existing names).
- A run mutates only its own temp SQLite file.
