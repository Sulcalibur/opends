<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DocsSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <ProgressSpinner />
          <p class="mt-4 text-gray-600">Loading component...</p>
        </div>

        <!-- Component Content -->
        <div v-else-if="component" class="space-y-8">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ component.name }}</h1>
                <p class="text-gray-600 text-lg">{{ component.description || 'A design system component' }}</p>
              </div>
              <Badge
                :value="component.category || 'general'"
                severity="info"
                class="text-sm px-3 py-1"
              />
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-4">
              <Button
                label="View in Admin"
                icon="pi pi-external-link"
                outlined
                @click="goToAdmin"
              />
              <Button
                label="Copy Import"
                icon="pi pi-copy"
                outlined
                @click="copyImport"
              />
            </div>
          </div>

          <!-- Interactive Playground -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Interactive Playground</h2>
            <ComponentPlayground
              :component="component.name"
              frameworks="vue,react,svelte"
            />
          </div>

          <!-- Props Table -->
          <div v-if="component.props && component.props.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Props</h2>
            <DataTable :value="component.props" class="p-datatable-sm">
              <Column field="name" header="Name" style="width: 20%">
                <template #body="slotProps">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ slotProps.data.name }}</code>
                </template>
              </Column>
              <Column field="type" header="Type" style="width: 15%">
                <template #body="slotProps">
                  <Badge :value="slotProps.data.type" severity="success" />
                </template>
              </Column>
              <Column field="default" header="Default" style="width: 15%">
                <template #body="slotProps">
                  <code v-if="slotProps.data.default !== undefined" class="bg-gray-100 px-2 py-1 rounded text-sm">
                    {{ JSON.stringify(slotProps.data.default) }}
                  </code>
                  <span v-else class="text-gray-400">-</span>
                </template>
              </Column>
              <Column field="required" header="Required" style="width: 10%">
                <template #body="slotProps">
                  <Badge
                    :value="slotProps.data.required ? 'Yes' : 'No'"
                    :severity="slotProps.data.required ? 'warning' : 'success'"
                  />
                </template>
              </Column>
              <Column field="description" header="Description">
                <template #body="slotProps">
                  {{ slotProps.data.description || '-' }}
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Events Table -->
          <div v-if="component.events && component.events.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Events</h2>
            <DataTable :value="component.events" class="p-datatable-sm">
              <Column field="name" header="Name" style="width: 30%">
                <template #body="slotProps">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ slotProps.data.name }}</code>
                </template>
              </Column>
              <Column field="description" header="Description">
                <template #body="slotProps">
                  {{ slotProps.data.description || '-' }}
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Slots Table -->
          <div v-if="component.slots && component.slots.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Slots</h2>
            <DataTable :value="component.slots" class="p-datatable-sm">
              <Column field="name" header="Name" style="width: 30%">
                <template #body="slotProps">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ slotProps.data.name }}</code>
                </template>
              </Column>
              <Column field="description" header="Description">
                <template #body="slotProps">
                  {{ slotProps.data.description || '-' }}
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Usage Examples -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>

            <Tabs value="vue">
              <TabList>
                <Tab value="vue">Vue</Tab>
                <Tab value="react">React</Tab>
                <Tab value="svelte">Svelte</Tab>
              </TabList>

              <TabPanels>
                <TabPanel value="vue">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <pre class="text-sm overflow-x-auto"><code>{{ vueExample }}</code></pre>
                  </div>
                </TabPanel>

                <TabPanel value="react">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <pre class="text-sm overflow-x-auto"><code>{{ reactExample }}</code></pre>
                  </div>
                </TabPanel>

                <TabPanel value="svelte">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <pre class="text-sm overflow-x-auto"><code>{{ svelteExample }}</code></pre>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>

        <!-- Not found -->
        <div v-else class="text-center py-12">
          <i class="pi pi-exclamation-triangle text-4xl text-red-300 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Component not found</h3>
          <p class="text-gray-600">The requested component could not be found.</p>
          <Button
            label="Back to Components"
            class="mt-4"
            @click="goBack"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import DocsSidebar from '@/app/components/DocsSidebar.vue'
import ComponentPlayground from '@/design-system/components/ComponentPlayground.vue'

const route = useRoute()
const router = useRouter()

const component = ref<any>(null)
const loading = ref(true)

// Computed properties for code examples
const vueExample = computed(() => {
  return `// Vue 3 Example
<template>
  <button>
    Click me
  </button>
</template>

<script setup>
// import Button from '@/components/Button.vue'
</script>`
})

const reactExample = computed(() => {
  return `// React Example
// import React from 'react'
// import Button from '@/components/Button'

function MyComponent() {
  return (
    <Button>
      Click me
    </Button>
  )
}

export default MyComponent`
})

const svelteExample = computed(() => {
  return `// Svelte Example
<script>
  // import Button from '@/components/Button.svelte'
</script>

<button>
  Click me
</button>`
})

onMounted(async () => {
  await loadComponent()
})

async function loadComponent() {
  try {
    const componentId = route.params.id as string

    // Mock component data based on ID
    const mockComponents: Record<string, any> = {
      '1': {
        id: '1',
        name: 'Button',
        description: 'A versatile button component for user interactions',
        category: 'form',
        props: [
          { name: 'variant', type: 'string', default: 'primary', required: false, description: 'Button style variant (primary, secondary, outline, ghost)' },
          { name: 'size', type: 'string', default: 'medium', required: false, description: 'Button size (small, medium, large)' },
          { name: 'disabled', type: 'boolean', default: false, required: false, description: 'Whether the button is disabled' },
          { name: 'loading', type: 'boolean', default: false, required: false, description: 'Show loading spinner' },
          { name: 'icon', type: 'string', default: '', required: false, description: 'Icon to display (PrimeIcons name)' }
        ],
        events: [
          { name: 'click', description: 'Emitted when the button is clicked' }
        ],
        slots: [
          { name: 'default', description: 'Button content' }
        ]
      },
      '2': {
        id: '2',
        name: 'InputText',
        description: 'Text input field component with validation and styling',
        category: 'form',
        props: [
          { name: 'placeholder', type: 'string', default: '', required: false, description: 'Placeholder text' },
          { name: 'disabled', type: 'boolean', default: false, required: false, description: 'Whether the input is disabled' },
          { name: 'required', type: 'boolean', default: false, required: false, description: 'Whether the input is required' },
          { name: 'maxlength', type: 'number', default: null, required: false, description: 'Maximum character length' },
          { name: 'modelValue', type: 'string', default: '', required: false, description: 'v-model value' }
        ],
        events: [
          { name: 'input', description: 'Emitted when the input value changes' },
          { name: 'blur', description: 'Emitted when the input loses focus' },
          { name: 'focus', description: 'Emitted when the input gains focus' }
        ],
        slots: []
      },
      '3': {
        id: '3',
        name: 'Card',
        description: 'Content container component with header, body, and footer',
        category: 'layout',
        props: [
          { name: 'title', type: 'string', default: '', required: false, description: 'Card title' },
          { name: 'subtitle', type: 'string', default: '', required: false, description: 'Card subtitle' }
        ],
        events: [],
        slots: [
          { name: 'title', description: 'Card title content' },
          { name: 'subtitle', description: 'Card subtitle content' },
          { name: 'content', description: 'Main card content' },
          { name: 'footer', description: 'Card footer content' }
        ]
      }
    }

    // Try API first
    try {
      const response = await fetch(`/api/components/${componentId}`)
      if (response.ok) {
        const data = await response.json()
        component.value = data.component
        return
      }
    } catch (apiError) {
      console.log('API not available, using mock data')
    }

    // Use mock data
    component.value = mockComponents[componentId] || mockComponents['1']

  } catch (error) {
    console.error('Failed to load component:', error)
    // Ultimate fallback
    component.value = {
      id: route.params.id as string,
      name: 'Unknown Component',
      description: 'Component details could not be loaded',
      category: 'unknown'
    }
  } finally {
    loading.value = false
  }
}

function goToAdmin() {
  router.push('/admin/components')
}

function copyImport() {
  const importCode = `import ${component.value.name} from '@/components/${component.value.name}'`
  navigator.clipboard.writeText(importCode)
  // Could show a toast here
}

function goBack() {
  router.push('/docs/components')
}
</script>