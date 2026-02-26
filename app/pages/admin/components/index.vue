<template>
  <div class="components-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Components</h1>
        <p class="page-subtitle">Manage your design system components</p>
      </div>
      <Button icon="pi pi-plus" label="New Component" @click="showCreateDialog = true" />
    </div>

    <!-- Filters -->
    <Card class="filters-card">
      <template #content>
        <div class="filters">
          <InputText 
            v-model="searchQuery" 
            placeholder="Search components..." 
            class="search-input"
          >
            <template #prefix>
              <i class="pi pi-search"/>
            </template>
          </InputText>
          
          <Dropdown 
            v-model="selectedCategory" 
            :options="categories" 
            placeholder="All Categories"
            class="category-filter"
            show-clear
          />
          
          <Dropdown 
            v-model="selectedStatus" 
            :options="statuses" 
            placeholder="All Statuses"
            class="status-filter"
            show-clear
          />
        </div>
      </template>
    </Card>

    <!-- Components Grid -->
    <div v-if="filteredComponents.length > 0" class="components-grid">
      <Card 
        v-for="component in filteredComponents" 
        :key="component.id" 
        class="component-card"
      >
        <template #header>
          <div class="card-image">
            <img v-if="component.preview_url" :src="component.preview_url" alt="Preview" >
            <div v-else class="placeholder-image">
              <i class="pi pi-image"/>
            </div>
          </div>
        </template>
        <template #title>
          {{ component.display_name || component.name }}
        </template>
        <template #subtitle>
          <div class="component-meta">
            <Tag :value="component.category" severity="info" />
            <Tag :value="component.status" :severity="getStatusSeverity(component.status)" />
          </div>
        </template>
        <template #content>
          <p class="component-description">
            {{ component.description || 'No description provided' }}
          </p>
        </template>
        <template #footer>
          <div class="card-actions">
            <Button icon="pi pi-pencil" text @click="editComponent(component)" />
            <Button icon="pi pi-eye" text @click="viewComponent(component)" />
            <Button icon="pi pi-trash" text severity="danger" @click="deleteComponent(component)" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="pi pi-box empty-icon"/>
      <h3 class="empty-title">No components yet</h3>
      <p class="empty-text">Create your first component to get started</p>
      <Button icon="pi pi-plus" label="Create Component" @click="showCreateDialog = true" />
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      :header="editingComponent ? 'Edit Component' : 'New Component'"
      :style="{ width: '600px' }"
      modal
    >
      <div class="dialog-form">
        <div class="form-field">
          <label for="name">Component Name *</label>
          <InputText id="name" v-model="form.name" placeholder="e.g., Button" />
        </div>

        <div class="form-field">
          <label for="display_name">Display Name</label>
          <InputText id="display_name" v-model="form.display_name" placeholder="e.g., Primary Button" />
        </div>

        <div class="form-field">
          <label for="category">Category</label>
          <Dropdown 
            id="category" 
            v-model="form.category" 
            :options="categories" 
            placeholder="Select category"
            editable
          />
        </div>

        <div class="form-field">
          <label for="status">Status</label>
          <Dropdown 
            id="status" 
            v-model="form.status" 
            :options="statuses" 
            placeholder="Select status"
          />
        </div>

        <div class="form-field">
          <label for="description">Description</label>
          <Textarea 
            id="description" 
            v-model="form.description" 
            rows="3"
            placeholder="Describe this component..."
          />
        </div>

        <div class="form-field">
          <label for="preview_url">Preview URL</label>
          <InputText id="preview_url" v-model="form.preview_url" placeholder="https://..." />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="closeDialog" />
        <Button 
          :label="editingComponent ? 'Update' : 'Create'" 
          :loading="saving"
          @click="saveComponent" 
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Component {
  id: string
  name: string
  display_name: string
  description: string
  category: string
  status: 'draft' | 'review' | 'approved' | 'deprecated'
  preview_url?: string
  spec: any
}

const showCreateDialog = ref(false)
const editingComponent = ref<Component | null>(null)
const saving = ref(false)
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedStatus = ref(null)
const loading = ref(false)

const form = ref({
  name: '',
  display_name: '',
  description: '',
  category: '',
  status: 'draft',
  preview_url: '',
  spec: {}
})

const categories = [
  'Form',
  'Navigation',
  'Layout',
  'Data Display',
  'Feedback',
  'Overlay',
  'Media',
  'Misc'
]

const statuses = ['draft', 'review', 'approved', 'deprecated']

const components = ref<Component[]>([])
const api = useApi()

const filteredComponents = computed(() => {
  return components.value.filter(c => {
    const matchesSearch = !searchQuery.value || 
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.display_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = !selectedCategory.value || c.category === selectedCategory.value
    const matchesStatus = !selectedStatus.value || c.status === selectedStatus.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

function getStatusSeverity(status: string) {
  const map: Record<string, any> = {
    draft: 'secondary',
    review: 'warning',
    approved: 'success',
    deprecated: 'danger'
  }
  return map[status] || 'info'
}

function editComponent(component: Component) {
  editingComponent.value = component
  form.value = { 
    ...component,
    preview_url: component.preview_url || ''
  }
  showCreateDialog.value = true
}

function viewComponent(component: Component) {
  navigateTo(`/admin/components/${component.id}`)
}

async function deleteComponent(component: Component) {
  if (confirm(`Delete ${component.name}?`)) {
    try {
      await api.delete(`/components/${component.id}`)
      components.value = components.value.filter(c => c.id !== component.id)
    } catch (error: any) {
      alert('Failed to delete component: ' + error.message)
    }
  }
}

async function saveComponent() {
  saving.value = true
  try {
    if (editingComponent.value) {
      // Update existing
      const updated = await api.put(`/components/${editingComponent.value.id}`, form.value)
      const index = components.value.findIndex(c => c.id === editingComponent.value!.id)
      if (index !== -1) {
        components.value[index] = updated.component
      }
    } else {
      // Create new
      const created = await api.post('/components', form.value)
      components.value.unshift(created.component)
    }
    closeDialog()
  } catch (error: any) {
    alert('Failed to save component: ' + error.message)
  } finally {
    saving.value = false
  }
}

function closeDialog() {
  showCreateDialog.value = false
  editingComponent.value = null
  form.value = {
    name: '',
    display_name: '',
    description: '',
    category: '',
    status: 'draft',
    preview_url: '',
    spec: {}
  }
}

async function loadComponents() {
  loading.value = true
  try {
    const response = await api.get('/components')
    components.value = response.components || []
  } catch (error: any) {
    console.error('Failed to load components:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadComponents()
})
</script>

<style scoped>
.components-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.filters-card {
  margin-bottom: 2rem;
}

.filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
}

.search-input {
  min-width: 300px;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.component-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.component-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-image {
  height: 200px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem 1rem 0 0;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 3rem;
  color: #cbd5e1;
}

.component-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.component-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 1rem 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.empty-text {
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #0f172a;
}

:deep(.p-card-content) {
  padding: 1.25rem;
}

:deep(.p-card-footer) {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
}

:deep(.p-dialog-content),
:deep(.p-dialog-header),
:deep(.p-dialog-footer) {
  background: white !important;
}

:deep(.p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

:deep(.p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}
</style>
