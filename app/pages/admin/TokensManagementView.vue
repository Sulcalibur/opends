<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Design Tokens</h1>
              <p class="text-gray-600">Manage your design system tokens with hierarchical relationships and references.</p>
            </div>
            <Button
              label="Create Token"
              icon="pi pi-plus"
              severity="primary"
              @click="showCreateDialog = true"
            />
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Dropdown
                v-model="filters.category"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Categories"
                class="w-full"
                @change="loadTokens"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <InputText
                v-model="filters.search"
                placeholder="Search tokens..."
                class="w-full"
                @input="debouncedSearch"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Dropdown
                v-model="filters.type"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Types"
                class="w-full"
                @change="loadTokens"
              />
            </div>
            <div class="flex items-end">
              <Button
                label="Clear Filters"
                severity="secondary"
                outlined
                @click="clearFilters"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <ProgressSpinner />
          <p class="mt-4 text-gray-600">Loading tokens...</p>
        </div>

        <!-- Tokens Table -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            :value="tokens"
            :paginator="true"
            :rows="20"
            :totalRecords="totalTokens"
            @page="onPage"
            class="p-datatable-sm"
          >
            <Column field="name" header="Name" style="width: 15%">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <Badge
                    :value="slotProps.data.category"
                    severity="info"
                    class="text-xs"
                  />
                  <code class="text-sm">{{ slotProps.data.name }}</code>
                </div>
              </template>
            </Column>

            <Column field="type" header="Type" style="width: 10%">
              <template #body="slotProps">
                <Badge
                  :value="slotProps.data.type"
                  :severity="getTypeSeverity(slotProps.data.type)"
                  class="text-xs"
                />
              </template>
            </Column>

            <Column field="value" header="Value" style="width: 25%">
              <template #body="slotProps">
                <div class="font-mono text-sm bg-gray-50 px-2 py-1 rounded max-w-xs truncate">
                  {{ formatValue(slotProps.data.value) }}
                </div>
              </template>
            </Column>

            <Column field="path" header="Path" style="width: 20%">
              <template #body="slotProps">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ slotProps.data.path }}</code>
              </template>
            </Column>

            <Column field="description" header="Description">
              <template #body="slotProps">
                <span class="text-sm text-gray-600 truncate max-w-xs block">
                  {{ slotProps.data.description || '-' }}
                </span>
              </template>
            </Column>

            <Column header="Actions" style="width: 15%">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    outlined
                    @click="editToken(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    outlined
                    @click="confirmDelete(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Create/Edit Token Dialog -->
        <Dialog
          v-model:visible="showCreateDialog"
          :header="editingToken ? 'Edit Token' : 'Create Token'"
          modal
          class="p-fluid"
          style="width: 600px"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <InputText
                v-model="tokenForm.name"
                placeholder="token-name"
                :class="{ 'p-invalid': errors.name }"
              />
              <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <Dropdown
                v-model="tokenForm.category"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select category"
                :class="{ 'p-invalid': errors.category }"
              />
              <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Dropdown
                v-model="tokenForm.type"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select type"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Value *</label>
              <Textarea
                v-model="tokenForm.value"
                placeholder="Token value (JSON)"
                rows="3"
                :class="{ 'p-invalid': errors.value }"
              />
              <small v-if="errors.value" class="p-error">{{ errors.value }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <InputText
                v-model="tokenForm.description"
                placeholder="Optional description"
              />
            </div>

            <div v-if="tokenForm.type === 'reference'">
              <label class="block text-sm font-medium text-gray-700 mb-1">References</label>
              <InputText
                v-model="tokenForm.referencesText"
                placeholder="Referenced token IDs (comma-separated)"
              />
            </div>
          </div>

          <template #footer>
            <Button
              label="Cancel"
              severity="secondary"
              outlined
              @click="showCreateDialog = false"
            />
            <Button
              :label="editingToken ? 'Update' : 'Create'"
              severity="primary"
              :loading="saving"
              @click="saveToken"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation -->
        <ConfirmDialog />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

declare global {
  interface Window {
    searchTimeout: ReturnType<typeof setTimeout>
  }
}
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Badge from 'primevue/badge'
import ConfirmDialog from 'primevue/confirmdialog'
import AdminSidebar from '@/app/components/AdminSidebar.vue'

import type { DesignToken } from '@/utils/tokenUtils'
import { validateToken } from '@/utils/tokenValidation'

const confirm = useConfirm()
const toast = useToast()

// State
const tokens = ref<DesignToken[]>([])
const loading = ref(false)
const saving = ref(false)
const totalTokens = ref(0)
const showCreateDialog = ref(false)
const editingToken = ref<DesignToken | null>(null)

// Filters
const filters = reactive({
  category: '',
  search: '',
  type: ''
})

// Form
const tokenForm = reactive({
  name: '',
  category: '',
  type: 'value' as 'value' | 'reference' | 'alias',
  value: '',
  description: '',
  referencesText: ''
})



const errors = reactive({
  name: '',
  category: '',
  value: ''
})

// Options
const categoryOptions = [
  { label: 'Color', value: 'color' },
  { label: 'Typography', value: 'typography' },
  { label: 'Spacing', value: 'spacing' },
  { label: 'Border', value: 'border' },
  { label: 'Shadow', value: 'shadow' },
  { label: 'Other', value: 'other' }
]

const typeOptions = [
  { label: 'Value', value: 'value' },
  { label: 'Reference', value: 'reference' },
  { label: 'Alias', value: 'alias' }
]

// Computed
const currentPage = ref(1)
const pageSize = 20

// Methods
onMounted(() => {
  loadTokens()
})

async function loadTokens() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.type) params.set('type', filters.type)
    params.set('limit', pageSize.toString())
    params.set('offset', ((currentPage.value - 1) * pageSize).toString())

    const response = await fetch(`/api/tokens?${params}`)
    const data = await response.json()

    tokens.value = data.tokens || []
    totalTokens.value = data.total || 0
  } catch (error) {
    console.error('Failed to load tokens:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load tokens',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function debouncedSearch() {
  // Simple debounced search
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadTokens()
  }, 300)
}

function clearFilters() {
  filters.category = ''
  filters.search = ''
  filters.type = ''
  currentPage.value = 1
  loadTokens()
}

function onPage(event: any) {
  currentPage.value = event.page + 1
  loadTokens()
}

function editToken(token: DesignToken) {
  editingToken.value = token
  tokenForm.name = token.name
  tokenForm.category = token.category
  tokenForm.type = token.type
  tokenForm.value = JSON.stringify(token.value, null, 2)
  tokenForm.description = token.description || ''
  tokenForm.referencesText = token.references ? token.references.join(', ') : ''
  showCreateDialog.value = true

  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

function confirmDelete(token: DesignToken) {
  confirm.require({
    message: `Are you sure you want to delete the token "${token.name}"?`,
    header: 'Delete Token',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => deleteToken(token)
  })
}

async function deleteToken(token: DesignToken) {
  try {
    const response = await fetch(`/api/tokens/${token.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Token deleted successfully',
        life: 3000
      })
      loadTokens()
    } else {
      throw new Error('Failed to delete token')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete token',
      life: 3000
    })
  }
}

async function saveToken() {
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Validate form
  if (!tokenForm.name.trim()) {
    errors.name = 'Name is required'
    return
  }

  if (!tokenForm.category) {
    errors.category = 'Category is required'
    return
  }

  if (!tokenForm.value.trim()) {
    errors.value = 'Value is required'
    return
  }

  // Parse value from text
  let parsedValueToSave
  try {
    parsedValueToSave = JSON.parse(tokenForm.value)
  } catch {
    errors.value = 'Value must be valid JSON'
    return
  }

  // Parse references
  let references: string[] | undefined
  if (tokenForm.type === 'reference' && tokenForm.referencesText.trim()) {
    references = tokenForm.referencesText.split(',').map(s => s.trim()).filter(Boolean)
  }

  saving.value = true
  try {
    const tokenData = {
      name: tokenForm.name,
      category: tokenForm.category,
      type: tokenForm.type,
      value: parsedValueToSave,
      description: tokenForm.description,
      references
    }

    let response
    if (editingToken.value) {
      response = await fetch(`/api/tokens/${editingToken.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      })
    } else {
      response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      })
    }

    if (response.ok) {
      toast.add({
        severity: editingToken.value ? 'success' : 'success',
        summary: 'Success',
        detail: `Token ${editingToken.value ? 'updated' : 'created'} successfully`,
        life: 3000
      })

      showCreateDialog.value = false
      resetForm()
      loadTokens()
    } else {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save token')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

function resetForm() {
  editingToken.value = null
  tokenForm.name = ''
  tokenForm.category = ''
  tokenForm.type = 'value'
  tokenForm.value = ''
  tokenForm.description = ''
  tokenForm.referencesText = ''

  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

function formatValue(value: any): string {
  if (typeof value === 'string') {
    return value.length > 50 ? value.substring(0, 50) + '...' : value
  }
  return JSON.stringify(value)
}



function getTypeSeverity(type: string): string {
  switch (type) {
    case 'value': return 'success'
    case 'reference': return 'info'
    case 'alias': return 'warning'
    default: return 'secondary'
  }
}
</script>