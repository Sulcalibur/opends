# End-to-End Testing Report: Admin Interface

**Date:** 2026-02-04
**Tester:** Sisyphus-Junior

## Summary

Testing of the OpenDS admin interface was halted due to a critical blocking issue in the login functionality. The login form fails to submit credentials to the API and instead reloads the page.

## Critical Issues

### 1. Login Functionality Broken

- **Severity:** Critical (Blocker)
- **Description:** Submitting the login form (via "Sign In" button or Enter key) triggers a page reload with a GET request to `/login?` instead of executing the Vue `handleLogin` method and sending a POST request to `/api/auth/login`.
- **Evidence:**
  - Playwright logs show `GET http://localhost:3001/login?` immediately after submission action.
  - No `POST` request to `/api/auth/login` is ever initiated.
  - No console errors are reported, suggesting a silent failure of event handling.
- **Root Cause Analysis:**
  - The form has `@submit.prevent="handleLogin"`.
  - The behavior indicates that `preventDefault()` is not being called, causing the browser to perform a default form submission (GET to current URL).
  - This typically indicates that Vue event listeners are not attached to the form element, possibly due to a hydration mismatch or a silent error during component setup.
  - The `UiPremiumButton` renders correctly as `type="submit"`, so the button itself is correct.

## Steps to Reproduce

1. Navigate to `http://localhost:3001/login`.
2. Enter valid credentials (e.g., `admin@opends.local` / `AdminPass123`).
3. Click "Sign In" or press Enter.
4. Observe the page reloads (URL changes to `/login?` or stays same) and no login occurs.

## Recommendations

- Investigate `app/pages/login.vue` for hydration issues.
- Verify if `useFetch` or other composables in `script setup` are causing errors that abort component initialization without logging to console.
- Check if `UiFloatingInput` or `UiPremiumButton` components are interfering with form event propagation (though unlikely as they seem standard).

## Test Artifacts

- Reproduction script available at: `tests/e2e/admin.spec.ts`
