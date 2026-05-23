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
            <UButton
              icon="i-lucide-plus"
              @click="showCreateDialog = true"
            >
              Create Token
            </UButton>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <USelect
                v-model="filters.category"
                :options="categoryOptions"
                label-key="label"
                value-key="value"
                placeholder="All Categories"
                class="w-full"
                @change="loadTokens"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <UInput
                v-model="filters.search"
                placeholder="Search tokens..."
                class="w-full"
                @input="debouncedSearch"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <USelect
                v-model="filters.type"
                :options="typeOptions"
                label-key="label"
                value-key="value"
                placeholder="All Types"
                class="w-full"
                @change="loadTokens"
              />
            </div>
            <div class="flex items-end">
              <UButton
                variant="outline"
                color="neutral"
                @click="clearFilters"
              >
                Clear Filters
              </UButton>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin inline-block"><UIcon name="i-lucide-loader-2" class="text-4xl text-gray-400" /></div>
          <p class="mt-4 text-gray-600">Loading tokens...</p>
        </div>

        <!-- Tokens Table -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <UTable
            :columns="tableColumns"
            :rows="tokens"
          >
            <template #name-data="{ row }">
              <div class="flex items-center gap-2">
                <UBadge :label="row.category" color="info" class="text-xs" />
                <code class="text-sm">{{ row.name }}</code>
              </div>
            </template>
            <template #type-data="{ row }">
              <UBadge :label="row.type" :color="getTypeSeverity(row.type)" class="text-xs" />
            </template>
            <template #value-data="{ row }">
              <div class="font-mono text-sm bg-gray-50 px-2 py-1 rounded max-w-xs truncate">
                {{ formatValue(row.value) }}
              </div>
            </template>
            <template #path-data="{ row }">
              <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ row.path }}</code>
            </template>
            <template #description-data="{ row }">
              <span class="text-sm text-gray-600 truncate max-w-xs block">{{ row.description || '-' }}</span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex gap-2">
                <UButton
                  icon="i-lucide-pencil"
                  color="info"
                  size="sm"
                  variant="outline"
                  @click="editToken(row)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  size="sm"
                  variant="outline"
                  @click="confirmDelete(row)"
                />
              </div>
            </template>
          </UTable>

          <!-- Pagination -->
          <div class="p-4 border-t border-gray-200 flex justify-between items-center">
            <span class="text-sm text-gray-600">Total: {{ totalTokens }} tokens</span>
            <div class="flex gap-2">
              <UButton
                size="sm"
                variant="outline"
                color="neutral"
                :disabled="currentPage === 1"
                @click="onPage(currentPage - 2)"
              >
                Previous
              </UButton>
              <UButton
                size="sm"
                variant="outline"
                color="neutral"
                :disabled="currentPage * pageSize >= totalTokens"
                @click="onPage(currentPage)"
              >
                Next
              </UButton>
            </div>
          </div>
        </div>

        <!-- Create/Edit Token Dialog -->
        <UModal
          v-model="showCreateDialog"
          :title="editingToken ? 'Edit Token' : 'Create Token'"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <UInput
                v-model="tokenForm.name"
                placeholder="token-name"
                :class="{ 'ring-red-500': errors.name }"
              />
              <small v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <USelect
                v-model="tokenForm.category"
                :options="categoryOptions"
                label-key="label"
                value-key="value"
                placeholder="Select category"
                :class="{ 'ring-red-500': errors.category }"
              />
              <small v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <USelect
                v-model="tokenForm.type"
                :options="typeOptions"
                label-key="label"
                value-key="value"
                placeholder="Select type"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Value *</label>
              <UTextarea
                v-model="tokenForm.value"
                placeholder="Token value (JSON)"
                :rows="3"
                :class="{ 'ring-red-500': errors.value }"
              />
              <small v-if="errors.value" class="text-red-500 text-sm">{{ errors.value }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <UInput
                v-model="tokenForm.description"
                placeholder="Optional description"
              />
            </div>

            <div v-if="tokenForm.type === 'reference'">
              <label class="block text-sm font-medium text-gray-700 mb-1">References</label>
              <UInput
                v-model="tokenForm.referencesText"
                placeholder="Referenced token IDs (comma-separated)"
              />
            </div>
          </div>

          <template #footer>
            <div class="flex gap-2 justify-end">
              <UButton
                variant="outline"
                color="neutral"
                @click="showCreateDialog = false"
              >
                Cancel
              </UButton>
              <UButton
                :label="editingToken ? 'Update' : 'Create'"
                :loading="saving"
                @click="saveToken"
              >
                {{ editingToken ? 'Update' : 'Create' }}
              </UButton>
            </div>
          </template>
        </UModal>

        <!-- Delete Confirmation Modal -->
        <UModal v-model="showDeleteConfirm" title="Delete Token">
          <p class="text-gray-600">Are you sure you want to delete the token "{{ tokenToDelete?.name }}"?</p>
          <template #footer>
            <div class="flex gap-2 justify-end">
              <UButton variant="outline" color="neutral" @click="showDeleteConfirm = false">Cancel</UButton>
              <UButton color="error" @click="doDelete">Delete</UButton>
            </div>
          </template>
        </UModal>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '#imports'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'
import type { DesignToken } from '@/utils/tokenUtils'

declare global {
  interface Window {
    searchTimeout: ReturnType<typeof setTimeout>
  }
}

const toast = useToast()

// State
const tokens = ref<DesignToken[]>([])
const loading = ref(false)
const saving = ref(false)
const totalTokens = ref(0)
const showCreateDialog = ref(false)
const showDeleteConfirm = ref(false)
const editingToken = ref<DesignToken | null>(null)
const tokenToDelete = ref<DesignToken | null>(null)

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

// Table columns
const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'path', label: 'Path' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: 'Actions' }
]

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
  } catch {
    console.error('Failed to load tokens')
    toast.add({
      title: 'Error',
      description: 'Failed to load tokens',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function debouncedSearch() {
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

function onPage(page: number) {
  currentPage.value = page + 1
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

  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

function confirmDelete(token: DesignToken) {
  tokenToDelete.value = token
  showDeleteConfirm.value = true
}

async function doDelete() {
  if (!tokenToDelete.value) return
  await deleteToken(tokenToDelete.value)
  showDeleteConfirm.value = false
  tokenToDelete.value = null
}

async function deleteToken(token: DesignToken) {
  try {
    const response = await fetch(`/api/tokens/${token.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      toast.add({
        title: 'Success',
        description: 'Token deleted successfully',
        color: 'success'
      })
      loadTokens()
    } else {
      throw new Error('Failed to delete token')
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to delete token',
      color: 'error'
    })
  }
}

async function saveToken() {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

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

  let parsedValueToSave
  try {
    parsedValueToSave = JSON.parse(tokenForm.value)
  } catch {
    errors.value = 'Value must be valid JSON'
    return
  }

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
        title: 'Success',
        description: `Token ${editingToken.value ? 'updated' : 'created'} successfully`,
        color: 'success'
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
      title: 'Error',
      description: (error as Error).message,
      color: 'error'
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
    errors[key as keyof typeof errors] = ''
  })
}

function formatValue(value: string | number | Record<string, unknown> | null): string {
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
    default: return 'neutral'
  }
}
</script>
