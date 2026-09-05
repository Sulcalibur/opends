import { defineConfig } from '@playwright/test'
import { BASE_URL, WEB_SERVER_ENV } from './tests/e2e/support/env'

/**
 * Fresh-instance E2E for OpenDS.
 *
 * The webServer boots a throwaway SQLite-mode instance (a temp DB file is
 * created per run and deleted by the global teardown). globalSetup then
 * registers the first admin and seeds the Ember demo design system through
 * the public API — so every spec runs against real, deterministic content.
 *
 * Requirements:
 *  - pnpm, and a Node version whose better-sqlite3 binding is available
 *    (LTS 20/22 — Docker uses 20). On this machine: run tests with
 *    `PATH="$HOME/.nvm/versions/node/v22.23.0/bin:$PATH" pnpm test:e2e`.
 *  - chromium: `npx playwright install chromium`
 */
export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  timeout: 60_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  workers: 1, // one shared server + shared seeded DB ⇒ serialize
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'pnpm exec nuxt dev --host 127.0.0.1 --port 3111',
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: WEB_SERVER_ENV,
  },
})
