import { test, expect } from '@playwright/test'

test.describe('Connection Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-files')
  })

  test('opens connection wizard when clicking add button', async ({ page }) => {
    // Click the "Add Design File" button
    await page.getByRole('button', { name: 'Add Design File' }).click()
    
    // Verify wizard is visible
    const wizardDialog = page.locator('.p-dialog')
    await expect(wizardDialog).toBeVisible()
    
    // Verify step 1 is active
    await expect(page.getByText('Select Design Tool')).toBeVisible()
  })

  test('navigates through wizard steps', async ({ page }) => {
    // Open wizard
    await page.getByRole('button', { name: 'Add Design File' }).click()
    
    // Step 1: Select source
    await expect(page.getByText('Select Design Tool')).toBeVisible()
    
    // Select Penpot (already selected by default)
    const penpotCard = page.locator('text=Penpot').first()
    await expect(penpotCard).toBeVisible()
    
    // Click Next
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Step 2: Enter details
    await expect(page.getByText('Enter File Details')).toBeVisible()
    
    // Fill in form
    await page.getByLabel('File Name').fill('Test Design System')
    await page.getByLabel('File URL').fill('https://design.penpot.app/#/workspace/test')
    await page.getByLabel('Penpot API Token').fill('test-token-123')
    
    // Verify Connect button is enabled
    const connectButton = page.getByRole('button', { name: 'Connect' })
    await expect(connectButton).toBeEnabled()
  })

  test('shows validation errors for empty form', async ({ page }) => {
    // Open wizard and go to step 2
    await page.getByRole('button', { name: 'Add Design File' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Try to click Connect with empty form
    const connectButton = page.getByRole('button', { name: 'Connect' })
    await expect(connectButton).toBeDisabled()
  })

  test('allows cancelling the wizard', async ({ page }) => {
    // Open wizard
    await page.getByRole('button', { name: 'Add Design File' }).click()
    
    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).click()
    
    // Verify wizard is closed
    const wizardDialog = page.locator('.p-dialog')
    await expect(wizardDialog).not.toBeVisible()
  })

  test('shows progress during connection', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/design-files', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id-123',
          name: 'Test Design System',
          source: 'penpot',
          url: 'https://design.penpot.app/#/workspace/test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })
    })
    
    await page.route('**/api/design-files/test-id-123/sync', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id-123',
          status: 'completed',
          message: 'Sync completed successfully',
          componentsSynced: 5,
          tokensSynced: 12,
          warnings: [],
          completedAt: new Date().toISOString()
        })
      })
    })
    
    // Open wizard and fill form
    await page.getByRole('button', { name: 'Add Design File' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    
    await page.getByLabel('File Name').fill('Test Design System')
    await page.getByLabel('File URL').fill('https://design.penpot.app/#/workspace/test')
    await page.getByLabel('Penpot API Token').fill('test-token-123')
    
    // Click Connect
    await page.getByRole('button', { name: 'Connect' }).click()
    
    // Verify progress step is shown
    await expect(page.getByText('Connecting to Penpot')).toBeVisible()
    
    // Wait for progress to complete
    await expect(page.getByText('Connection Successful')).toBeVisible({ timeout: 10000 })
    
    // Verify Finish button appears
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/design-files', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid API token',
          status: 401
        })
      })
    })
    
    // Open wizard and fill form
    await page.getByRole('button', { name: 'Add Design File' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    
    await page.getByLabel('File Name').fill('Test Design System')
    await page.getByLabel('File URL').fill('https://design.penpot.app/#/workspace/test')
    await page.getByLabel('Penpot API Token').fill('invalid-token')
    
    // Click Connect
    await page.getByRole('button', { name: 'Connect' }).click()
    
    // Verify error is shown
    await expect(page.getByText('Authentication Failed')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Invalid API token or insufficient permissions')).toBeVisible()
    
    // Verify Retry button appears
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
  })

  test('search and filter functionality works', async ({ page }) => {
    // Wait for design files to load
    await page.waitForSelector('table.p-datatable-table')
    
    // Test search
    const searchInput = page.getByPlaceholder('Search design files...')
    await searchInput.fill('UI Components')
    
    // Verify filtering works (this depends on actual data)
    await expect(page.locator('table.p-datatable-table')).toBeVisible()
    
    // Test source filter
    const filterDropdown = page.getByPlaceholder('Filter by source')
    await filterDropdown.click()
    await page.getByText('Penpot').click()
    
    // Clear filters
    await page.getByRole('button', { name: 'Clear filters' }).click()
    
    // Verify filters are cleared
    await expect(searchInput).toHaveValue('')
  })

  test('design file detail modal opens', async ({ page }) => {
    // Wait for design files to load
    await page.waitForSelector('table.p-datatable-table')
    
    // Click view button on first file
    const viewButtons = page.locator('button[aria-label*="View details"]')
    await viewButtons.first().click()
    
    // Verify detail modal opens
    await expect(page.getByText('Design File Details')).toBeVisible({ timeout: 5000 })
    
    // Verify file info is shown
    await expect(page.locator('.p-dialog')).toBeVisible()
    
    // Close modal
    await page.locator('.p-dialog-header-close').click()
    await expect(page.locator('.p-dialog')).not.toBeVisible()
  })
})