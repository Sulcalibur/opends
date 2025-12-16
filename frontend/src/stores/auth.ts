import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '../api/client'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      const result = await apiClient.login(email, password)
      token.value = result.token
      localStorage.setItem('auth_token', result.token)
      
      await fetchUser()
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      loading.value = true
      error.value = null
      
      const result = await apiClient.register(email, password, name)
      token.value = result.token
      localStorage.setItem('auth_token', result.token)
      
      await fetchUser()
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiClient.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
    }
  }

  async function fetchUser() {
    try {
      if (!token.value) return
      
      const userData = await apiClient.getCurrentUser()
      user.value = {
        ...userData,
        createdAt: new Date().toISOString() // TODO: Get from API
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      // If token is invalid, clear it
      token.value = null
      localStorage.removeItem('auth_token')
      user.value = null
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize by fetching user if token exists
  if (token.value) {
    fetchUser()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    clearError,
  }
})