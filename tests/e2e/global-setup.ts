/**
 * Global setup — runs once, after the webServer is up.
 *
 * Registers the first (admin) user if needed, then seeds the Ember demo
 * design system through the public API so every spec shares one
 * deterministic content baseline.
 */
import type { FullConfig } from '@playwright/test'
import { seedDemo } from '../../scripts/seed-demo.mjs'
import { ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL } from './support/env'

async function waitForServer(timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  let lastError: unknown
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`)
      if (res.ok) return
    } catch (error) {
      lastError = error
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`OpenDS server at ${BASE_URL} never became healthy: ${lastError}`)
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  await waitForServer()
  const summary = await seedDemo({
    baseUrl: BASE_URL,
    adminEmail: ADMIN_EMAIL,
    adminPassword: ADMIN_PASSWORD,
    log: true,
  })
  if (summary.components.imported === 0 && summary.components.skipped === 0) {
    throw new Error('Demo seed imported no components — cannot run content specs')
  }
}
