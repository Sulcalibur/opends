<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Component Manager</h1>
            <p class="text-gray-600">Manage and organize your design system components.</p>
          </div>
          <div class="flex gap-4">
            <Button @click="$router.push('/admin/codegen')" icon="pi pi-plus" label="Add Component" class="p-button-primary" />
            <Button @click="$router.push('/admin/codegen')" icon="pi pi-code" label="Generate Code" class="p-button-secondary" />
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex gap-4 items-center">
            <InputText
              v-model="searchQuery"
              placeholder="Search components..."
              class="flex-1"
              icon="pi pi-search"
            />
            <Dropdown
              v-model="selectedCategory"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Categories"
              class="w-48"
            />
          </div>
        </div>

        <!-- Component Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="component in filteredComponents"
            :key="component.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ component.name }}</h3>
                <Badge :value="component.category" class="text-xs" />
              </div>
              <div class="flex gap-2 ml-4">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  @click="editComponent(component)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger p-button-sm"
                  @click="confirmDelete(component)"
                />
              </div>
            </div>

            <p v-if="component.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ component.description }}
            </p>

            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>Props: {{ component.props?.length || 0 }}</span>
              <span>Slots: {{ component.slots?.length || 0 }}</span>
              <span>Events: {{ component.events?.length || 0 }}</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredComponents.length === 0" class="col-span-full">
            <div class="text-center py-12">
              <i class="pi pi-box text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No components found</h3>
              <p class="text-gray-500 mb-4">
                {{ searchQuery || selectedCategory ? 'Try adjusting your search filters.' : 'Get started by adding your first component.' }}
              </p>
              <Button @click="showCreateDialog = true" label="Add First Component" class="p-button-primary" />
            </div>
          </div>
        </div>

        <!-- Component creation and editing features coming soon -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'
import axios from 'axios'

const toast = useToast()



// State
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const showCreateDialog = ref(false)

// Types
interface Component {
  id: string
  name: string
  category: string
  description: string
  props: any[]
  slots: any[]
  events: any[]
}

const components = ref<Component[]>([])

const categoryOptions = [
  { label: 'Layout', value: 'layout' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Forms', value: 'forms' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Data Display', value: 'data' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Other', value: 'other' }
]

// Computed
const filteredComponents = computed(() => {
  return components.value.filter(component => {
    const matchesSearch = !searchQuery.value ||
      component.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = !selectedCategory.value || component.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

// Methods
const loadComponents = async () => {
  loading.value = true
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
  } finally {
    loading.value = false
  }
}

const editComponent = (component: Component) => {
  // TODO: Implement edit functionality
  console.log('Edit component', component)
}

const confirmDelete = (component: Component) => {
  // TODO: Implement delete confirmation
  console.log('Delete component', component)
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