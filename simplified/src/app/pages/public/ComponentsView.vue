<template>
  <div class="components-view">
    <div class="container">
      <h1>Components</h1>
      <p class="text-color-secondary mb-6">
        Browse and explore the components in your design system.
      </p>
      
      <div class="mb-6">
        <div class="flex align-items-center justify-content-between mb-4">
          <div class="flex align-items-center gap-2">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <InputText 
                v-model="searchQuery" 
                placeholder="Search components..." 
                class="w-20rem"
              />
            </span>
            <Dropdown 
              v-model="selectedCategory" 
              :options="categoryOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Filter by category"
              class="w-15rem"
            />
          </div>
          <Button 
            icon="pi pi-filter-slash" 
            severity="secondary" 
            size="small"
            @click="clearFilters"
            v-tooltip="'Clear filters'"
          />
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <ProgressSpinner />
        </div>
        
        <div v-else-if="filteredComponents.length === 0" class="text-center py-8">
          <i class="pi pi-box text-3xl text-color-secondary mb-3"></i>
          <p class="text-color-secondary">No components found</p>
          <p class="text-sm text-color-secondary mt-1">
            {{ searchQuery ? 'Try a different search term' : 'Components will appear here when added' }}
          </p>
        </div>
        
        <div v-else class="grid">
          <div 
            v-for="component in filteredComponents" 
            :key="component.name"
            class="col-12 md:col-6 lg:col-4"
          >
            <Card class="component-card h-full">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-box text-primary"></i>
                  <span>{{ component.name }}</span>
                </div>
              </template>
              <template #content>
                <div class="flex flex-column gap-3">
                  <div v-if="component.description" class="text-sm text-color-secondary">
                    {{ component.description }}
                  </div>
                  
                  <div class="flex flex-wrap gap-1">
                    <Badge 
                      v-for="prop in component.props?.slice(0, 3)" 
                      :key="prop.name"
                      :value="prop.name"
                      severity="info"
                    />
                    <Badge 
                      v-if="component.props && component.props.length > 3"
                      :value="`+${component.props.length - 3}`"
                      severity="secondary"
                    />
                  </div>
                  
                  <div class="flex gap-2 mt-2">
                    <Button 
                      label="View Details" 
                      severity="secondary" 
                      size="small"
                      @click="viewComponent(component)"
                    />
                    <Button 
                      icon="pi pi-code" 
                      severity="secondary" 
                      size="small"
                      @click="viewCode(component)"
                      v-tooltip="'View code'"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
      
      <Card class="mt-6">
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            <span>About Components</span>
          </div>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h4 class="mb-2">Component-Driven Development</h4>
              <p class="text-color-secondary">
                Components are reusable building blocks for your user interface. 
                Each component has defined props, slots, and events that make it 
                predictable and easy to use across your application.
              </p>
            </div>
            <div class="col-12 md:col-6">
              <h4 class="mb-2">Usage Guidelines</h4>
              <p class="text-color-secondary">
                Components should be used consistently according to their documentation. 
                Follow the examples and usage guidelines to ensure visual and functional 
                consistency across your product.
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Component Detail Dialog -->
    <Dialog 
      v-model:visible="showComponentDialog" 
      modal 
      :header="selectedComponent ? `Component: ${selectedComponent.name}` : 'Component Details'"
      :style="{ width: '700px', maxWidth: '90vw' }"
    >
      <div v-if="selectedComponent" class="flex flex-column gap-4">
        <!-- Component Description -->
        <div v-if="selectedComponent.description" class="p-3 surface-50 border-round">
          <p>{{ selectedComponent.description }}</p>
        </div>
        
        <!-- Props -->
        <div v-if="selectedComponent.props && selectedComponent.props.length > 0">
          <h4 class="mb-3">Props</h4>
          <div class="surface-50 border-round overflow-hidden">
            <div class="p-3 surface-100 border-bottom-1 surface-border">
              <div class="grid text-sm font-medium">
                <div class="col-4">Name</div>
                <div class="col-3">Type</div>
                <div class="col-3">Default</div>
                <div class="col-2">Required</div>
              </div>
            </div>
            <div 
              v-for="prop in selectedComponent.props" 
              :key="prop.name"
              class="p-3 border-bottom-1 surface-border"
            >
              <div class="grid text-sm">
                <div class="col-4 font-medium">{{ prop.name }}</div>
                <div class="col-3">
                  <Tag :value="prop.type" severity="info" size="small" />
                </div>
                <div class="col-3">
                  <code v-if="prop.default !== undefined">{{ prop.default }}</code>
                  <span v-else class="text-color-secondary">-</span>
                </div>
                <div class="col-2">
                  <Tag 
                    :value="prop.required ? 'Yes' : 'No'" 
                    :severity="prop.required ? 'danger' : 'success'" 
                    size="small"
                  />
                </div>
              </div>
              <div v-if="prop.description" class="text-sm text-color-secondary mt-1">
                {{ prop.description }}
              </div>
              <div v-if="prop.values" class="flex flex-wrap gap-1 mt-1">
                <Badge 
                  v-for="value in prop.values" 
                  :key="value"
                  :value="value"
                  severity="secondary"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Examples -->
        <div v-if="selectedComponent.examples && selectedComponent.examples.length > 0">
          <h4 class="mb-3">Examples</h4>
          <div class="flex flex-column gap-2">
            <div 
              v-for="(example, index) in selectedComponent.examples" 
              :key="index"
              class="p-3 surface-50 border-round"
            >
              <pre class="m-0 text-sm"><code>{{ example }}</code></pre>
            </div>
          </div>
        </div>
        
        <!-- Usage Notes -->
        <div v-if="selectedComponent.usage" class="p-3 surface-50 border-round">
          <h4 class="mb-2">Usage</h4>
          <p class="text-sm text-color-secondary">{{ selectedComponent.usage }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import designSystemStorage from '@/design-system/storage'
import type { ComponentSpec } from '@/design-system/storage'

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
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.description?.toLowerCase().includes(query)
    )
  }
  
  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(component => 
      component.name.toLowerCase().includes(selectedCategory.value!)
    )
  }
  
  return filtered
})

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = null
}

function viewComponent(component: ComponentSpec) {
  selectedComponent.value = component
  showComponentDialog.value = true
}

function viewCode(component: ComponentSpec) {
  // In a real implementation, this would show code examples
  console.log('View code for:', component.name)
}

async function loadComponents() {
  try {
    loading.value = true
    components.value = designSystemStorage.getComponents()
  } catch (error) {
    console.error('Failed to load components:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadComponents()
})
</script>

<style scoped>
.components-view {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.component-card {
  transition: transform 0.2s ease;
}

.component-card:hover {
  transform: translateY(-4px);
}
</style>