import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  const res = await page.goto('http://localhost:3000/'); await page.waitForSelector('.hero-stats', { timeout: 15000 })
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toBeVisible()
})
