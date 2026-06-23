/**
 * Auth Middleware
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((to, from) => {
    // Skip auth check during SSR — localStorage is not available on the server.
    // Client-side hydration will re-run the middleware and redirect if needed.
    if (import.meta.server) return

    const authStore = useAuthStore()
    authStore.initialize()

    if (!authStore.isAuthenticated) {
        return navigateTo('/login')
    }
})
