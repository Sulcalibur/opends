/**
 * Auth Middleware
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Initialize auth state
    if (process.client) {
        authStore.initialize()
    }

    // If user is not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
        return navigateTo('/login')
    }
})
