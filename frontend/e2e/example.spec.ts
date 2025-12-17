import { test, expect } from '@playwright/test'

test('homepage renders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vite|OpenDS/i)
  const app = page.locator('#app')
  await expect(app).toBeVisible()
})

