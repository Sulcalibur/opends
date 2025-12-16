<template>
  <div class="components-view">
    <div class="view-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Components</h1>
          <p class="text-surface-600 dark:text-surface-400 mt-2">
            Browse and manage your design system components
          </p>
        </div>
        <div class="flex gap-2">
          <Button 
            label="Sync All" 
            icon="pi pi-sync" 
            severity="secondary"
            :loading="syncingAll"
            @click="syncAllComponents"
          />
          <Button 
            label="Generate Code" 
            icon="pi pi-code" 
            severity="primary"
            @click="$router.push('/codegen')"
          />
        </div>
      </div>
    </div>

    <div class="view-content mt-8">
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="pi pi-box text-primary-500"></i>
              <span>Design System Components</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-surface-500 dark:text-surface-400">
                {{ filteredComponents.length }} components
              </span>
              <span class="text-surface-300 dark:text-surface-700">|</span>
              <InputText 
                v-model="searchQuery" 
                placeholder="Search components..." 
                class="w-64"
              >
                <template #prefix>
                  <i class="pi pi-search"></i>
                </template>
              </InputText>
              <Dropdown 
                v-model="selectedCategory" 
                :options="categories" 
                optionLabel="label"
                optionValue="value"
                placeholder="All Categories"
                class="w-48"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="text-center py-8">
            <ProgressSpinner />
          </div>
          <div v-else-if="filteredComponents.length === 0" class="text-center py-8 text-surface-500 dark:text-surface-400">
            <i class="pi pi-inbox text-4xl mb-4"></i>
            <p class="text-lg mb-2">No components found</p>
            <p class="text-sm mb-6">
              {{ searchQuery || selectedCategory ? 'Try adjusting your search filters' : 'Sync components from your design files to get started' }}
            </p>
            <Button 
              label="Sync Components" 
              icon="pi pi-sync" 
              severity="primary"
              @click="syncAllComponents"
            />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card 
              v-for="component in filteredComponents" 
              :key="component.id"
              class="component-card hover:shadow-lg transition-all duration-200"
            >
              <template #header>
                <div class="component-preview h-32 bg-surface-100 dark:bg-surface-800 rounded-t-lg flex items-center justify-center">
                  <i class="pi pi-box text-4xl text-surface-400 dark:text-surface-500"></i>
                </div>
              </template>
              <template #title>
                <div class="flex items-center justify-between">
                  <span class="font-medium truncate">{{ component.name }}</span>
                  <Tag :value="component.category" size="small" />
                </div>
              </template>
              <template #subtitle>
                <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                  <i :class="getSourceIcon(component.source)" class="text-xs"></i>
                  <span>{{ component.source }}</span>
                  <span>•</span>
                  <span>{{ formatDate(component.updatedAt) }}</span>
                </div>
              </template>
              <template #content>
                <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                  {{ component.description || 'No description available' }}
                </p>
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <Button 
                    icon="pi pi-eye" 
                    severity="secondary" 
                    size="small"
                    @click="viewComponent(component)"
                    v-tooltip="'View details'"
                  />
                  <Button 
                    icon="pi pi-code" 
                    severity="secondary" 
                    size="small"
                    @click="generateCode(component)"
                    v-tooltip="'Generate code'"
                  />
                  <Button 
                    icon="pi pi-copy" 
                    severity="secondary" 
                    size="small"
                    @click="copyComponent(component)"
                    v-tooltip="'Copy to clipboard'"
                  />
                </div>
              </template>
            </Card>
          </div>
        </template>
      </Card>
    </div>

    <!-- Component Details Dialog -->
    <Dialog 
      v-model:visible="showComponentDialog" 
      modal 
      :header="selectedComponent?.name || 'Component Details'"
      :style="{ width: '700px', maxWidth: '90vw' }"
      v-if="selectedComponent"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Name
            </label>
            <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded">
              {{ selectedComponent.name }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Category
            </label>
            <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded">
              <Tag :value="selectedComponent.category" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Description
          </label>
          <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded min-h-20">
            {{ selectedComponent.description || 'No description available' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Source
          </label>
          <div class="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded">
            <i :class="getSourceIcon(selectedComponent.source)" class="text-xl"></i>
            <span>{{ selectedComponent.source }}</span>
            <span class="text-surface-400 dark:text-surface-600">•</span>
            <span class="text-sm text-surface-500 dark:text-surface-400">
              Last updated: {{ formatDate(selectedComponent.updatedAt) }}
            </span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Properties
          </label>
          <DataTable :value="selectedComponent.properties || []" class="p-datatable-sm">
            <Column field="name" header="Name" />
            <Column field="type" header="Type" />
            <Column field="default" header="Default" />
            <Column field="required" header="Required">
              <template #body="{ data }">
                <i 
                  :class="data.required ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'" 
                  class="text-sm"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            label="Close" 
            severity="secondary" 
            @click="showComponentDialog = false"
          />
          <Button 
            label="Generate Code" 
            icon="pi pi-code" 
            severity="primary"
            @click="generateCode(selectedComponent)"
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
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const loading = ref(true)
const syncingAll = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

const components = ref<Array<{
  id: string
  name: string
  description: string
  category: string
  source: 'penpot' | 'figma'
  properties: Array<{
    name: string
    type: string
    default: string
    required: boolean
  }>
  createdAt: string
  updatedAt: string
}>>([])

const showComponentDialog = ref(false)
const selectedComponent = ref<any>(null)

const categories = [
  { label: 'All Categories', value: null },
  { label: 'Buttons', value: 'button' },
  { label: 'Forms', value: 'form' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Data Display', value: 'data' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Layout', value: 'layout' },
  { label: 'Typography', value: 'typography' },
]

const filteredComponents = computed(() => {
  let filtered = components.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(c => c.category === selectedCategory.value)
  }
  
  return filtered
})

function getSourceIcon(source: 'penpot' | 'figma') {
  return source === 'penpot' ? 'pi pi-palette text-purple-500' : 'pi pi-desktop text-blue-500'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

async function loadComponents() {
  try {
    loading.value = true
    // TODO: Implement actual API call
    // Mock data for now
    components.value = [
      {
        id: '1',
        name: 'Primary Button',
        description: 'Main call-to-action button for primary actions',
        category: 'button',
        source: 'penpot',
        properties: [
          { name: 'label', type: 'string', default: 'Button', required: true },
          { name: 'disabled', type: 'boolean', default: 'false', required: false },
          { name: 'size', type: 'enum', default: 'medium', required: false },
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
      },
      {
        id: '2',
        name: 'Input Field',
        description: 'Text input field for user data entry',
        category: 'form',
        source: 'figma',
        properties: [
          { name: 'placeholder', type: 'string', default: '', required: false },
          { name: 'type', type: 'enum', default: 'text', required: false },
          { name: 'disabled', type: 'boolean', default: 'false', required: false },
        ],
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-19T11:20:00Z',
      },
      {
        id: '3',
        name: 'Card',
        description: 'Container for grouping related content',
        category: 'layout',
        source: 'penpot',
        properties: [
          { name: 'title', type: 'string', default: '', required: false },
          { name: 'subtitle', type: 'string', default: '', required: false },
          { name: 'elevation', type: 'enum', default: 'medium', required: false },
        ],
        createdAt: '2024-01-14T16:45:00Z',
        updatedAt: '2024-01-18T13:30:00Z',
      },
      {
        id: '4',
        name: 'Modal',
        description: 'Overlay dialog for focused user interactions',
        category: 'feedback',
        source: 'figma',
        properties: [
          { name: 'title', type: 'string', default: '', required: true },
          { name: 'visible', type: 'boolean', default: 'false', required: true },
          { name: 'closable', type: 'boolean', default: 'true', required: false },
        ],
        createdAt: '2024-01-17T14:20:00Z',
        updatedAt: '2024-01-21T10:15:00Z',
      },
    ]
  } catch (error) {
    console.error('Failed to load components:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load components',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

async function syncAllComponents() {
  try {
    syncingAll.value = true
    // TODO: Implement actual sync API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    await loadComponents()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Components synced successfully',
      life: 3000,
    })
  } catch (error) {
    console.error('Failed to sync components:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to sync components',
      life: 3000,
    })
  } finally {
    syncingAll.value = false
  }
}

function viewComponent(component: any) {
  selectedComponent.value = component
  showComponentDialog.value = true
}

function generateCode(component: any) {
  // TODO: Implement code generation
  console.log('Generate code for:', component.name)
  toast.add({
    severity: 'info',
    summary: 'Code Generation',
    detail: `Generating code for ${component.name}...`,
    life: 3000,
  })
}

function copyComponent(component: any) {
  // TODO: Implement copy to clipboard
  console.log('Copy component:', component.name)
  toast.add({
    severity: 'success',
    summary: 'Copied',
    detail: `Component "${component.name}" copied to clipboard`,
    life: 2000,
  })
}

onMounted(() => {
  loadComponents()
})
</script>

<style scoped>
.components-view {
  @apply p-6;
}

.view-header {
  @apply mb-8;
}

.component-card:hover {
  @apply transform -translate-y-1;
}

.component-preview {
  @apply transition-colors duration-200;
}
</style>