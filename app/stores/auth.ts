/**
 * Authentication Store (Pinia)
 * Manages user authentication state with JWT tokens
 */

import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  avatarUrl?: string
  isActive: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => state.user?.role === 'admin' || state.user?.role === 'editor',
    currentUser: (state) => state.user
  },

  actions: {
    /**
     * Initialize from localStorage
     */
    initialize() {
      if (import.meta.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userJson = localStorage.getItem('user')

        if (accessToken && userJson) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.user = JSON.parse(userJson)
        }
      }
    },

    /**
     * Save auth data
     */
    saveAuth(accessToken: string, refreshToken: string, user: User) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.user = user

      if (import.meta.client) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    /**
     * Clear auth data
     */
    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.error = null

      if (import.meta.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    /**
     * Register new user
     */
    async register(email: string, password: string, name: string) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useFetch('/api/auth/register', {
          method: 'POST',
          body: { email, password, name }
        })

        if (error.value) {
          throw new Error((error.value.data as any)?.error?.message || 'Registration failed')
        }

        if (data.value?.success && data.value.data) {
          this.saveAuth(
            data.value.data.tokens.accessToken,
            data.value.data.tokens.refreshToken,
            data.value.data.user
          )
          return true
        }

        throw new Error('Registration failed')
      } catch (err: any) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Login user
     */
    async login(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useFetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        if (error.value) {
          throw new Error((error.value.data as any)?.error?.message || 'Invalid credentials')
        }

        if (data.value?.success && data.value.data) {
          this.saveAuth(
            data.value.data.tokens.accessToken,
            data.value.data.tokens.refreshToken,
            data.value.data.user
          )
          return true
        }

        throw new Error('Login failed')
      } catch (err: any) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout user
     */
    logout() {
      this.clearAuth()
      navigateTo('/login')
    },

    /**
     * Check authentication on app load
     */
    checkAuth() {
      this.initialize()
    }
  }
})