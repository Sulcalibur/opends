import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function gotoAndWait(page, path: string, selector: string, timeout = 15000) {
  await page.goto(`${BASE}${path}`)
  await page.waitForSelector(selector, { timeout })
}

async function loginAsAdmin(page) {
  await page.goto(`${BASE}/login`)
  await page.waitForSelector('#email')
  await page.fill('#email', 'admin@opends.local')
  await page.fill('#password', 'admin')
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
  await page.waitForSelector('.stat-grid')
}

test.describe('Public Pages', () => {
  test('home page renders', async ({ page }) => {
    await gotoAndWait(page, '/', '.hero-stats')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('login page renders', async ({ page }) => {
    await gotoAndWait(page, '/login', '#email')
    await expect(page.locator('h1')).toContainText('Welcome back')
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('register page renders', async ({ page }) => {
    await gotoAndWait(page, '/register', '#name')
    await expect(page.locator('h1')).toContainText('Create your account')
  })

  test('component detail page renders', async ({ page }) => {
    await gotoAndWait(page, '/docs/components/button', '.component-title')
    await expect(page.locator('.sandbox')).toBeVisible()
    await expect(page.locator('.variants-grid')).toBeVisible()
    await expect(page.locator('.props-table')).toBeVisible()
    await expect(page.locator('.a11y-grid')).toBeVisible()
  })
})

test.describe('Auth Flow', () => {
  test('can log in with valid credentials', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.locator('.stat-card').first()).toBeVisible()
  })
})

test.describe('Admin Pages (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('dashboard shows stats and activity', async ({ page }) => {
    await expect(page.locator('.stat-card').first()).toBeVisible()
    await expect(page.locator('.card-title').first()).toBeVisible()
  })

  test('token editor renders', async ({ page }) => {
    await gotoAndWait(page, '/admin/tokens', '.tokens-tree')
    await expect(page.locator('.tokens-main')).toBeVisible()
  })

  test('component editor renders', async ({ page }) => {
    await gotoAndWait(page, '/admin/components/button', '.editor-layout', 30000)
    await expect(page.locator('.editor-left')).toBeVisible()
    await expect(page.locator('.editor-center')).toBeVisible()
  })

  test('docs editor renders', async ({ page }) => {
    await gotoAndWait(page, '/admin/docs/writing-for-buttons', '.editor-layout', 30000)
    await expect(page.locator('.editor-toolbar')).toBeVisible()
  })

  test('users page shows table', async ({ page }) => {
    await gotoAndWait(page, '/admin/users', '.users-table')
    await expect(page.locator('.user-cell-name').first()).toBeVisible()
  })

  test('settings page renders form', async ({ page }) => {
    await gotoAndWait(page, '/admin/settings', '.settings-card')
    await expect(page.locator('.settings-heading').first()).toBeVisible()
  })

  test('visibility page renders matrix', async ({ page }) => {
    await gotoAndWait(page, '/admin/visibility', '.vis-table')
    await expect(page.locator('.vis-page-name').first()).toBeVisible()
  })
})
