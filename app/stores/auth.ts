/**
 * Authentication Store (Pinia) — PocketBase-backed
 *
 * With PocketBase, auth tokens are stored in an httpOnly cookie (pb_auth),
 * set by the server on login. The client doesn't manage tokens directly —
 * it just knows about the current user and checks the session via /api/auth-pb/me.
 *
 * Replaces: JWT token management in localStorage, manual saveAuth/clearAuth.
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEditor = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'editor',
  )
  const currentUser = computed(() => user.value)

  /**
   * Check if there's an active PocketBase session.
   * The pb_auth cookie is httpOnly so we can't read it from JS —
   * we ask the server to verify it via /api/auth-pb/me.
   */
  async function initialize() {
    if (initialized.value) return
    initialized.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: { id: string; email: string; name: string; role: string }
      }>('/api/auth-pb/me')

      if (response.success && response.data) {
        user.value = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as User['role'],
        }
      }
    } catch {
      // Not logged in — that's fine
      user.value = null
    }
  }

  /**
   * Login with email/password via PocketBase.
   */
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        success: boolean
        data: { token: string; user: { id: string; email: string; name: string; role: string } }
      }>('/api/auth-pb/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response.success && response.data) {
        user.value = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role as User['role'],
        }
        return true
      }

      throw new Error('Login failed')
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Register a new user via PocketBase.
   */
  async function register(email: string, password: string, name: string) {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/auth-pb/register', {
        method: 'POST',
        body: { email, password, name },
      })
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      // Extract PocketBase error message if available
      if (typeof (err as any)?.data?.statusMessage === 'string') {
        error.value = (err as any).data.statusMessage
      } else {
        error.value = msg
      }
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout — clear the httpOnly cookie via server.
   */
  async function logout() {
    try {
      await $fetch('/api/auth-pb/logout', { method: 'POST' })
    } catch {
      // Logout should always succeed — clear client state regardless
    }
    user.value = null
    await navigateTo('/login')
  }

  // Auto-initialize on store creation
  if (import.meta.client) {
    initialize()
  }

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
    isEditor,
    currentUser,
    initialize,
    login,
    register,
    logout,
  }
})
