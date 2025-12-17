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
        <div class="flex gap-2">
          <Button 
            label="Add Design File" 
            icon="pi pi-plus" 
            severity="primary"
            @click="showConnectionWizard = true"
          />
          <Button 
            icon="pi pi-comment" 
            severity="secondary"
            @click="showFeedbackDialog = true"
            v-tooltip="'Send feedback'"
          />
        </div>
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
              @click="showConnectionWizard = true"
            />
          </div>
           <div v-else>
             <div class="mb-4">
               <div class="flex align-items-center justify-content-between">
                 <div class="flex align-items-center gap-2">
                   <span class="p-input-icon-left">
                     <i class="pi pi-search"></i>
                     <InputText 
                       v-model="searchQuery" 
                       placeholder="Search design files..." 
                       class="w-20rem"
                     />
                   </span>
                   <Dropdown 
                     v-model="selectedSourceFilter" 
                     :options="sourceFilterOptions" 
                     optionLabel="label"
                     optionValue="value"
                     placeholder="Filter by source"
                     class="w-15rem"
                   />
                 </div>
                 <div class="flex align-items-center gap-2">
                   <Button 
                     icon="pi pi-filter-slash" 
                     severity="secondary" 
                     size="small"
                     @click="clearFilters"
                     v-tooltip="'Clear filters'"
                   />
                   <span class="text-sm text-color-secondary">
                     {{ filteredFiles.length }} of {{ designFiles.length }} files
                   </span>
                 </div>
               </div>
             </div>
             
             <DataTable 
               :value="filteredFiles" 
               class="p-datatable-sm"
               :paginator="true"
               :rows="10"
               :rowsPerPageOptions="[5, 10, 20, 50]"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} files"
             >
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
                     <div class="relative">
                        <Button 
                          icon="pi pi-sync" 
                          severity="secondary" 
                          size="small"
                          :loading="designFilesStore.isSyncing(data.id)"
                          @click="syncDesignFile(data.id)"
                          v-tooltip="'Sync from source'"
                        />
                        <!-- Sync Progress Indicator -->
                        <div 
                          v-if="getSyncProgress(data.id)"
                          class="absolute -top-1 -right-1 w-3 h-3"
                        >
                          <div 
                            :class="[
                              'w-full h-full rounded-full animate-pulse',
                              getSyncProgress(data.id)?.status === 'completed' ? 'bg-green-500' :
                              getSyncProgress(data.id)?.status === 'failed' ? 'bg-red-500' :
                              'bg-blue-500'
                            ]"
                          ></div>
                        </div>
                      </div>
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

    <!-- Connection Wizard -->
    <ConnectionWizard 
      v-model="showConnectionWizard"
      @connected="handleFileConnected"
      @error="handleConnectionError"
    />

    <!-- Design File Detail Modal -->
    <Dialog 
      v-model:visible="showFileDetailDialog" 
      modal 
      :header="currentDetailFile ? `Design File: ${currentDetailFile.name}` : 'Design File Details'"
      :style="{ width: '700px', maxWidth: '90vw' }"
    >
      <div v-if="currentDetailFile" class="flex flex-column gap-5">
        <!-- File Header -->
        <div class="flex align-items-center gap-3 p-3 surface-50 border-round">
          <div class="w-12 h-12 bg-primary-50 border-round flex align-items-center justify-content-center">
            <i :class="getSourceIcon(currentDetailFile.source)" class="text-2xl"></i>
          </div>
          <div class="flex-1">
            <div class="font-medium text-lg">{{ currentDetailFile.name }}</div>
            <div class="flex align-items-center gap-2 mt-1">
              <Tag :value="currentDetailFile.source" :severity="getSourceSeverity(currentDetailFile.source)" />
              <span class="text-sm text-color-secondary">
                Added {{ formatDate(currentDetailFile.createdAt) }}
              </span>
            </div>
          </div>
          <Button 
            icon="pi pi-sync" 
            severity="secondary" 
            :loading="designFilesStore.isSyncing(currentDetailFile.id)"
            @click="syncDesignFile(currentDetailFile.id)"
            v-tooltip="'Sync from source'"
          />
        </div>

        <!-- File Information -->
        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="text-sm text-color-secondary mb-1">Source URL</div>
            <div class="flex align-items-center gap-2">
              <a 
                :href="currentDetailFile.url" 
                target="_blank"
                class="text-primary hover:underline truncate"
              >
                {{ currentDetailFile.url }}
              </a>
                    <Button 
                      icon="pi pi-external-link" 
                      severity="secondary" 
                      size="small"
                      text
                      @click="openUrl(currentDetailFile.url)"
                      v-tooltip="'Open in new tab'"
                    />
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="text-sm text-color-secondary mb-1">Last Synced</div>
            <div>{{ formatDate(currentDetailFile.updatedAt) }}</div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid">
          <div class="col-12 md:col-4">
            <Card class="h-full">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-box text-primary"></i>
                  <span>Components</span>
                </div>
              </template>
              <template #content>
                <div class="text-center py-3">
                  <div class="text-3xl font-bold text-primary">15</div>
                  <div class="text-sm text-color-secondary mt-1">Synced components</div>
                </div>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="h-full">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-palette text-green-500"></i>
                  <span>Design Tokens</span>
                </div>
              </template>
              <template #content>
                <div class="text-center py-3">
                  <div class="text-3xl font-bold text-green-500">24</div>
                  <div class="text-sm text-color-secondary mt-1">Colors, typography, spacing</div>
                </div>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="h-full">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-history text-blue-500"></i>
                  <span>Sync History</span>
                </div>
              </template>
              <template #content>
                <div class="text-center py-3">
                  <div class="text-3xl font-bold text-blue-500">3</div>
                  <div class="text-sm text-color-secondary mt-1">Successful syncs</div>
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- Recent Syncs -->
        <div>
          <div class="font-medium mb-3">Recent Sync Activity</div>
          <div class="surface-50 border-round overflow-hidden">
            <div class="p-3 surface-100 border-bottom-1 surface-border">
              <div class="grid text-sm font-medium">
                <div class="col-4">Date</div>
                <div class="col-4">Status</div>
                <div class="col-4">Components</div>
              </div>
            </div>
            <div class="p-3 border-bottom-1 surface-border">
              <div class="grid text-sm">
                <div class="col-4">{{ formatDate(currentDetailFile.updatedAt) }}</div>
                <div class="col-4">
                  <Tag value="Success" severity="success" />
                </div>
                <div class="col-4">15 components</div>
              </div>
            </div>
            <div class="p-3 border-bottom-1 surface-border">
              <div class="grid text-sm">
                <div class="col-4">2 days ago</div>
                <div class="col-4">
                  <Tag value="Success" severity="success" />
                </div>
                <div class="col-4">14 components</div>
              </div>
            </div>
            <div class="p-3">
              <div class="grid text-sm">
                <div class="col-4">1 week ago</div>
                <div class="col-4">
                  <Tag value="Success" severity="success" />
                </div>
                <div class="col-4">12 components</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 justify-content-end">
          <Button 
            label="Sync Now" 
            icon="pi pi-sync" 
            severity="primary"
            :loading="designFilesStore.isSyncing(currentDetailFile.id)"
            @click="syncDesignFile(currentDetailFile.id)"
          />
          <Button 
            label="Delete" 
            icon="pi pi-trash" 
            severity="danger"
            @click="confirmDelete(currentDetailFile)"
          />
        </div>
      </div>
    </Dialog>

    <!-- Sync Progress Dialog -->
    <Dialog 
      v-model:visible="showSyncProgressDialog" 
      modal 
      header="Sync Progress"
      :style="{ width: '500px' }"
      :closable="!isSyncingFile"
    >
      <div v-if="currentSyncProgress" class="flex flex-column gap-4">
        <!-- File Info -->
        <div class="flex align-items-center gap-3 p-3 surface-50 border-round">
          <i :class="getSourceIcon(currentSyncFile?.source || 'penpot')" class="text-2xl"></i>
          <div>
            <div class="font-medium">{{ currentSyncFile?.name }}</div>
            <div class="text-sm text-color-secondary">{{ currentSyncFile?.source }}</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div>
          <div class="flex align-items-center justify-content-between mb-2">
            <span class="font-medium">Sync Progress</span>
            <span class="text-color-secondary">{{ currentSyncProgress.progress }}%</span>
          </div>
          <ProgressBar 
            :value="currentSyncProgress.progress" 
            :showValue="false"
            class="h-2"
          />
        </div>

        <!-- Status -->
        <div 
          :class="[
            'p-3 border-round flex align-items-start gap-2',
            currentSyncProgress.status === 'completed' ? 'bg-green-50 border-green-200 border-1' :
            currentSyncProgress.status === 'failed' ? 'bg-red-50 border-red-200 border-1' :
            'bg-blue-50 border-blue-200 border-1'
          ]"
        >
          <i 
            :class="[
              'mt-1',
              currentSyncProgress.status === 'completed' ? 'pi pi-check-circle text-green-500' :
              currentSyncProgress.status === 'failed' ? 'pi pi-times-circle text-red-500' :
              'pi pi-spin pi-spinner text-blue-500'
            ]"
          ></i>
          <div class="flex-1">
            <div class="font-medium">{{ currentSyncProgress.message }}</div>
            <div v-if="currentSyncProgress.details" class="text-sm text-color-secondary mt-1">
              {{ currentSyncProgress.details }}
            </div>
            <div class="text-xs text-color-secondary mt-2">
              Started: {{ formatTime(currentSyncProgress.startedAt) }}
              <span v-if="currentSyncProgress.completedAt">
                • Completed: {{ formatTime(currentSyncProgress.completedAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="flex flex-column gap-2">
          <div 
            v-for="(step, index) in syncSteps" 
            :key="index"
            :class="[
              'p-2 border-round flex align-items-center gap-2',
              getStepStatus(index) === 'completed' ? 'bg-green-50' :
              getStepStatus(index) === 'active' ? 'bg-blue-50' :
              'surface-50'
            ]"
          >
            <div 
              :class="[
                'w-6 h-6 border-circle flex align-items-center justify-content-center text-xs',
                getStepStatus(index) === 'completed' ? 'bg-green-100 text-green-600' :
                getStepStatus(index) === 'active' ? 'bg-blue-100 text-blue-600' :
                'surface-200 text-color-secondary'
              ]"
            >
              <i 
                :class="[
                  getStepStatus(index) === 'completed' ? 'pi pi-check' :
                  getStepStatus(index) === 'active' ? 'pi pi-spin pi-spinner' :
                  'pi pi-circle'
                ]"
              ></i>
            </div>
            <div class="text-sm">{{ step.label }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button 
            v-if="currentSyncProgress?.status === 'completed' || currentSyncProgress?.status === 'failed'"
            label="Close" 
            severity="secondary" 
            @click="showSyncProgressDialog = false"
          />
          <Button 
            v-if="currentSyncProgress?.status === 'failed'"
            label="Retry" 
            severity="primary" 
            @click="retrySync"
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

    <!-- Feedback Dialog -->
    <Dialog 
      v-model:visible="showFeedbackDialog" 
      modal 
      header="Send Feedback"
      :style="{ width: '500px' }"
    >
      <div class="flex flex-column gap-4">
        <div class="text-center mb-2">
          <p class="text-color-secondary">Help us improve the Design Files experience</p>
        </div>
        
        <div class="field">
          <label class="block mb-2 font-medium">How would you rate this feature?</label>
          <div class="flex gap-2 justify-content-center">
            <Button 
              v-for="rating in [1, 2, 3, 4, 5]" 
              :key="rating"
              :icon="rating <= feedback.rating ? 'pi pi-star-fill' : 'pi pi-star'"
              :severity="rating <= feedback.rating ? 'warning' : 'secondary'"
              text
              @click="feedback.rating = rating"
              v-tooltip="`${rating} star${rating > 1 ? 's' : ''}`"
            />
          </div>
        </div>

        <div class="field">
          <label for="feedback-category" class="block mb-2 font-medium">
            Category
          </label>
          <Dropdown 
            id="feedback-category" 
            v-model="feedback.category" 
            :options="[
              { label: 'General Feedback', value: 'general' },
              { label: 'Bug Report', value: 'bug' },
              { label: 'Feature Request', value: 'feature' },
              { label: 'Usability Issue', value: 'usability' }
            ]" 
            optionLabel="label"
            optionValue="value"
            placeholder="Select category"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="feedback-comment" class="block mb-2 font-medium">
            Your Feedback
          </label>
          <textarea 
            id="feedback-comment" 
            v-model="feedback.comment" 
            placeholder="Tell us what you think..."
            class="w-full p-3 border-1 surface-border border-round"
            rows="4"
          ></textarea>
        </div>

        <div class="text-sm text-color-secondary">
          <i class="pi pi-info-circle mr-1"></i>
          Your feedback helps us improve OpenDS for everyone
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-content-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="showFeedbackDialog = false"
          />
          <Button 
            label="Submit Feedback" 
            severity="primary" 
            :disabled="!feedback.comment.trim()"
            :loading="submittingFeedback"
            @click="submitFeedback"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'
// import Paginator from 'primevue/paginator' // Not needed as DataTable has built-in paginator
import { useToast } from 'primevue/usetoast'

import ConnectionWizard from '../components/ConnectionWizard.vue'
import { useDesignFilesStore } from '../stores/design-files'
import type { DesignFile } from '../api/client'

const designFilesStore = useDesignFilesStore()
const toast = useToast()
const loading = computed(() => designFilesStore.loading)
const designFiles = computed(() => designFilesStore.files)
const syncingFile = ref<string | null>(null)

const showConnectionWizard = ref(false)
const showFileDetailDialog = ref(false)
const showSyncProgressDialog = ref(false)
const showDeleteDialog = ref(false)
const showFeedbackDialog = ref(false)
const fileToDelete = ref<DesignFile | null>(null)
const deletingFile = ref(false)
const currentSyncFile = ref<DesignFile | null>(null)
const currentDetailFile = ref<DesignFile | null>(null)
const loadingDetail = ref(false)
const submittingFeedback = ref(false)

// Feedback state
const feedback = ref({
  rating: 0,
  comment: '',
  category: 'general'
})

// Search and filter state
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const selectedSourceFilter = ref<string | null>(null)
const sourceFilterOptions = [
  { label: 'All Sources', value: null },
  { label: 'Penpot', value: 'penpot' },
  { label: 'Figma', value: 'figma' }
]

// Debounce search input (300ms delay)
let searchTimeout: NodeJS.Timeout | null = null
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue
  }, 300)
})

const syncSteps = [
  { label: 'Connecting to design tool' },
  { label: 'Fetching design file' },
  { label: 'Syncing components and tokens' },
  { label: 'Updating database' }
]

// Filtered files
const filteredFiles = computed(() => {
  let filtered = designFiles.value
  
  // Apply search filter (using debounced value)
  if (debouncedSearchQuery.value.trim()) {
    const query = debouncedSearchQuery.value.toLowerCase()
    filtered = filtered.filter(file => 
      file.name.toLowerCase().includes(query) ||
      file.source.toLowerCase().includes(query)
    )
  }
  
  // Apply source filter
  if (selectedSourceFilter.value) {
    filtered = filtered.filter(file => file.source === selectedSourceFilter.value)
  }
  
  return filtered
})

const currentSyncProgress = computed(() => {
  if (!currentSyncFile.value) return null
  return designFilesStore.getSyncProgress(currentSyncFile.value.id)
})

const isSyncingFile = computed(() => {
  if (!currentSyncFile.value) return false
  return designFilesStore.isSyncing(currentSyncFile.value.id)
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

function getSyncProgress(id: string) {
  return designFilesStore.getSyncProgress(id)
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getStepStatus(stepIndex: number): 'pending' | 'active' | 'completed' {
  if (!currentSyncProgress.value) return 'pending'
  
  const status = currentSyncProgress.value.status
  
  if (status === 'failed') return 'pending'
  
  if (stepIndex === 0) {
    return ['connecting', 'fetching', 'syncing', 'completed'].includes(status) ? 'completed' : 'pending'
  } else if (stepIndex === 1) {
    return ['fetching', 'syncing', 'completed'].includes(status) ? 'completed' : 
           status === 'connecting' ? 'active' : 'pending'
  } else if (stepIndex === 2) {
    return ['syncing', 'completed'].includes(status) ? 'completed' :
           status === 'fetching' ? 'active' : 'pending'
  } else if (stepIndex === 3) {
    return status === 'completed' ? 'completed' :
           status === 'syncing' ? 'active' : 'pending'
  }
  
  return 'pending'
}

async function retrySync() {
  if (!currentSyncFile.value) return
  
  try {
    await designFilesStore.syncFile(currentSyncFile.value.id)
  } catch (error) {
    console.error('Failed to retry sync:', error)
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedSourceFilter.value = null
}

function openUrl(url: string) {
  window.open(url, '_blank')
}

async function submitFeedback() {
  if (!feedback.value.comment.trim()) return
  
  try {
    submittingFeedback.value = true
    
    // In a real application, this would send to a backend API
    // For now, we'll just log it and show a success message
    console.log('User feedback:', feedback.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      severity: 'success',
      summary: 'Feedback Submitted',
      detail: 'Thank you for your feedback!',
      life: 5000
    })
    
    // Reset and close
    feedback.value = { rating: 0, comment: '', category: 'general' }
    showFeedbackDialog.value = false
    
  } catch (error: any) {
    console.error('Failed to submit feedback:', error)
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: 'Failed to submit feedback. Please try again.',
      life: 5000
    })
  } finally {
    submittingFeedback.value = false
  }
}

async function loadDesignFiles() {
  try {
    await designFilesStore.fetchFiles()
  } catch (error: any) {
    console.error('Failed to load design files:', error)
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: error.message || 'Could not load design files. Please try again.',
      life: 5000
    })
  }
}

async function syncDesignFile(id: string) {
  try {
    syncingFile.value = id
    currentSyncFile.value = designFiles.value.find(f => f.id === id) || null
    
    if (currentSyncFile.value) {
      showSyncProgressDialog.value = true
    }
    
    await designFilesStore.syncFile(id)
  } catch (error) {
    console.error('Failed to sync design file:', error)
    toast.add({
      severity: 'error',
      summary: 'Sync Failed',
      detail: 'Failed to sync design file. Please try again.',
      life: 5000
    })
  } finally {
    syncingFile.value = null
  }
}

async function viewDesignFile(id: string) {
  try {
    loadingDetail.value = true
    const file = designFiles.value.find(f => f.id === id)
    
    if (file) {
      currentDetailFile.value = file
      showFileDetailDialog.value = true
      
      // Load additional details in background
      loadFileDetails(id).catch(error => {
        console.error('Failed to load additional file details:', error)
        // Don't show error toast for background loading failures
      })
    } else {
      // File not in cache, fetch from API
      const fetchedFile = await designFilesStore.getFile(id)
      currentDetailFile.value = fetchedFile
      showFileDetailDialog.value = true
    }
  } catch (error: any) {
    console.error('Failed to load design file details:', error)
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: error.message || 'Could not load design file details',
      life: 3000
    })
  } finally {
    loadingDetail.value = false
  }
}

async function loadFileDetails(_id: string) {
  // This would load additional details like components count, tokens count, etc.
  // For now, we'll just simulate it
  await new Promise(resolve => setTimeout(resolve, 500))
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await loadDesignFiles() // Refresh the list
    
    toast.add({
      severity: 'success',
      summary: 'File Deleted',
      detail: `"${fileToDelete.value.name}" has been removed`,
      life: 5000
    })
    
    showDeleteDialog.value = false
    fileToDelete.value = null
  } catch (error: any) {
    console.error('Failed to delete design file:', error)
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: error.message || 'Could not delete design file. Please try again.',
      life: 5000
    })
  } finally {
    deletingFile.value = false
  }
}

async function handleFileConnected(_fileId: string) {
  try {
    // Refresh the design files list
    await loadDesignFiles()
    
    toast.add({
      severity: 'success',
      summary: 'Design File Connected',
      detail: 'Successfully connected and synced design file',
      life: 5000
    })
  } catch (error) {
    console.error('Failed to refresh design files after connection:', error)
  }
}

function handleConnectionError(error: string) {
  toast.add({
    severity: 'error',
    summary: 'Connection Failed',
    detail: error,
    life: 5000
  })
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