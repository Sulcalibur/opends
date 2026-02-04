/**
 * Guest Middleware
 * Redirects authenticated users away from auth pages
 */

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Initialize auth state
    if (import.meta.client) {
        authStore.initialize()
    }

    // If user is already authenticated, redirect to dashboard
    if (authStore.isAuthenticated) {
        return navigateTo('/admin')
    }
})
