<template>
  <div class="design-files-view p-4">
    <div class="view-header mb-6">
      <div class="flex align-items-center justify-content-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Design Files</h1>
          <p class="text-color-secondary">
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

    <div class="view-content">
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-file text-primary"></i>
            <span>Connected Design Files</span>
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="text-center py-4">
            <ProgressSpinner />
          </div>
          <div v-else-if="designFiles.length === 0" class="text-center py-4 text-color-secondary">
            <i class="pi pi-inbox text-3xl mb-3"></i>
            <p class="mb-2">No design files connected</p>
            <p class="text-sm mb-4">Connect your first design file to get started</p>
            <Button 
              label="Add Design File" 
              icon="pi pi-plus" 
              severity="primary"
              @click="showAddDialog = true"
            />
          </div>
          <div v-else>
            <DataTable :value="designFiles" class="p-datatable-sm">
              <Column field="name" header="Name" sortable>
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
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
                       :loading="designFilesStore.isSyncing(data.id)"
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
      <div class="flex flex-column gap-4">
        <div>
          <label class="block mb-2">
            Design Tool
          </label>
          <div class="flex gap-3">
            <div 
              :class="[
                'p-3 border-round cursor-pointer transition-all flex-1',
                selectedSource === 'penpot' 
                  ? 'border-primary bg-primary-50' 
                  : 'surface-border border-1 hover:surface-hover'
              ]"
              @click="selectedSource = 'penpot'"
            >
              <div class="flex align-items-center gap-2">
                <div class="w-8 h-8 bg-purple-50 border-round flex align-items-center justify-content-center">
                  <i class="pi pi-palette text-purple-500"></i>
                </div>
                <div>
                  <div class="font-medium">Penpot</div>
                  <div class="text-sm text-color-secondary">Open source design tool</div>
                </div>
              </div>
            </div>
            <div 
              :class="[
                'p-3 border-round cursor-pointer transition-all flex-1',
                selectedSource === 'figma' 
                  ? 'border-primary bg-primary-50' 
                  : 'surface-border border-1 hover:surface-hover'
              ]"
              @click="selectedSource = 'figma'"
            >
              <div class="flex align-items-center gap-2">
                <div class="w-8 h-8 bg-blue-50 border-round flex align-items-center justify-content-center">
                  <i class="pi pi-desktop text-blue-500"></i>
                </div>
                <div>
                  <div class="font-medium">Figma</div>
                  <div class="text-sm text-color-secondary">Popular design platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label for="file-name" class="block mb-2">
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
          <label for="file-url" class="block mb-2">
            File URL or ID
          </label>
          <InputText 
            id="file-url" 
            v-model="newFileUrl" 
            :placeholder="selectedSource === 'penpot' ? 'Penpot file URL' : 'Figma file URL'"
            class="w-full"
          />
          <p class="text-sm text-color-secondary mt-2">
            {{ selectedSource === 'penpot' 
              ? 'Enter the full URL of your Penpot file' 
              : 'Enter the Figma file URL or file ID' 
            }}
          </p>
        </div>

        <div v-if="selectedSource === 'penpot'" class="field">
          <label for="api-token" class="block mb-2">
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
          <p class="text-sm text-color-secondary mt-2">
            <a 
              href="https://help.penpot.app/technical-guide/integrations/#api-token" 
              target="_blank"
              class="text-primary"
            >
              How to get your Penpot API token
            </a>
          </p>
        </div>

        <div v-if="selectedSource === 'figma'" class="field">
          <label for="figma-token" class="block mb-2">
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
          <p class="text-sm text-color-secondary mt-2">
            <a 
              href="https://www.figma.com/developers/api#access-tokens" 
              target="_blank"
              class="text-primary"
            >
              How to get your Figma access token
            </a>
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-content-end">
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
      <div class="flex flex-column gap-3">
        <div class="flex align-items-center gap-3">
           <i class="pi pi-exclamation-triangle text-2xl text-red-400"></i>
          <div>
            <p class="font-medium">Are you sure you want to delete this design file?</p>
            <p class="text-color-secondary mt-1">
              This will remove "{{ fileToDelete?.name }}" and all associated data.
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-content-end">
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

import { useDesignFilesStore } from '../stores/design-files'
import type { DesignFile } from '../api/client'

const designFilesStore = useDesignFilesStore()
const loading = computed(() => designFilesStore.loading)
const designFiles = computed(() => designFilesStore.files)
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
  return source === 'penpot' ? 'pi pi-palette text-purple-400' : 'pi pi-desktop text-blue-400'
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
    await designFilesStore.fetchFiles()
  } catch (error) {
    console.error('Failed to load design files:', error)
  }
}

async function syncDesignFile(id: string) {
  try {
    syncingFile.value = id
    await designFilesStore.syncFile(id)
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
    
    await designFilesStore.createFile({
      name: newFileName.value,
      source: selectedSource.value,
      url: newFileUrl.value,
      apiToken: apiToken.value || undefined
    })
    
    // Reset form
    newFileName.value = ''
    newFileUrl.value = ''
    apiToken.value = ''
    showAddDialog.value = false
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