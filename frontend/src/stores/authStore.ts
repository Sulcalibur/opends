import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    providers: [] as Array<{ id: string; name: string; connectUrl: string }>,
    status: {} as Record<string, { connected: boolean; error?: string }>
  }),
  actions: {
    async loadProviders() {
      const { data } = await axios.get('/api/auth/providers')
      this.providers = data.providers
    },
    async connect(providerId: string) {
      window.location.href = `/api/auth/${providerId}/connect`
    }
  }
})

