<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DocsSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin inline-block"><UIcon name="i-lucide-loader-2" class="text-4xl text-gray-400" /></div>
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
              <UBadge
                :label="(component.category as string) || 'general'"
                color="info"
                class="text-sm px-3 py-1"
              />
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-4">
              <UButton
                variant="outline"
                icon="i-lucide-external-link"
                @click="goToAdmin"
              >
                View in Admin
              </UButton>
              <UButton
                variant="outline"
                icon="i-lucide-copy"
                @click="copyImport"
              >
                Copy Import
              </UButton>
            </div>
          </div>

          <!-- Interactive Playground -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Interactive Playground</h2>
            <ComponentPlayground
              :component="(component.name as string)"
              frameworks="vue,react,svelte"
            />
          </div>

          <!-- Props Table -->
          <div v-if="component.props && (component.props as unknown[]).length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Props</h2>
            <UTable
              :columns="propColumns"
              :rows="component.props as Record<string, unknown>[]"
            >
              <template #name-data="{ row }">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ row.name }}</code>
              </template>
              <template #type-data="{ row }">
                <UBadge :label="(row.type as string)" color="success" />
              </template>
              <template #default-data="{ row }">
                <code v-if="row.default !== undefined" class="bg-gray-100 px-2 py-1 rounded text-sm">
                  {{ JSON.stringify(row.default) }}
                </code>
                <span v-else class="text-gray-400">-</span>
              </template>
              <template #required-data="{ row }">
                <UBadge
                  :label="row.required ? 'Yes' : 'No'"
                  :color="row.required ? 'warning' : 'success'"
                />
              </template>
              <template #description-data="{ row }">
                {{ row.description || '-' }}
              </template>
            </UTable>
          </div>

          <!-- Events Table -->
          <div v-if="component.events && (component.events as unknown[]).length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Events</h2>
            <UTable
              :columns="eventColumns"
              :rows="component.events as Record<string, unknown>[]"
            >
              <template #name-data="{ row }">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ row.name }}</code>
              </template>
              <template #description-data="{ row }">
                {{ row.description || '-' }}
              </template>
            </UTable>
          </div>

          <!-- Slots Table -->
          <div v-if="component.slots && (component.slots as unknown[]).length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Slots</h2>
            <UTable
              :columns="slotColumns"
              :rows="component.slots as Record<string, unknown>[]"
            >
              <template #name-data="{ row }">
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ row.name }}</code>
              </template>
              <template #description-data="{ row }">
                {{ row.description || '-' }}
              </template>
            </UTable>
          </div>

          <!-- Usage Examples -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>

            <UTabs :items="exampleTabs">
              <template #item="{ item }">
                <div class="bg-gray-50 rounded-lg p-4 mt-4">
                  <pre class="text-sm overflow-x-auto"><code>{{ item.content }}</code></pre>
                </div>
              </template>
            </UTabs>
          </div>
        </div>

        <!-- Not found -->
        <div v-else class="text-center py-12">
          <UIcon name="i-lucide-alert-triangle" class="text-4xl text-red-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Component not found</h3>
          <p class="text-gray-600">The requested component could not be found.</p>
          <UButton
            class="mt-4"
            @click="goBack"
          >
            Back to Components
          </UButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocsSidebar from '@/app/components/DocsSidebar.vue'
import ComponentPlayground from '@/design-system/components/ComponentPlayground.vue'

const route = useRoute()
const router = useRouter()

const component = ref<Record<string, unknown> | null>(null)
const loading = ref(true)

const propColumns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'default', label: 'Default' },
  { key: 'required', label: 'Required' },
  { key: 'description', label: 'Description' }
]

const eventColumns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' }
]

const slotColumns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' }
]

const vueExample = computed(() => {
  return `// Vue 3 Example
<template>
  <button>
    Click me
  </button>
</template>

<script setup>
// import Button from '@/components/Button.vue'
<` + `/script>`
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
<` + `/script>

<button>
  Click me
</button>`
})

const exampleTabs = computed(() => [
  { label: 'Vue', content: vueExample.value },
  { label: 'React', content: reactExample.value },
  { label: 'Svelte', content: svelteExample.value }
])

onMounted(async () => {
  await loadComponent()
})

async function loadComponent() {
  try {
    const componentId = route.params.id as string

    const mockComponents: Record<string, unknown> = {
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
          { name: 'icon', type: 'string', default: '', required: false, description: 'Lucide icon name' }
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

    try {
      const response = await fetch(`/api/components/${componentId}`)
      if (response.ok) {
        const data = await response.json()
        component.value = data.component
        return
      }
    } catch {
      console.log('API not available, using mock data')
    }

    component.value = mockComponents[componentId] || mockComponents['1']

  } catch (error) {
    console.error('Failed to load component:', error)
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
  const importCode = `import ${component.value?.name} from '@/components/${component.value?.name}'`
  navigator.clipboard.writeText(importCode)
}

function goBack() {
  router.push('/docs/components')
}
</script>
