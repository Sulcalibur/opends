<template>
  <div class="codegen-view">
    <div class="view-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Code Generation</h1>
          <p class="text-surface-600 dark:text-surface-400 mt-2">
            Generate code from your design system components
          </p>
        </div>
        <Button 
          label="Generate All" 
          icon="pi pi-code" 
          severity="primary"
          :loading="generatingAll"
          @click="generateAllComponents"
        />
      </div>
    </div>

    <div class="view-content mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Panel: Component Selection -->
        <Card class="lg:col-span-1">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-box text-primary-500"></i>
              <span>Select Components</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <InputText 
                v-model="componentSearch" 
                placeholder="Search components..." 
                class="w-full"
              >
                <template #prefix>
                  <i class="pi pi-search"></i>
                </template>
              </InputText>
              
              <div class="space-y-2">
                <div 
                  v-for="component in filteredComponents" 
                  :key="component.id"
                  :class="[
                    'component-item p-3 rounded border cursor-pointer transition-all',
                    selectedComponents.includes(component.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                  ]"
                  @click="toggleComponent(component.id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <Checkbox 
                        :modelValue="selectedComponents.includes(component.id)" 
                        :binary="true"
                        @click.stop="toggleComponent(component.id)"
                      />
                      <span class="font-medium">{{ component.name }}</span>
                    </div>
                    <Tag :value="component.category" size="small" />
                  </div>
                  <div class="text-sm text-surface-500 dark:text-surface-400 mt-1 ml-8">
                    {{ component.description }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
                <span class="text-sm text-surface-600 dark:text-surface-400">
                  {{ selectedComponents.length }} selected
                </span>
                <Button 
                  label="Select All" 
                  severity="secondary" 
                  size="small"
                  @click="selectAllComponents"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Right Panel: Configuration & Preview -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Framework Selection -->
          <Card>
            <template #title>
              <div class="flex items-center gap-3">
                <i class="pi pi-cog text-primary-500"></i>
                <span>Configuration</span>
              </div>
            </template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="field">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Framework
                  </label>
                  <Dropdown 
                    v-model="selectedFramework" 
                    :options="frameworks" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select framework"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Styling
                  </label>
                  <Dropdown 
                    v-model="selectedStyling" 
                    :options="stylingOptions" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select styling"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Output Format
                  </label>
                  <Dropdown 
                    v-model="outputFormat" 
                    :options="outputFormats" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select format"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    File Naming
                  </label>
                  <InputText 
                    v-model="fileNamingPattern" 
                    placeholder="[component].[ext]"
                    class="w-full"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Additional Options
                </label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <Checkbox 
                      v-model="includeTypes" 
                      inputId="includeTypes" 
                      :binary="true"
                    />
                    <label for="includeTypes" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Include TypeScript types
                    </label>
                  </div>
                  <div class="flex items-center">
                    <Checkbox 
                      v-model="includeTests" 
                      inputId="includeTests" 
                      :binary="true"
                    />
                    <label for="includeTests" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Include test files
                    </label>
                  </div>
                  <div class="flex items-center">
                    <Checkbox 
                      v-model="includeStories" 
                      inputId="includeStories" 
                      :binary="true"
                    />
                    <label for="includeStories" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Include Storybook stories
                    </label>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Code Preview -->
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <i class="pi pi-eye text-primary-500"></i>
                  <span>Code Preview</span>
                </div>
                <div class="flex gap-2">
                  <Button 
                    icon="pi pi-copy" 
                    severity="secondary" 
                    size="small"
                    @click="copyCode"
                    v-tooltip="'Copy to clipboard'"
                  />
                  <Button 
                    icon="pi pi-download" 
                    severity="secondary" 
                    size="small"
                    @click="downloadCode"
                    v-tooltip="'Download code'"
                  />
                </div>
              </div>
            </template>
            <template #content>
              <div class="code-preview-container">
                <div class="code-header flex items-center justify-between p-3 bg-surface-800 text-surface-200 rounded-t-lg">
                  <div class="flex items-center gap-3">
                    <i class="pi pi-file-code"></i>
                    <span class="font-mono text-sm">
                      Button.{{ getFileExtension() }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-surface-400">
                      {{ selectedFramework.label }} • {{ selectedStyling.label }}
                    </span>
                  </div>
                </div>
                <pre class="code-content p-4 bg-surface-900 text-surface-100 rounded-b-lg overflow-auto text-sm font-mono"><code>{{ generatedCode }}</code></pre>
              </div>
              
              <div class="mt-4 flex justify-end">
                <Button 
                  label="Generate Code" 
                  icon="pi pi-code" 
                  severity="primary"
                  :disabled="selectedComponents.length === 0"
                  :loading="generatingCode"
                  @click="generateCode"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'


const toast = useToast()

const componentSearch = ref('')
const selectedComponents = ref<string[]>([])
const generatingAll = ref(false)
const generatingCode = ref(false)

const selectedFramework = ref({ label: 'React', value: 'react' })
const selectedStyling = ref({ label: 'CSS Modules', value: 'css-modules' })
const outputFormat = ref({ label: 'Single File', value: 'single' })
const fileNamingPattern = ref('[component].[ext]')

const includeTypes = ref(true)
const includeTests = ref(false)
const includeStories = ref(false)

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue 3', value: 'vue3' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
]

const stylingOptions = [
  { label: 'CSS Modules', value: 'css-modules' },
  { label: 'Styled Components', value: 'styled-components' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Emotion', value: 'emotion' },
  { label: 'Vanilla CSS', value: 'vanilla-css' },
]

const outputFormats = [
  { label: 'Single File', value: 'single' },
  { label: 'Multiple Files', value: 'multiple' },
  { label: 'ZIP Archive', value: 'zip' },
  { label: 'NPM Package', value: 'npm' },
]

// Mock components
const components = ref([
  {
    id: '1',
    name: 'Primary Button',
    description: 'Main call-to-action button',
    category: 'button',
  },
  {
    id: '2',
    name: 'Secondary Button',
    description: 'Secondary action button',
    category: 'button',
  },
  {
    id: '3',
    name: 'Input Field',
    description: 'Text input for forms',
    category: 'form',
  },
  {
    id: '4',
    name: 'Card',
    description: 'Content container',
    category: 'layout',
  },
  {
    id: '5',
    name: 'Modal',
    description: 'Dialog overlay',
    category: 'feedback',
  },
  {
    id: '6',
    name: 'Dropdown',
    description: 'Select menu',
    category: 'form',
  },
])

const filteredComponents = computed(() => {
  if (!componentSearch.value) return components.value
  
  const query = componentSearch.value.toLowerCase()
  return components.value.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.description.toLowerCase().includes(query)
  )
})

const generatedCode = computed(() => {
  const framework = selectedFramework.value.value
  
  // Simple placeholder code
  const placeholder = `// ${framework.charAt(0).toUpperCase() + framework.slice(1)} Button component
// This is a preview of the generated code
// Select components and configure options to see real code`

  return placeholder
})

function getFileExtension() {
  const framework = selectedFramework.value.value
  switch (framework) {
    case 'react': return 'tsx'
    case 'vue3': return 'vue'
    case 'angular': return 'ts'
    case 'svelte': return 'svelte'
    case 'solid': return 'tsx'
    default: return 'js'
  }
}

function toggleComponent(id: string) {
  const index = selectedComponents.value.indexOf(id)
  if (index === -1) {
    selectedComponents.value.push(id)
  } else {
    selectedComponents.value.splice(index, 1)
  }
}

function selectAllComponents() {
  if (selectedComponents.value.length === filteredComponents.value.length) {
    selectedComponents.value = []
  } else {
    selectedComponents.value = filteredComponents.value.map(c => c.id)
  }
}

async function generateAllComponents() {
  if (components.value.length === 0) return
  
  try {
    generatingAll.value = true
    selectedComponents.value = components.value.map(c => c.id)
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.add({
      severity: 'success',
      summary: 'Code Generated',
      detail: `Generated code for ${components.value.length} components`,
      life: 5000,
    })
  } catch (error) {
    console.error('Failed to generate code:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate code',
      life: 3000,
    })
  } finally {
    generatingAll.value = false
  }
}

async function generateCode() {
  if (selectedComponents.value.length === 0) return
  
  try {
    generatingCode.value = true
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      severity: 'success',
      summary: 'Code Generated',
      detail: `Generated code for ${selectedComponents.value.length} components`,
      life: 5000,
    })
  } catch (error) {
    console.error('Failed to generate code:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate code',
      life: 3000,
    })
  } finally {
    generatingCode.value = false
  }
}

function copyCode() {
  // TODO: Implement copy to clipboard
  navigator.clipboard.writeText(generatedCode.value)
  toast.add({
    severity: 'success',
    summary: 'Copied',
    detail: 'Code copied to clipboard',
    life: 2000,
  })
}

function downloadCode() {
  // TODO: Implement download
  toast.add({
    severity: 'info',
    summary: 'Download',
    detail: 'Code download would start',
    life: 3000,
  })
}

onMounted(() => {
  // Load components from API
})
</script>

<style scoped>
.codegen-view {
  @apply p-6;
}

.view-header {
  @apply mb-8;
}

.component-item {
  @apply transition-all duration-200;
}

.component-item:hover {
  @apply transform -translate-y-0.5;
}

.code-preview-container {
  @apply rounded-lg overflow-hidden;
}

.code-content {
  @apply max-h-96;
}

.code-content code {
  @apply whitespace-pre-wrap;
}
</style>