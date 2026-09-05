/**
 * Authentication Store (Pinia) — mode-aware
 *
 * A deployment runs in exactly one auth mode (mirroring the server seam):
 *  - PocketBase: tokens live in the httpOnly `pb_auth` cookie set by
 *    /api/auth-pb/login. The client never sees the token; it checks the
 *    session via /api/auth-pb/me.
 *  - SQL/JWT: /api/auth/login returns an access token which the client keeps
 *    in localStorage and sends as `Authorization: Bearer <token>`.
 *
 * The mode is discovered from GET /api/auth/status, which reports
 * `data.mode` from the same env the server repositories use — so the client
 * always talks to the endpoints that exist on the running server.
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

export type AuthMode = 'pocketbase' | 'sql'

const TOKEN_KEY = 'opends_access_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const mode = ref<AuthMode | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEditor = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'editor',
  )
  const currentUser = computed(() => user.value)

  /* ------------------------------------------------------------------ */
  /* Mode resolution                                                     */
  /* ------------------------------------------------------------------ */

  /** Discover the deployment's auth mode once (server-side truth). */
  async function resolveMode(): Promise<AuthMode> {
    if (mode.value) return mode.value
    try {
      const response = await $fetch<{ data?: { mode?: AuthMode } }>('/api/auth/status')
      mode.value = response.data?.mode === 'sql' ? 'sql' : 'pocketbase'
    } catch {
      mode.value = 'pocketbase' // fall back to the default self-host path
    }
    return mode.value
  }

  /** Bearer token helpers for SQL mode. */
  function getToken(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(TOKEN_KEY)
  }

  function setToken(token: string | null): void {
    if (!import.meta.client) return
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }

  /**
   * Wrapper around $fetch that adds the SQL Bearer header when running in
   * SQL mode (PocketBase mode relies on the httpOnly cookie instead).
   */
  async function authFetch<T>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
    const authMode = await resolveMode()
    const headers = { ...(options.headers as Record<string, string> | undefined) }
    if (authMode === 'sql') {
      const token = getToken()
      if (token) headers.authorization = `Bearer ${token}`
    }
    return $fetch<T>(path, { ...options, headers })
  }

  function mapUser(raw: { id: string; email: string; name: string; role: string }): User {
    return {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      role: (raw.role as User['role']) || 'viewer',
    }
  }

  /* ------------------------------------------------------------------ */
  /* Session                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Restore an active session: PocketBase asks the server about the httpOnly
   * cookie; SQL mode sends the stored Bearer token to /me. Safe to call more
   * than once. The init *promise* is cached (not just a done-flag) so a caller
   * that arrives while a previous initialize() is still in flight — e.g. route
   * middleware during a fresh page load — awaits the same in-progress check
   * instead of racing past it with a stale null user.
   */
  let initPromise: Promise<void> | null = null

  function initialize() {
    if (!initPromise) {
      initPromise = doInitialize().finally(() => { initPromise = null })
    }
    return initPromise
  }

  async function doInitialize() {
    try {
      if ((await resolveMode()) === 'pocketbase') {
        const response = await authFetch<{ success: boolean; data?: { id: string; email: string; name: string; role: string } }>('/api/auth-pb/me')
        if (response.success && response.data) user.value = mapUser(response.data)
      } else {
        const token = getToken()
        if (!token) return
        const response = await authFetch<{ success: boolean; data?: { id: string; email: string; name: string; role: string } }>('/api/auth/me')
        if (response.success && response.data) user.value = mapUser(response.data)
        else setToken(null) // stale token
      }
    } catch {
      // Not logged in — that's fine
      user.value = null
    }
  }

  /* ------------------------------------------------------------------ */
  /* Auth actions                                                        */
  /* ------------------------------------------------------------------ */

  /** Login via the mode's endpoint; returns true on success. */
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      if ((await resolveMode()) === 'pocketbase') {
        const response = await authFetch<{
          success: boolean
          data?: { token: string; user: { id: string; email: string; name: string; role: string } }
        }>('/api/auth-pb/login', { method: 'POST', body: { email, password } })
        if (response.success && response.data) {
          user.value = mapUser(response.data.user)
          return true
        }
      } else {
        const response = await authFetch<{
          success: boolean
          data?: { user: { id: string; email: string; name: string; role: string }; tokens: { accessToken: string } }
        }>('/api/auth/login', { method: 'POST', body: { email, password } })
        if (response.success && response.data?.tokens?.accessToken) {
          setToken(response.data.tokens.accessToken)
          user.value = mapUser(response.data.user)
          return true
        }
      }

      throw new Error('Login failed')
    } catch (err: unknown) {
      const statusMessage = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
      error.value = statusMessage ?? (err instanceof Error ? err.message : 'Login failed')
      return false
    } finally {
      loading.value = false
    }
  }

  /** Register a new user via the mode's endpoint. */
  async function register(email: string, password: string, name: string) {
    loading.value = true
    error.value = null

    try {
      if ((await resolveMode()) === 'pocketbase') {
        await authFetch('/api/auth-pb/register', { method: 'POST', body: { email, password, name } })
      } else {
        const response = await authFetch<{
          success: boolean
          data?: { user: { id: string; email: string; name: string; role: string }; tokens: { accessToken: string } }
        }>('/api/auth/register', { method: 'POST', body: { email, password, name } })
        // The first SQL user is created as admin — treat registration as login
        if (response.success && response.data?.tokens?.accessToken) {
          setToken(response.data.tokens.accessToken)
          user.value = mapUser(response.data.user)
        }
      }
      return true
    } catch (err: unknown) {
      const statusMessage = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
      error.value = statusMessage ?? (err instanceof Error ? err.message : 'Registration failed')
      return false
    } finally {
      loading.value = false
    }
  }

  /** Logout — clears the server session (PB) or the local token (SQL). */
  async function logout() {
    try {
      if ((await resolveMode()) === 'pocketbase') {
        await $fetch('/api/auth-pb/logout', { method: 'POST' })
      }
    } catch {
      // Logout should always succeed — clear client state regardless
    }
    setToken(null)
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
    mode,
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
