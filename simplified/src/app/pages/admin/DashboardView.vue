<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    
    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <header class="mb-8 flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to OpenDS</h1>
            <p class="text-gray-600">Manage your design system and documentation.</p>
          </div>
          <div class="flex gap-3">
             <Button label="View Styleguide" icon="pi pi-external-link" severity="secondary" outlined size="small" />
             <Button label="Sync from Penpot" icon="pi pi-refresh" size="small" @click="showImportModal = true" />
          </div>
        </header>

        <div class="grid grid-cols-12 gap-8">
          <!-- Main Content: Styleguides/Projects -->
          <div class="col-span-12 lg:col-span-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-book text-gray-400"></i> Your Styleguides
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <!-- Active Styleguide Card -->
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer relative">
                <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                   <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                   <div class="absolute bottom-4 left-4">
                     <div class="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                       <i class="pi pi-box text-indigo-600 text-xl"></i>
                     </div>
                   </div>
                </div>
                <div class="p-5">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">Main Design System</h3>
                    <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">v1.0.0</span>
                  </div>
                  <p class="text-sm text-gray-500 mb-4 line-clamp-2">The core design system for all corporate products.</p>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex -space-x-2">
                      <div class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">SU</div>
                      <div class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">+2</div>
                    </div>
                    <span class="text-xs text-gray-400">Edited 2h ago</span>
                  </div>
                </div>
              </div>

              <!-- Create New Placeholder -->
              <div class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-100 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center h-full min-h-[240px] group">
                <div class="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i class="pi pi-plus text-gray-400 group-hover:text-indigo-600"></i>
                </div>
                <h3 class="font-medium text-gray-900 mb-1">Create new styleguide</h3>
                <p class="text-xs text-gray-500">Start a new documentation project</p>
              </div>
            </div>

            <!-- Completeness / Recommendations -->
             <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
              <h3 class="font-semibold text-gray-900 mb-4">Onboarding & Completeness</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-blue-50 rounded-md border border-blue-100">
                  <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <i class="pi pi-check"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">Import Design Tokens</h4>
                      <p class="text-xs text-blue-700">Sync your colors and typography from Penpot.</p>
                    </div>
                  </div>
                  <Button label="Sync Now" size="small" outlined severity="info" class="bg-white" @click="showImportModal = true" />
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-100 opacity-60">
                   <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <i class="pi pi-lock"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">Document Components</h4>
                      <p class="text-xs text-gray-500">Add usage guidelines to your first 5 components.</p>
                    </div>
                  </div>
                  <div class="text-xs font-medium text-gray-400">Todo</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar: Stats & Activity -->
          <div class="col-span-12 lg:col-span-4 space-y-8">
             <!-- Quick Stats -->
            <div>
               <h2 class="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
               <div class="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100">
                 <div class="p-4 flex justify-between items-center">
                   <div class="text-sm text-gray-600">Components</div>
                   <div class="font-semibold text-gray-900">{{ componentsCount }}</div>
                 </div>
                 <div class="p-4 flex justify-between items-center">
                   <div class="text-sm text-gray-600">Tokens</div>
                   <div class="font-semibold text-gray-900">{{ tokensCount }}</div>
                 </div>
                 <div class="p-4 flex justify-between items-center">
                   <div class="text-sm text-gray-600">Docs Pages</div>
                   <div class="font-semibold text-gray-900">{{ docsCount }}</div>
                 </div>
               </div>
            </div>

            <!-- Activity Feed -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Latest Activity</h2>
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                 <div class="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    <div 
                      v-for="(activity, index) in recentActivity" 
                      :key="activity.id" 
                      class="relative flex gap-3"
                    >
                      <div class="w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 absolute -left-[21px] top-1.5 z-10"></div>
                      <div>
                        <p class="text-sm text-gray-900 font-medium">{{ activity.description }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ activity.time }}</p>
                      </div>
                    </div>
                    <div v-if="recentActivity.length === 0" class="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </div>
                 </div>
                 <button class="w-full mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 text-center uppercase tracking-wide">View All History</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Import Modal (Reused) -->
    <Dialog 
      v-model:visible="showImportModal" 
      modal 
      header="Sync from Penpot"
      :style="{ width: '500px' }"
      :draggable="false"
      class="p-dialog-simple"
    >
      <div class="space-y-6 pt-2">
        <div class="bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3">
          <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
          <p class="text-sm text-blue-800">
            Upload your Penpot export file (`.json`) to sync tokens and structure.
          </p>
        </div>
        
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors"
          :class="{ 'border-indigo-500 bg-indigo-50': dragOver }"
          @click="triggerFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <i class="pi pi-cloud-upload text-3xl text-gray-400 mb-3"></i>
          <p class="font-medium text-gray-900">Click to upload or drag and drop</p>
          <p class="text-sm text-gray-500 mt-1">JSON files only</p>
          <input 
            ref="fileInput"
            type="file" 
            accept=".json,application/json"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <div v-if="importSuccess" class="flex items-center gap-2 text-green-600 text-sm font-medium">
          <i class="pi pi-check-circle"></i>
          Imported {{ importedTokens }} tokens and {{ importedComponents }} components.
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between w-full pt-4">
           <Button 
            label="Clear Data" 
            severity="danger" 
            text
            size="small"
            @click="confirmClearData"
          />
          <div class="flex gap-2">
            <Button label="Cancel" severity="secondary" @click="showImportModal = false" text />
            <Button label="Import" @click="triggerFileInput" />
          </div>
        </div>
      </template>
    </Dialog>

     <!-- Clear Data Confirmation Dialog -->
    <Dialog 
      v-model:visible="showClearConfirm" 
      modal 
      header="Clear Data"
      :style="{ width: '400px' }"
    >
       <p class="text-gray-600">Are you sure? This will remove all local data.</p>
      <template #footer>
        <Button label="Cancel" severity="secondary" text @click="showClearConfirm = false" />
        <Button label="Yes, Clear" severity="danger" @click="clearAllData" />
      </template>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import designSystemStorage from '@/design-system/storage'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'

// Logic remains largely the same, just visual layout changes
const router = useRouter()
const componentsCount = ref(0)
const tokensCount = ref(0)
const docsCount = ref(3) // Mocked for now
const storageSize = ref('0 KB')
const recentActivity = ref<any[]>([])

const showImportModal = ref(false)
const showClearConfirm = ref(false)
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const importError = ref('')
const importSuccess = ref(false)
const importedTokens = ref(0)
const importedComponents = ref(0)

function loadStats() {
  const stats = designSystemStorage.getStats()
  componentsCount.value = stats.components
  tokensCount.value = stats.tokens
  storageSize.value = '1.2 MB' // Mocked
  
  // Mock activity
  if (stats.components > 0) {
    recentActivity.value = [
      { id: 1, icon: 'pi pi-plus', description: 'Added Button component', time: '2 mins ago' },
      { id: 2, icon: 'pi pi-pencil', description: 'Updated color tokens', time: '1 hour ago' }
    ]
  } else {
    recentActivity.value = []
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFile(target.files[0])
  }
}

function handleDrop(event: DragEvent) {
  dragOver.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFile(event.dataTransfer.files[0])
  }
}

async function processFile(file: File) {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    // Simple validation
    if (!data.source && !data.version) throw new Error('Invalid file format')
    
    // Basic import logic (would use proper service in real app)
    const result = designSystemStorage.importFromPenpot(data)
    importSuccess.value = true
    importedTokens.value = result.tokens
    importedComponents.value = result.components
    loadStats()
    setTimeout(() => { showImportModal.value = false; importSuccess.value = false }, 2000)
  } catch (err) {
    console.error(err)
    importError.value = 'Failed to import file'
  }
}

function confirmClearData() {
  showClearConfirm.value = true
}

function clearAllData() {
  designSystemStorage.clearAll()
  showClearConfirm.value = false
  showImportModal.value = false
  loadStats()
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
/* Minimal scoped styles, relying mostly on Tailwind */
:deep(.p-dialog-simple .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem;
}
:deep(.p-dialog-simple .p-dialog-content) {
  padding: 0 1.5rem 1.5rem;
}
</style>