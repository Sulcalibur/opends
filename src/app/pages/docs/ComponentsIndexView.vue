<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DocsSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Components</h1>
          <p class="text-gray-600">Interactive component documentation with live examples and code generation.</p>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <UInput
            v-model="searchQuery"
            placeholder="Search components..."
            class="w-full"
            icon="i-lucide-search"
            @input="filterComponents"
          />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin inline-block"><UIcon name="i-lucide-loader-2" class="text-4xl text-gray-400" /></div>
          <p class="mt-4 text-gray-600">Loading components...</p>
        </div>

        <!-- Components Grid -->
        <div v-else-if="filteredComponents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="component in filteredComponents"
            :key="component.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            @click="viewComponent(component)"
          >
            <div class="p-6">
              <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <UIcon name="i-lucide-box" class="text-xl" />
              </div>

              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ component.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ component.description || 'A design system component' }}</p>

              <div class="flex items-center justify-between">
                <UBadge
                  :label="component.category || 'general'"
                  color="info"
                  class="text-xs"
                />
                <span class="text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View Docs →
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div v-else class="text-center py-12">
          <UIcon name="i-lucide-search" class="text-4xl text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No components found</h3>
          <p class="text-gray-600">Try adjusting your search query.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DocsSidebar from '@/app/components/DocsSidebar.vue'

interface Component {
  id: string
  name: string
  description?: string
  category?: string
}

const router = useRouter()
const searchQuery = ref('')
const components = ref<Component[]>([])
const loading = ref(true)

const filteredComponents = computed(() => {
  if (!searchQuery.value) return components.value

  const query = searchQuery.value.toLowerCase()
  return components.value.filter(comp =>
    comp.name.toLowerCase().includes(query) ||
    comp.description?.toLowerCase().includes(query) ||
    comp.category?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadComponents()
})

async function loadComponents() {
  try {
    const response = await fetch('/api/components')
    if (response.ok) {
      const data = await response.json()
      components.value = data.components || []
    } else {
      components.value = [
        { id: '1', name: 'Button', description: 'A versatile button component with multiple variants and sizes', category: 'form' },
        { id: '2', name: 'InputText', description: 'Text input field component with validation and styling', category: 'form' },
        { id: '3', name: 'Card', description: 'Content container component with header, body, and footer', category: 'layout' },
        { id: '4', name: 'DataTable', description: 'Advanced data table with sorting, filtering, and pagination', category: 'data' },
        { id: '5', name: 'Modal', description: 'Dialog overlay component for confirmations and forms', category: 'overlay' }
      ]
    }
  } catch (error) {
    console.error('Failed to load components:', error)
    components.value = [
      { id: '1', name: 'Button', description: 'A versatile button component with multiple variants and sizes', category: 'form' },
      { id: '2', name: 'InputText', description: 'Text input field component with validation and styling', category: 'form' },
      { id: '3', name: 'Card', description: 'Content container component with header, body, and footer', category: 'layout' }
    ]
  } finally {
    loading.value = false
  }
}

function filterComponents() {
  // Filtering is handled by the computed property
}

function viewComponent(component: Component) {
  router.push(`/docs/components/${component.id}`)
}
</script>
