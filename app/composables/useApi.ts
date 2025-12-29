/**
 * API Composable
 * Provides authenticated API calls with automatic token injection
 */

export const useApi = () => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    const apiBase = config.public.apiBase || '/api'

    /**
     * Make authenticated API request
     */
    async function request<T = any>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers = new Headers(options.headers)

        // Add auth token if available
        if (authStore.accessToken) {
            headers.set('Authorization', `Bearer ${authStore.accessToken}`)
        }

        headers.set('Content-Type', 'application/json')

        try {
            const response = await $fetch<any>(`${apiBase}${url}`, {
                ...options,
                headers: Object.fromEntries(headers.entries())
            })

            return response.data as T
        } catch (error: any) {
            // Handle 401 - token expired
            if (error.statusCode === 401) {
                authStore.logout()
                navigateTo('/login')
            }

            throw error
        }
    }

    return {
        // Generic request
        request,

        // Convenience methods
        get: <T = any>(url: string) => request<T>(url, { method: 'GET' }),

        post: <T = any>(url: string, data?: any) =>
            request<T>(url, {
                method: 'POST',
                body: JSON.stringify(data)
            }),

        put: <T = any>(url: string, data?: any) =>
            request<T>(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            }),

        delete: <T = any>(url: string) =>
            request<T>(url, { method: 'DELETE' })
    }
}
