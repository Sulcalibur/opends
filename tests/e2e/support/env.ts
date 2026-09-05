/**
 * Shared E2E environment — imported by playwright.config.ts, the
 * global setup/teardown, and every spec so one value set rules them all.
 */
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** The app under test. Override to reuse an already-running instance. */
export const BASE_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3111'

/** Seed credentials — the first registered user in SQL mode becomes admin. */
export const ADMIN_EMAIL = process.env.OPENDS_ADMIN_EMAIL || 'admin@opends.local'
export const ADMIN_PASSWORD = process.env.OPENDS_ADMIN_PASSWORD || 'OpenDS-Demo-1'

/** Deterministic fresh SQLite database path for this run. */
export const DB_PATH =
  process.env.E2E_DB_PATH ||
  join(tmpdir(), `opends-e2e-${process.pid}-${Date.now()}.db`)

/** Env the webServer child needs to boot in SQL mode with the run's DB. */
export const WEB_SERVER_ENV = {
  ...process.env,
  POCKETBASE_URL: '', // force SQL mode (nuxt loads .env, which sets PB otherwise)
  DATABASE_URL: `sqlite:${DB_PATH}`,
  ALLOW_REGISTRATION: 'true',
  JWT_SECRET: 'opends-e2e-secret',
}
