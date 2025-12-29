<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DocsSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-4xl mx-auto">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600">Loading component...</p>
        </div>

        <div v-else-if="component" class="space-y-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ component.name }}</h1>
            <p class="text-gray-600 text-lg">{{ component.description || 'A design system component' }}</p>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Component not found</h3>
          <NuxtLink to="/docs/components" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block mt-4">
            Back to Components
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DocsSidebar from '../../components/DocsSidebar.vue'

const route = useRoute()
const router = useRouter()

const component = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const componentId = route.params.id as string

    const mockComponent = {
      id: '1',
      name: 'Button',
      description: 'A versatile button component for user interactions',
      category: 'form'
    }

    component.value = mockComponent
  } catch (error) {
    console.error('Failed to load component:', error)
  } finally {
    loading.value = false
  }
})
</script>
