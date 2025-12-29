import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  displayName: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Simple password authentication
  function login(password: string): boolean {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'
    
    try {
      // Simple password comparison for now
      // In a real app, you'd want to use a more secure approach
      // but for a self-hosted design system tool, this is acceptable
      if (password === adminPassword) {
        user.value = {
          id: 'admin',
          email: 'admin@opends.local',
          displayName: 'Administrator'
        }
        localStorage.setItem('opends_auth', 'true')
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  function logout(): void {
    user.value = null
    localStorage.removeItem('opends_auth')
  }

  // Check if user is already logged in (from localStorage)
  function checkAuth(): void {
    const isLoggedIn = localStorage.getItem('opends_auth')
    if (isLoggedIn) {
      user.value = {
        id: 'admin',
        email: 'admin@opends.local',
        displayName: 'Administrator'
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})