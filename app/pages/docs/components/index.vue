<template>
  <div class="min-h-screen bg-gray-50 flex">
    <ViewerSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Components</h1>
          <p class="text-gray-600">Reusable building blocks for your application.</p>
        </div>
        
        <div class="mb-6 flex flex-col md:flex-row gap-4">
          <span class="relative flex-1 max-w-md">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <InputText 
              v-model="searchQuery" 
              placeholder="Search components..." 
              class="w-full pl-10"
            />
          </span>
          <Dropdown 
            v-model="selectedCategory" 
            :options="categoryOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="Category"
            class="w-48"
          />
        </div>
        
        <div v-if="loading" class="text-center py-12">
          <ProgressSpinner style="width: 40px; height: 40px" />
        </div>
        
        <div v-else-if="filteredComponents.length === 0" class="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <p class="text-gray-500">No components found.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="component in filteredComponents" 
            :key="component.name"
            class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
            @click="viewComponent(component)"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                <i class="pi pi-box"></i>
              </div>
              <h3 class="font-bold text-sm text-gray-900">{{ component.name }}</h3>
            </div>
            
            <p v-if="component.description" class="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">
              {{ component.description }}
            </p>
            
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
              <span class="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                {{ component.props?.length || 0 }} props
              </span>
              <span class="text-indigo-600 text-xs font-medium group-hover:underline">View Details -></span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Component Detail Dialog -->
    <Dialog 
      v-model:visible="showComponentDialog" 
      modal 
      :header="selectedComponent ? selectedComponent.name : 'Details'"
      :style="{ width: '800px', maxWidth: '90vw' }"
      class="p-dialog-simple"
      :draggable="false"
    >
      <div v-if="selectedComponent" class="py-2 space-y-6">
        <p class="text-gray-600 text-sm leading-relaxed">{{ selectedComponent.description }}</p>
        
        <div v-if="selectedComponent.props?.length">
          <h4 class="text-sm font-bold text-gray-900 mb-3">Props</h4>
          <div class="border rounded-lg overflow-hidden border-gray-200">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                <tr>
                  <th class="px-4 py-2">Name</th>
                  <th class="px-4 py-2">Type</th>
                  <th class="px-4 py-2">Default</th>
                  <th class="px-4 py-2">Required</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="prop in selectedComponent.props" :key="prop.name">
                  <td class="px-4 py-3 font-mono text-indigo-600 font-medium">{{ prop.name }}</td>
                  <td class="px-4 py-3 text-gray-600 font-mono text-xs">{{ prop.type }}</td>
                  <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ prop.default || '-' }}</td>
                  <td class="px-4 py-3">
                    <span v-if="prop.required" class="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">YES</span>
                    <span v-else class="text-[10px] font-bold text-gray-400">NO</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
         <div v-if="selectedComponent.examples?.length">
          <h4 class="text-sm font-bold text-gray-900 mb-3">Example</h4>
          <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto border border-gray-200">
             <pre class="text-xs text-gray-800 font-mono">{{ selectedComponent.examples[0] }}</pre>
           </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import designSystemStorage from '@/design-system/storage'
import type { ComponentSpec } from '@/design-system/storage'
import ViewerSidebar from '@/app/components/ViewerSidebar.vue'

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const loading = ref(true)
const components = ref<ComponentSpec[]>([])
const selectedComponent = ref<ComponentSpec | null>(null)
const showComponentDialog = ref(false)

const categoryOptions = [
  { label: 'All Categories', value: null },
  { label: 'Buttons', value: 'button' },
  { label: 'Forms', value: 'form' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Layout', value: 'layout' }
]

const filteredComponents = computed(() => {
  let filtered = components.value
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    )
  }
  if (selectedCategory.value) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(selectedCategory.value!)
    )
  }
  return filtered
})

function viewComponent(component: ComponentSpec) {
  selectedComponent.value = component
  showComponentDialog.value = true
}

async function loadComponents() {
  try {
    loading.value = true
    components.value = designSystemStorage.getComponents()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadComponents()
})
</script>