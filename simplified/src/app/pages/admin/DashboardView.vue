<template>
  <div class="admin-dashboard">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p class="text-color-secondary">
        Manage your design system configuration and content.
      </p>
    </div>

    <div class="grid">
      <!-- Stats Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-palette text-4xl text-primary mb-3"></i>
              <h3 class="text-xl font-semibold mb-1">{{ componentsCount }}</h3>
              <p class="text-color-secondary">Components</p>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-tags text-4xl text-primary mb-3"></i>
              <h3 class="text-xl font-semibold mb-1">{{ tokensCount }}</h3>
              <p class="text-color-secondary">Design Tokens</p>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-file text-4xl text-primary mb-3"></i>
              <h3 class="text-xl font-semibold mb-1">{{ docsCount }}</h3>
              <p class="text-color-secondary">Documentation Pages</p>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="h-full">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-database text-4xl text-primary mb-3"></i>
              <h3 class="text-xl font-semibold mb-1">{{ storageSize }}</h3>
              <p class="text-color-secondary">Storage Used</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 lg:col-8">
        <Card class="mb-4">
          <template #title>Quick Actions</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6 lg:col-4">
                <Button 
                  label="Add Component" 
                  icon="pi pi-plus"
                  severity="secondary"
                  class="w-full mb-2"
                  @click="addComponent"
                />
              </div>
              <div class="col-12 md:col-6 lg:col-4">
                <Button 
                  label="Edit Tokens" 
                  icon="pi pi-pencil"
                  severity="secondary"
                  class="w-full mb-2"
                  @click="editTokens"
                />
              </div>
               <div class="col-12 md:col-6 lg:col-4">
                <Button 
                  label="Backup Data" 
                  icon="pi pi-download"
                  severity="secondary"
                  class="w-full mb-2"
                  @click="backupData"
                />
              </div>
              <div class="col-12 md:col-6 lg:col-4">
                <Button 
                  label="Import from Penpot" 
                  icon="pi pi-upload"
                  severity="secondary"
                  class="w-full mb-2"
                  @click="showImportModal = true"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Recent Activity -->
        <Card>
          <template #title>Recent Activity</template>
          <template #content>
            <div v-if="recentActivity.length === 0" class="text-center py-6">
              <p class="text-color-secondary">No recent activity</p>
            </div>
            <div v-else class="space-y-4">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.id"
                class="flex items-center gap-3 p-3 border-round surface-border"
              >
                <i :class="activity.icon" class="text-lg"></i>
                <div class="flex-1">
                  <p class="font-medium mb-1">{{ activity.description }}</p>
                  <p class="text-sm text-color-secondary">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- System Status -->
      <div class="col-12 lg:col-4">
        <Card class="h-full">
          <template #title>System Status</template>
          <template #content>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span>Local Storage</span>
                <Tag value="Connected" severity="success" />
              </div>
              <div class="flex justify-between items-center">
                <span>File Storage</span>
                <Tag value="Healthy" severity="success" />
              </div>
              <div class="flex justify-between items-center">
                <span>Authentication</span>
                <Tag value="Active" severity="success" />
              </div>
              <div class="flex justify-between items-center">
                <span>Last Backup</span>
                <span class="text-color-secondary">Never</span>
              </div>
            </div>

            <Divider />

            <div class="mt-4">
              <h4 class="font-medium mb-3">Storage Locations</h4>
              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span>Design Tokens:</span>
                  <span class="text-color-secondary">design-system-data/tokens.yaml</span>
                </div>
                <div class="flex justify-between">
                  <span>Components:</span>
                  <span class="text-color-secondary">design-system-data/components/</span>
                </div>
                <div class="flex justify-between">
                  <span>Storage:</span>
                  <span class="text-color-secondary">Browser LocalStorage</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
       </div>
    </div>

    <!-- Import Modal -->
    <Dialog 
      v-model:visible="showImportModal" 
      modal 
      header="Import from Penpot"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <p class="text-color-secondary">
          Upload a JSON file exported from Penpot to import design tokens and components.
        </p>
        
        <div 
          class="border-2 border-dashed border-surface-border border-round p-6 text-center cursor-pointer hover:surface-hover transition-colors"
          :class="{ 'surface-hover': dragOver }"
          @click="triggerFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <i class="pi pi-cloud-upload text-4xl text-primary mb-3"></i>
          <p class="font-medium mb-1">Drop Penpot JSON file here</p>
          <p class="text-sm text-color-secondary">or click to browse</p>
          <input 
            ref="fileInput"
            type="file" 
            accept=".json,application/json"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <div v-if="importError" class="p-3 border-round surface-red border-1 border-red-300">
          <div class="flex items-center gap-2 text-red-600">
            <i class="pi pi-exclamation-triangle"></i>
            <span class="font-medium">Import failed</span>
          </div>
          <p class="text-sm text-red-500 mt-1">{{ importError }}</p>
        </div>

        <div v-if="importSuccess" class="p-3 border-round surface-green border-1 border-green-300">
          <div class="flex items-center gap-2 text-green-600">
            <i class="pi pi-check-circle"></i>
            <span class="font-medium">Import successful!</span>
          </div>
          <p class="text-sm text-green-500 mt-1">
            Imported {{ importedTokens }} design tokens and {{ importedComponents }} components.
          </p>
        </div>

        <div class="text-sm text-color-secondary">
          <p class="font-medium mb-1">How to export from Penpot:</p>
          <ol class="list-decimal pl-4 space-y-1">
            <li>Install the OpenDS Penpot plugin</li>
            <li>Select your design system frames</li>
            <li>Click "Export to OpenDS" in the plugin</li>
            <li>Save the JSON file</li>
            <li>Upload it here</li>
          </ol>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Cancel" 
          severity="secondary" 
          @click="showImportModal = false"
        />
        <Button 
          label="Clear All Data" 
          severity="danger" 
          class="ml-2"
          @click="confirmClearData"
        />
      </template>
    </Dialog>

    <!-- Clear Data Confirmation Dialog -->
    <Dialog 
      v-model:visible="showClearConfirm" 
      modal 
      header="Clear All Data"
      :style="{ width: '400px' }"
    >
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 border-round surface-yellow border-1 border-yellow-300">
          <i class="pi pi-exclamation-triangle text-yellow-600"></i>
          <div>
            <p class="font-medium text-yellow-600">Warning: This cannot be undone!</p>
            <p class="text-sm text-yellow-500 mt-1">All design tokens, components, and configuration will be permanently deleted.</p>
          </div>
        </div>
        <p>Are you sure you want to clear all data?</p>
      </div>

      <template #footer>
        <Button 
          label="Cancel" 
          severity="secondary" 
          @click="showClearConfirm = false"
        />
        <Button 
          label="Clear All Data" 
          severity="danger" 
          class="ml-2"
          @click="clearAllData"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'
import designSystemStorage from '@/design-system/storage'

const router = useRouter()

// Stats
const componentsCount = ref(0)
const tokensCount = ref(0)
const docsCount = ref(0)
const storageSize = ref('0 KB')

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    icon: 'pi pi-plus',
    description: 'Added Button component',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: 'pi pi-pencil',
    description: 'Updated color tokens',
    time: '1 day ago'
  }
])

// Import modal state
const showImportModal = ref(false)
const showClearConfirm = ref(false)
const dragOver = ref(false)
const importError = ref('')
const importSuccess = ref(false)
const importedTokens = ref(0)
const importedComponents = ref(0)
const fileInput = ref<HTMLInputElement>()

// Load stats on mount
onMounted(() => {
  loadStats()
})

const loadStats = () => {
  // Get component count
  const components = designSystemStorage.getComponents()
  componentsCount.value = components.length

  // Get token count
  const tokens = designSystemStorage.getTokens()
  tokensCount.value = tokens.length

  // Get docs count (placeholder)
  docsCount.value = 3

  // Calculate storage size (placeholder)
  storageSize.value = '1.2 MB'
}

// Actions
const addComponent = () => {
  // Navigate to component editor (to be implemented)
  console.log('Add component clicked')
}

const editTokens = () => {
  router.push('/tokens')
}

const backupData = () => {
  try {
    const backupData = designSystemStorage.exportToJSON()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `opends-backup-${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('Backup created and downloaded')
    
    // Add to recent activity
    recentActivity.value.unshift({
      id: Date.now(),
      icon: 'pi pi-download',
      description: 'Created system backup',
      time: 'Just now'
    })
  } catch (error) {
    console.error('Backup failed:', error)
  }
}

// Import modal methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  dragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileUpload(files[0])
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    handleFileUpload(input.files[0])
  }
}

const handleFileUpload = (file: File) => {
  importError.value = ''
  importSuccess.value = false
  
  if (!file.name.endsWith('.json')) {
    importError.value = 'Please upload a JSON file'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content)
      
      // Check if it's a Penpot export
      if (data.source === 'penpot' || data.colors || data.components) {
        const result = designSystemStorage.importFromPenpot(data)
        importedTokens.value = result.tokens
        importedComponents.value = result.components
        importSuccess.value = true
        
        // Update stats
        loadStats()
        
        // Add to recent activity
        recentActivity.value.unshift({
          id: Date.now(),
          icon: 'pi pi-upload',
          description: `Imported ${result.tokens} tokens and ${result.components} components from Penpot`,
          time: 'Just now'
        })
      } else {
        // Try generic JSON import
        const success = designSystemStorage.importFromJSON(content)
        if (success) {
          importSuccess.value = true
          importedTokens.value = designSystemStorage.getTokens().length
          importedComponents.value = designSystemStorage.getComponents().length
          
          // Update stats
          loadStats()
          
          // Add to recent activity
          recentActivity.value.unshift({
            id: Date.now(),
            icon: 'pi pi-upload',
            description: 'Imported data from JSON file',
            time: 'Just now'
          })
        } else {
          importError.value = 'Invalid JSON format'
        }
      }
    } catch (error) {
      importError.value = 'Failed to parse JSON file'
      console.error('Import error:', error)
    }
  }
  
  reader.onerror = () => {
    importError.value = 'Failed to read file'
  }
  
  reader.readAsText(file)
}

const confirmClearData = () => {
  showClearConfirm.value = true
}

const clearAllData = () => {
  designSystemStorage.clearAll()
  showClearConfirm.value = false
  showImportModal.value = false
  
  // Update stats
  loadStats()
  
  // Add to recent activity
  recentActivity.value.unshift({
    id: Date.now(),
    icon: 'pi pi-trash',
    description: 'Cleared all system data',
    time: 'Just now'
  })
}
</script>

<style scoped>
.admin-dashboard {
  padding: 1rem;
}

@media (min-width: 768px) {
  .admin-dashboard {
    padding: 2rem;
  }
}

.token-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>