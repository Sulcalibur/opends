/**
 * Auth Middleware — PocketBase-backed
 *
 * On client-side navigation, checks the PocketBase session
 * via the auth store's /api/auth-pb/me call. Redirects to
 * /login if no valid session exists.
 *
 * On SSR, defers to client-side hydration since the pb_auth
 * cookie is httpOnly and not readable from JS on the server.
 */
export default defineNuxtRouteMiddleware(async (to, _from) => {
  // Skip during SSR — pb_auth is httpOnly, checked on client
  if (import.meta.server) return

  const authStore = useAuthStore()
  await authStore.initialize()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
