import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient, type DesignFile } from '../api/client'

export interface SyncProgress {
  fileId: string
  status: 'pending' | 'connecting' | 'fetching' | 'syncing' | 'completed' | 'failed'
  progress: number
  message: string
  details: string | undefined
  startedAt: Date
  completedAt: Date | undefined
}

export const useDesignFilesStore = defineStore('design-files', () => {
  const files = ref<DesignFile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const syncingFiles = ref<Set<string>>(new Set())
  const syncProgress = ref<Map<string, SyncProgress>>(new Map())

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
      
      // Initialize sync progress
      const progress: SyncProgress = {
        fileId: id,
        status: 'pending',
        progress: 0,
        message: 'Starting sync...',
        details: undefined,
        startedAt: new Date(),
        completedAt: undefined
      }
      syncProgress.value.set(id, progress)
      
      // Update progress: Connecting
      updateSyncProgress(id, {
        status: 'connecting',
        progress: 20,
        message: 'Connecting to design tool...'
      })
      
      // Update progress: Fetching
      updateSyncProgress(id, {
        status: 'fetching',
        progress: 40,
        message: 'Fetching design file...'
      })
      
      const result = await apiClient.syncDesignFile(id)
      
      // Update progress: Syncing
      updateSyncProgress(id, {
        status: 'syncing',
        progress: 60,
        message: 'Syncing components and tokens...',
        details: result.componentsSynced ? `Components: ${result.componentsSynced}` : undefined
      })
      
      // Update progress: Completed
      updateSyncProgress(id, {
        status: 'completed',
        progress: 100,
        message: 'Sync completed successfully',
        details: result.componentsSynced ? `${result.componentsSynced} components synced` : 'Sync completed',
        completedAt: new Date()
      })
      
      // Refresh the file list
      await fetchFiles()
      
      // Clear progress after 3 seconds
      setTimeout(() => {
        syncProgress.value.delete(id)
      }, 3000)
      
      return result
    } catch (err: any) {
      // Update progress: Failed
      updateSyncProgress(id, {
        status: 'failed',
        progress: 0,
        message: 'Sync failed',
        details: err.message || 'Unknown error occurred',
        completedAt: new Date()
      })
      
      error.value = err.message || 'Failed to sync design file'
      throw err
    } finally {
      syncingFiles.value.delete(id)
    }
  }
  
  function updateSyncProgress(id: string, updates: Partial<SyncProgress>) {
    const current = syncProgress.value.get(id)
    if (current) {
      syncProgress.value.set(id, { ...current, ...updates })
    }
  }
  
  function getSyncProgress(id: string): SyncProgress | undefined {
    return syncProgress.value.get(id)
  }
  
  function clearSyncProgress(id: string) {
    syncProgress.value.delete(id)
  }

  async function getFile(id: string) {
    try {
      return await apiClient.getDesignFile(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to get design file'
      throw err
    }
  }

  async function createFile(data: { name: string; source: 'penpot' | 'figma'; url: string; apiToken?: string }) {
    try {
      loading.value = true
      error.value = null
      
      const newFile = await apiClient.createDesignFile(data)
      files.value.push(newFile)
      
      return newFile
    } catch (err: any) {
      error.value = err.message || 'Failed to create design file'
      throw err
    } finally {
      loading.value = false
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
    syncProgress,
    fetchFiles,
    syncFile,
    getFile,
    createFile,
    isSyncing,
    getSyncProgress,
    clearSyncProgress,
    clearError,
  }
})