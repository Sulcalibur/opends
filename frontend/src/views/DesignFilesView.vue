<template>
  <div class="design-files-view">
    <div class="view-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Design Files</h1>
          <p class="text-surface-600 dark:text-surface-400 mt-2">
            Connect and manage your design files from Penpot or Figma
          </p>
        </div>
        <Button 
          label="Add Design File" 
          icon="pi pi-plus" 
          severity="primary"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <div class="view-content mt-8">
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-file text-primary-500"></i>
            <span>Connected Design Files</span>
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="text-center py-8">
            <ProgressSpinner />
          </div>
          <div v-else-if="designFiles.length === 0" class="text-center py-8 text-surface-500 dark:text-surface-400">
            <i class="pi pi-inbox text-4xl mb-4"></i>
            <p class="text-lg mb-2">No design files connected</p>
            <p class="text-sm mb-6">Connect your first design file to get started</p>
            <Button 
              label="Add Design File" 
              icon="pi pi-plus" 
              severity="primary"
              @click="showAddDialog = true"
            />
          </div>
          <div v-else class="space-y-4">
            <DataTable :value="designFiles" class="p-datatable-sm">
              <Column field="name" header="Name" sortable>
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <i :class="getSourceIcon(data.source)" class="text-xl"></i>
                    <span>{{ data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="source" header="Source" sortable>
                <template #body="{ data }">
                  <Tag :value="data.source" :severity="getSourceSeverity(data.source)" />
                </template>
              </Column>
              <Column field="createdAt" header="Added" sortable>
                <template #body="{ data }">
                  {{ formatDate(data.createdAt) }}
                </template>
              </Column>
              <Column field="updatedAt" header="Last Sync" sortable>
                <template #body="{ data }">
                  {{ formatDate(data.updatedAt) }}
                </template>
              </Column>
              <Column header="Actions">
                <template #body="{ data }">
                  <div class="flex gap-2">
                    <Button 
                      icon="pi pi-sync" 
                      severity="secondary" 
                      size="small"
                      :loading="syncingFile === data.id"
                      @click="syncDesignFile(data.id)"
                      v-tooltip="'Sync from source'"
                    />
                    <Button 
                      icon="pi pi-eye" 
                      severity="secondary" 
                      size="small"
                      @click="viewDesignFile(data.id)"
                      v-tooltip="'View details'"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      severity="danger" 
                      size="small"
                      @click="confirmDelete(data)"
                      v-tooltip="'Remove file'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </Card>
    </div>

    <!-- Add Design File Dialog -->
    <Dialog 
      v-model:visible="showAddDialog" 
      modal 
      header="Add Design File"
      :style="{ width: '500px' }"
    >
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Design Tool
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div 
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all',
                selectedSource === 'penpot' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
              ]"
              @click="selectedSource = 'penpot'"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i class="pi pi-palette text-purple-600 dark:text-purple-400"></i>
                </div>
                <div>
                  <div class="font-medium">Penpot</div>
                  <div class="text-sm text-surface-500 dark:text-surface-400">Open source design tool</div>
                </div>
              </div>
            </div>
            <div 
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all',
                selectedSource === 'figma' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
              ]"
              @click="selectedSource = 'figma'"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i class="pi pi-desktop text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <div class="font-medium">Figma</div>
                  <div class="text-sm text-surface-500 dark:text-surface-400">Popular design platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label for="file-name" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            File Name
          </label>
          <InputText 
            id="file-name" 
            v-model="newFileName" 
            placeholder="e.g., Design System Components"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="file-url" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            File URL or ID
          </label>
          <InputText 
            id="file-url" 
            v-model="newFileUrl" 
            :placeholder="selectedSource === 'penpot' ? 'Penpot file URL' : 'Figma file URL'"
            class="w-full"
          />
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-2">
            {{ selectedSource === 'penpot' 
              ? 'Enter the full URL of your Penpot file' 
              : 'Enter the Figma file URL or file ID' 
            }}
          </p>
        </div>

        <div v-if="selectedSource === 'penpot'" class="field">
          <label for="api-token" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Penpot API Token
          </label>
          <Password 
            id="api-token" 
            v-model="apiToken" 
            :feedback="false" 
            toggleMask
            placeholder="Enter your API token"
            class="w-full"
          />
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-2">
            <a 
              href="https://help.penpot.app/technical-guide/integrations/#api-token" 
              target="_blank"
              class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              How to get your Penpot API token
            </a>
          </p>
        </div>

        <div v-if="selectedSource === 'figma'" class="field">
          <label for="figma-token" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Figma Personal Access Token
          </label>
          <Password 
            id="figma-token" 
            v-model="apiToken" 
            :feedback="false" 
            toggleMask
            placeholder="Enter your Figma token"
            class="w-full"
          />
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-2">
            <a 
              href="https://www.figma.com/developers/api#access-tokens" 
              target="_blank"
              class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              How to get your Figma access token
            </a>
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="showAddDialog = false"
          />
          <Button 
            label="Connect File" 
            severity="primary" 
            :disabled="!canConnectFile"
            :loading="connectingFile"
            @click="connectDesignFile"
          />
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      modal 
      header="Confirm Delete"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
          <div>
            <p class="font-medium">Are you sure you want to delete this design file?</p>
            <p class="text-surface-600 dark:text-surface-400 mt-1">
              This will remove "{{ fileToDelete?.name }}" and all associated data.
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="showDeleteDialog = false"
          />
          <Button 
            label="Delete" 
            severity="danger" 
            :loading="deletingFile"
            @click="deleteDesignFile"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

import { apiClient, type DesignFile } from '../api/client'

const loading = ref(true)
const designFiles = ref<DesignFile[]>([])
const syncingFile = ref<string | null>(null)

const showAddDialog = ref(false)
const selectedSource = ref<'penpot' | 'figma'>('penpot')
const newFileName = ref('')
const newFileUrl = ref('')
const apiToken = ref('')
const connectingFile = ref(false)

const showDeleteDialog = ref(false)
const fileToDelete = ref<DesignFile | null>(null)
const deletingFile = ref(false)

const canConnectFile = computed(() => {
  return newFileName.value.trim() && newFileUrl.value.trim() && apiToken.value.trim()
})

function getSourceIcon(source: 'penpot' | 'figma') {
  return source === 'penpot' ? 'pi pi-palette text-purple-500' : 'pi pi-desktop text-blue-500'
}

function getSourceSeverity(source: 'penpot' | 'figma') {
  return source === 'penpot' ? 'info' : 'success'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

async function loadDesignFiles() {
  try {
    loading.value = true
    const response = await apiClient.listDesignFiles()
    designFiles.value = response.files
  } catch (error) {
    console.error('Failed to load design files:', error)
  } finally {
    loading.value = false
  }
}

async function syncDesignFile(id: string) {
  try {
    syncingFile.value = id
    await apiClient.syncDesignFile(id)
    await loadDesignFiles() // Refresh the list
  } catch (error) {
    console.error('Failed to sync design file:', error)
  } finally {
    syncingFile.value = null
  }
}

function viewDesignFile(id: string) {
  // TODO: Implement view details
  console.log('View design file:', id)
}

function confirmDelete(file: DesignFile) {
  fileToDelete.value = file
  showDeleteDialog.value = true
}

async function deleteDesignFile() {
  if (!fileToDelete.value) return
  
  try {
    deletingFile.value = true
    // TODO: Implement delete endpoint
    console.log('Delete design file:', fileToDelete.value.id)
    await loadDesignFiles() // Refresh the list
    showDeleteDialog.value = false
    fileToDelete.value = null
  } catch (error) {
    console.error('Failed to delete design file:', error)
  } finally {
    deletingFile.value = false
  }
}

async function connectDesignFile() {
  if (!canConnectFile.value) return
  
  try {
    connectingFile.value = true
    // TODO: Implement connect endpoint
    console.log('Connect design file:', {
      name: newFileName.value,
      source: selectedSource.value,
      url: newFileUrl.value,
      token: apiToken.value
    })
    
    // Reset form
    newFileName.value = ''
    newFileUrl.value = ''
    apiToken.value = ''
    showAddDialog.value = false
    
    // Refresh list
    await loadDesignFiles()
  } catch (error) {
    console.error('Failed to connect design file:', error)
  } finally {
    connectingFile.value = false
  }
}

onMounted(() => {
  loadDesignFiles()
})
</script>

<style scoped>
.design-files-view {
  @apply p-6;
}

.view-header {
  @apply mb-8;
}
</style>