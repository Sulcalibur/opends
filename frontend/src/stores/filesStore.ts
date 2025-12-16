import { defineStore } from 'pinia'
import axios from 'axios'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [] as Array<any>,
    provider: 'figma' as 'figma' | 'penpot',
    loading: false,
    error: ''
  }),
  actions: {
    async list(provider: 'figma' | 'penpot') {
      this.provider = provider
      this.loading = true
      this.error = ''
      try {
        const { data } = await axios.get(`/api/files/${provider}`)
        this.files = data.files || []
      } catch (e: any) {
        this.error = e?.message || 'Failed to load files'
      } finally {
        this.loading = false
      }
    }
  }
})

