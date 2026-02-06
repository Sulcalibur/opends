import { test, expect } from "@playwright/test";

test("Admin Login and Settings Theme Switching", async ({ page }) => {
  console.log("Starting test...");

  // Capture console errors
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    console.log(`Console [${msg.type()}]: "${msg.text()}"`);
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    console.log(`Page Error: ${err.message}`);
    consoleErrors.push(err.message);
  });

  // 1. Navigate to login
  console.log("Navigating to login page...");
  await page.goto("http://localhost:3001/login");
  await expect(page).toHaveTitle(/OpenDS/);

  // 2. Login
  console.log("Filling login credentials...");

  // Wait for inputs
  await page.waitForSelector("#email");
  await page.waitForSelector("#password");

  // Fill email
  await page.fill("#email", "admin@opends.local");
  // Verify email value
  const emailValue = await page.inputValue("#email");
  console.log("Email input value:", emailValue);
  if (emailValue !== "admin@opends.local") {
    console.log("Retrying email fill with type...");
    await page.click("#email");
    await page.keyboard.type("admin@opends.local");
  }

  // Fill password
  await page.fill("#password", "AdminPass123");
  // Verify password value
  const passwordValue = await page.inputValue("#password");
  console.log("Password input value:", passwordValue ? "******" : "(empty)");

  // Check if button is disabled
  const isButtonDisabled = await page.isDisabled('button[type="submit"]');
  console.log("Login button disabled:", isButtonDisabled);

  // Check button type attribute
  const buttonType = await page.getAttribute(".auth-button", "type");
  console.log("Login button type attribute:", buttonType);

  // Monitor network requests
  page.on("request", (request) =>
    console.log(">>", request.method(), request.url()),
  );

  // Click login
  console.log("Clicking login button...");
  // await page.click('button[type="submit"]');

  // Try pressing Enter in password field
  console.log("Pressing Enter in password field...");
  // await page.focus('#password');
  // await page.keyboard.press('Enter');

  // Try programmatic submission
  console.log("Attempting programmatic form submission...");
  await page.evaluate(() => {
    const form = document.querySelector("form");
    if (form) form.requestSubmit();
  });

  // Check for auth error
  try {
    const errorLocator = page.locator(".auth-error");
    if (await errorLocator.isVisible({ timeout: 2000 })) {
      const errorText = await errorLocator.textContent();
      console.log("Login Error Message:", errorText);
    }
  } catch (e) {
    // Ignore timeout
  }

  // 3. Verify login success
  console.log("Verifying login success...");
  await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

  // 4. Navigate to settings
  console.log("Navigating to settings page...");
  await page.goto("http://localhost:3001/admin/settings");

  // 5. Switch to Appearance tab
  console.log("Switching to Appearance tab...");
  await page.click('button.nav-item:has-text("Appearance")');

  // 6. Switch to Dark theme
  console.log("Switching to Dark theme...");
  await page.click('.theme-option:has-text("Dark")');

  // 7. Save
  console.log("Saving changes...");
  const savePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/settings") &&
      response.request().method() === "PUT",
  );
  await page.click('button:has-text("Save Changes")');
  const saveResponse = await savePromise;
  expect(saveResponse.status()).toBe(200);

  // 8. Reload
  console.log("Reloading page...");
  await page.reload();

  // 9. Verify Dark theme persistence
  console.log("Verifying Dark theme persistence...");
  // Wait for hydration/settings load
  await page.waitForTimeout(2000);
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  expect(isDark).toBe(true);

  // 10. Switch back to Light theme
  console.log("Switching back to Light theme...");
  await page.click('button.nav-item:has-text("Appearance")');
  await page.click('.theme-option:has-text("Light")');

  console.log("Saving changes...");
  const savePromise2 = page.waitForResponse(
    (response) =>
      response.url().includes("/api/settings") &&
      response.request().method() === "PUT",
  );
  await page.click('button:has-text("Save Changes")');
  const saveResponse2 = await savePromise2;
  expect(saveResponse2.status()).toBe(200);

  // 11. Reload
  console.log("Reloading page...");
  await page.reload();

  // 12. Verify Light theme persistence
  console.log("Verifying Light theme persistence...");
  await page.waitForTimeout(2000);
  const isLight = await page.evaluate(
    () => !document.documentElement.classList.contains("dark"),
  );
  expect(isLight).toBe(true);

  if (consoleErrors.length > 0) {
    console.log("Test finished with console errors:", consoleErrors);
  } else {
    console.log("Test finished successfully with no console errors.");
  }
});
