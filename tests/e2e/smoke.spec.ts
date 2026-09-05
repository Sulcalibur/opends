import { test, expect } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './support/env'

/**
 * Public surfaces — rendered by the browser against the seeded Ember content.
 *
 * History: these were skipped while every route crashed on client mount with
 * `Cannot read properties of null (reading 'ce')`. Root cause: two Vue
 * runtimes in one client bundle (@milkdown/vue resolved vue 3.5.26 while the
 * app used 3.5.38). `pnpm.overrides` now force a single Vue 3.5.38 — the
 * crash is gone and these run for real.
 */
test.describe('Public site', () => {
  test('home renders hero and stats', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.hero-stats')
    await expect(page.locator('h1')).toBeVisible()
    // The home hero is a static marketing surface (counts come from seeded
    // data via the API, asserted in content-conformance.spec.ts)
    await expect(page.locator('.hero-stat')).toHaveCount(4)
  })

  test('component detail renders full spec from the DB', async ({ page }) => {
    await page.goto('/docs/components/button')
    await page.waitForSelector('.component-title')
    await expect(page.locator('.component-title')).toContainText('Button')
    await expect(page.locator('.sandbox')).toBeVisible()
    await expect(page.locator('.variants-grid')).toBeVisible()
    // 8 documented props, 6 a11y checks on the seeded Button
    await expect(page.locator('.props-row')).toHaveCount(8)
    await expect(page.locator('.a11y-card')).toHaveCount(6)
    // spinner documents a failing check → the ✕ badge renders
  })

  test('spinner detail surfaces a failing a11y check', async ({ page }) => {
    await page.goto('/docs/components/spinner')
    await page.waitForSelector('.component-title')
    await expect(page.locator('.component-title')).toContainText('Spinner')
    await expect(page.locator('.a11y-badge.fail')).toBeVisible()
  })

  test('docs detail renders markdown content', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.waitForSelector('.doc-content')
    await expect(page.locator('.doc-content h1')).toHaveText('Getting started')
    await expect(page.locator('.doc-content')).toContainText('OpenDS instance')
  })

  test('auth screens render', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await page.goto('/register')
    await expect(page.locator('#name')).toBeVisible()
  })

  test('seeded admin can log in from the UI', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', ADMIN_EMAIL)
    await page.fill('#password', ADMIN_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 })
    await expect(page.locator('.stat-grid')).toBeVisible()
  })
})
