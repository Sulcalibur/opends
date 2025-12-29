<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Code Generator</h1>
            <p class="text-gray-600">Generate production-ready components for Vue, React, and Svelte.</p>
          </div>
        </div>

        <!-- Framework Selection -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Framework</label>
              <Dropdown
                v-model="generationOptions.framework"
                :options="frameworkOptions"
                optionLabel="name"
                optionValue="id"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Styling</label>
              <Dropdown
                v-model="generationOptions.styling"
                :options="stylingOptions"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">TypeScript</label>
              <Dropdown
                v-model="generationOptions.typescript"
                :options="typescriptOptions"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Component Selection -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Components</h2>

          <div class="mb-4 flex gap-4 items-center">
            <Button
              @click="selectAllComponents"
              size="small"
              outlined
              label="Select All"
            />
            <Button
              @click="clearSelection"
              size="small"
              outlined
              label="Clear"
            />
            <span class="text-sm text-gray-600">{{ selectedComponents.length }} of {{ components.length }} selected</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="component in components"
              :key="component.id"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors"
              :class="selectedComponents.includes(component.id) ? 'border-indigo-500 bg-indigo-50' : 'hover:border-gray-300'"
              @click="toggleComponentSelection(component.id)"
            >
              <div class="flex items-center gap-3 mb-2">
                <Checkbox
                  :modelValue="selectedComponents.includes(component.id)"
                  @update:modelValue="toggleComponentSelection(component.id)"
                  class="pointer-events-none"
                />
                <h3 class="font-semibold text-gray-900">{{ component.name }}</h3>
                <Badge :value="component.category" class="text-xs" />
              </div>
              <p v-if="component.description" class="text-sm text-gray-600 line-clamp-2">
                {{ component.description }}
              </p>
              <div class="mt-2 flex gap-4 text-xs text-gray-500">
                <span>{{ component.props?.length || 0 }} props</span>
                <span>{{ component.events?.length || 0 }} events</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Generation Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Generate Code</h2>

          <div class="flex gap-4 mb-6">
            <Button
              @click="generateSelectedComponents"
              :loading="generating"
              :disabled="selectedComponents.length === 0"
              icon="pi pi-code"
              label="Generate Selected Components"
              class="p-button-primary"
            />
            <Button
              @click="generateAllComponents"
              :loading="generating"
              :disabled="components.length === 0"
              icon="pi pi-download"
              label="Generate Full Library"
              class="p-button-secondary"
            />
          </div>

          <!-- Generation Results -->
          <div v-if="generationResult" class="space-y-4">
            <div class="border border-green-200 bg-green-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <i class="pi pi-check-circle text-green-600"></i>
                <h3 class="font-semibold text-green-800">Generation Complete!</h3>
              </div>
              <p class="text-green-700 mb-3">
                Generated {{ generationResult.components?.length || 0 }} components for {{ generationOptions.framework }}
              </p>
              <div class="flex gap-2">
                <Button
                  @click="downloadZip"
                  icon="pi pi-download"
                  label="Download ZIP"
                  size="small"
                  class="p-button-success"
                />
                <Button
                  @click="copyToClipboard"
                  icon="pi pi-copy"
                  label="Copy Code"
                  size="small"
                  outlined
                />
              </div>
            </div>

            <!-- Code Preview -->
            <div class="border border-gray-200 rounded-lg">
              <div class="border-b border-gray-200 px-4 py-3 bg-gray-50">
                <h4 class="font-semibold text-gray-900">Generated Files</h4>
              </div>
              <div class="divide-y divide-gray-200">
                <div
                  v-for="file in generationResult.files"
                  :key="file.name"
                  class="p-4 hover:bg-gray-50"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="font-mono text-sm text-gray-900">{{ file.name }}</span>
                      <span class="text-xs text-gray-500 ml-2">{{ file.type }}</span>
                    </div>
                    <Button
                      @click="viewFile(file)"
                      size="small"
                      outlined
                      label="View"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- File Viewer Modal -->
        <Dialog
          v-model:visible="showFileViewer"
          :header="`Viewing: ${currentFile?.name || ''}`"
          modal
          style="width: 800px"
        >
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96">
            <pre>{{ currentFile?.content || '' }}</pre>
          </div>
          <template #footer>
            <Button
              @click="copyFileContent"
              icon="pi pi-copy"
              label="Copy to Clipboard"
              outlined
            />
            <Button
              @click="downloadFile"
              icon="pi pi-download"
              label="Download File"
            />
          </template>
        </Dialog>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Badge from 'primevue/badge'
import Checkbox from 'primevue/checkbox'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'
import axios from 'axios'

const toast = useToast()

// Types
interface Component {
  id: string
  name: string
  category: string
  description: string
  props: any[]
  events: any[]
}

interface GenerationResult {
  components: Component[]
  index: { filename: string; code: string }
  styles: { filename: string; code: string }
  files: Array<{ name: string; content: string; type: string }>
}

// State
const components = ref<Component[]>([])
const selectedComponents = ref<string[]>([])
const generating = ref(false)
const generationResult = ref<GenerationResult | null>(null)
const showFileViewer = ref(false)
const currentFile = ref<{ name: string; content: string; type: string } | null>(null)

const generationOptions = ref({
  framework: 'vue',
  styling: 'tailwind',
  typescript: false,
  includeStyles: true
})

// Options
const frameworkOptions = [
  { id: 'vue', name: 'Vue 3' },
  { id: 'react', name: 'React' },
  { id: 'svelte', name: 'Svelte' }
]

const stylingOptions = [
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'CSS Modules', value: 'css-modules' },
  { label: 'Styled Components', value: 'styled-components' }
]

const typescriptOptions = [
  { label: 'TypeScript', value: true },
  { label: 'JavaScript', value: false }
]

// Methods
const loadComponents = async () => {
  try {
    const response = await axios.get('/api/components')
    components.value = response.data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load components',
      life: 3000
    })
  }
}

const toggleComponentSelection = (componentId: string) => {
  const index = selectedComponents.value.indexOf(componentId)
  if (index > -1) {
    selectedComponents.value.splice(index, 1)
  } else {
    selectedComponents.value.push(componentId)
  }
}

const selectAllComponents = () => {
  selectedComponents.value = components.value.map(c => c.id)
}

const clearSelection = () => {
  selectedComponents.value = []
}

const generateSelectedComponents = async () => {
  if (selectedComponents.value.length === 0) return

  await generateComponents(selectedComponents.value)
}

const generateAllComponents = async () => {
  const allIds = components.value.map(c => c.id)
  await generateComponents(allIds)
}

const generateComponents = async (componentIds: string[]) => {
  generating.value = true
  try {
    const response = await axios.post('/api/generate/library', {
      componentIds,
      framework: generationOptions.value.framework,
      options: generationOptions.value
    })

    generationResult.value = response.data

    // Create file list for preview
    const files = []

    // Add components
    response.data.components.forEach(comp => {
      files.push({
        name: getComponentFilename(comp.name, generationOptions.value.framework),
        content: comp.code,
        type: 'component'
      })
    })

    // Add index file
    files.push({
      name: response.data.index.filename,
      content: response.data.index.code,
      type: 'index'
    })

    // Add styles
    files.push({
      name: response.data.styles.filename,
      content: response.data.styles.code,
      type: 'styles'
    })

    generationResult.value.files = files

    toast.add({
      severity: 'success',
      summary: 'Generation Complete',
      detail: `Generated ${componentIds.length} components`,
      life: 3000
    })
  } catch (error) {
    console.error('Generation error:', error)
    toast.add({
      severity: 'error',
      summary: 'Generation Failed',
      detail: error.response?.data?.error || 'Failed to generate components',
      life: 5000
    })
  } finally {
    generating.value = false
  }
}

const getComponentFilename = (componentName: string, framework: string) => {
  const baseName = componentName.charAt(0).toLowerCase() + componentName.slice(1)
  switch (framework) {
    case 'vue': return `${baseName}.vue`
    case 'react': return `${baseName}.jsx`
    case 'svelte': return `${baseName}.svelte`
    default: return `${baseName}.js`
  }
}

const downloadZip = () => {
  // In a real implementation, this would create and download a ZIP file
  // For now, we'll download individual files
  toast.add({
    severity: 'info',
    summary: 'ZIP Download',
    detail: 'ZIP download not implemented yet. Use individual file downloads.',
    life: 3000
  })
}

const copyToClipboard = () => {
  if (generationResult.value?.files?.[0]) {
    navigator.clipboard.writeText(generationResult.value.files[0].content)
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Code copied to clipboard',
      life: 2000
    })
  }
}

const viewFile = (file: any) => {
  currentFile.value = file
  showFileViewer.value = true
}

const copyFileContent = () => {
  if (currentFile.value) {
    navigator.clipboard.writeText(currentFile.value.content)
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'File content copied to clipboard',
      life: 2000
    })
  }
}

const downloadFile = () => {
  if (currentFile.value) {
    const blob = new Blob([currentFile.value.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentFile.value.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: 'Downloaded',
      detail: `Downloaded ${currentFile.value.name}`,
      life: 2000
    })
  }
}

// Lifecycle
onMounted(() => {
  loadComponents()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>