import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient, type DesignFile } from '../api/client'

export const useDesignFilesStore = defineStore('design-files', () => {
  const files = ref<DesignFile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const syncingFiles = ref<Set<string>>(new Set())

  async function fetchFiles() {
    try {
      loading.value = true
      error.value = null
      
      const response = await apiClient.listDesignFiles()
      files.value = response.files
    } catch (err: any) {
      error.value = err.message || 'Failed to load design files'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function syncFile(id: string) {
    try {
      syncingFiles.value.add(id)
      error.value = null
      
      const result = await apiClient.syncDesignFile(id)
      
      // Refresh the file list
      await fetchFiles()
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to sync design file'
      throw err
    } finally {
      syncingFiles.value.delete(id)
    }
  }

  async function getFile(id: string) {
    try {
      return await apiClient.getDesignFile(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to get design file'
      throw err
    }
  }

  function isSyncing(id: string) {
    return syncingFiles.value.has(id)
  }

  function clearError() {
    error.value = null
  }

  // Initialize by fetching files
  fetchFiles()

  return {
    files,
    loading,
    error,
    syncingFiles,
    fetchFiles,
    syncFile,
    getFile,
    isSyncing,
    clearError,
  }
})