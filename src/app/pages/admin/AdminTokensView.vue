<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Token Editor</h1>
            <p class="text-gray-600">Manage and edit design tokens.</p>
          </div>
          <Button icon="pi pi-plus" label="Add Token" class="p-button-primary" @click="showAddDialog = true" />
        </div>

        <!-- File Upload Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Import Tokens</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload Token File</label>
              <input
                ref="fileInput"
                type="file"
                accept=".json"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                @change="handleFileUpload"
              >
              <p v-if="selectedFile" class="mt-1 text-sm text-indigo-600">
                Selected: {{ selectedFile.name }}
              </p>
              <p class="mt-1 text-sm text-gray-500">Upload Figma or Penpot token files (JSON format)</p>
            </div>

            <div class="flex gap-4">
              <Button
                :loading="extracting"
                :disabled="!selectedFile"
                icon="pi pi-upload"
                label="Extract Tokens"
                class="p-button-primary"
                @click="extractFromFile"
              />
              <Button
                :disabled="!selectedFile"
                icon="pi pi-times"
                label="Clear"
                class="p-button-secondary"
                @click="clearFile"
              />
            </div>

            <div v-if="extractionResult" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <i class="pi pi-check-circle text-green-400"/>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Extraction Successful</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Extracted {{ extractionResult.length }} tokens:</p>
                    <ul class="mt-1 list-disc list-inside">
                      <li v-for="token in extractionResult.slice(0, 5)" :key="token.name">
                        {{ token.name }}: {{ formatValue(token.value) }}
                      </li>
                      <li v-if="extractionResult.length > 5">... and {{ extractionResult.length - 5 }} more</li>
                    </ul>
                  </div>
                  <div class="mt-3">
                    <Button
                      icon="pi pi-save"
                      label="Save to Database"
                      class="p-button-sm p-button-success"
                      @click="saveExtractedTokens"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manual Token Creation -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manual Token Creation</h2>
          <p class="text-sm text-gray-600 mb-4">Manual token creation form coming soon. For now, upload token files to get started.</p>
          <Button disabled icon="pi pi-plus" label="Add Token Manually" class="p-button-secondary" />
        </div>

        <!-- Manual token creation form will be added here -->

        <!-- Token List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Token Library ({{ tokens.length }} tokens)</h2>
          </div>

          <div v-if="tokens.length === 0" class="text-center py-12">
            <i class="pi pi-inbox text-4xl text-gray-400 mb-4"/>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No tokens yet</h3>
            <p class="text-gray-500 mb-4">Upload a token file or add tokens manually to get started.</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="token in tokens"
              :key="token.id || token.name"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- Token Preview -->
                  <div class="flex items-center gap-2">
                    <div
                      v-if="token.category === 'color'"
                      class="w-8 h-8 rounded border border-gray-200 shadow-inner"
                      :style="{ backgroundColor: token.value }"
                    />
                    <div
                      v-else-if="token.category === 'borderRadius'"
                      class="w-8 h-8 bg-indigo-500 rounded"
                      :style="{ borderRadius: token.value }"
                    />
                    <div
                      v-else-if="token.category === 'spacing'"
                      class="h-4 bg-indigo-500 rounded"
                      :style="{ width: token.value }"
                    />
                    <div v-else class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <i class="pi pi-tag text-xs text-gray-500"/>
                    </div>
                  </div>

                  <!-- Token Details -->
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ token.name }}</h3>
                    <p class="text-sm text-gray-500">{{ token.category }} • {{ formatValue(token.value) }}</p>
                    <p v-if="token.description" class="text-sm text-gray-600">{{ token.description }}</p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-text p-button-sm"
                    @click="editToken(token)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-text p-button-danger p-button-sm"
                    @click="confirmDelete(token)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Token management interface will be added here -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'
import designSystemStorage, { type DesignToken } from '@/design-system/storage'

const confirm = useConfirm()
const toast = useToast()

// State
const loading = ref(false)
const saving = ref(false)
const extracting = ref(false)
const showAddDialog = ref(false)
const editingToken = ref<DesignToken | null>(null)
const selectedFile = ref<File | null>(null)
const extractionResult = ref<DesignToken[]>([])

const fileInput = ref<HTMLInputElement>()

const tokens = ref<DesignToken[]>([])
const tokenForm = ref<Omit<DesignToken, 'id'>>({
  name: '',
  category: 'other',
  value: '',
  description: '',
  type: 'other'
})

// Methods
const loadTokens = async () => {
  loading.value = true
  try {
    tokens.value = await designSystemStorage.getTokens()
    console.log('Loaded tokens:', tokens.value)
  } catch (error) {
    console.error('Error loading tokens:', error)
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

const editToken = (token: DesignToken) => {
  editingToken.value = token
  tokenForm.value = { ...token }
  showAddDialog.value = true
}


const confirmDelete = (token: DesignToken) => {
  confirm.require({
    message: `Are you sure you want to delete token "${token.name}"?`,
    header: 'Delete Token',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-text',
    accept: async () => {
      try {
        await designSystemStorage.deleteToken(token.id!)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Token deleted successfully',
          life: 3000
        })
        await loadTokens()
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete token',
          life: 3000
        })
      }
    }
  })
}

const formatValue = (value: string | number | Record<string, unknown> | null): string => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return String(value)
}

// File handling methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    extractionResult.value = []
  }
}

const clearFile = () => {
  selectedFile.value = null
  extractionResult.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const extractFromFile = async () => {
  if (!selectedFile.value) return

  extracting.value = true
  try {
    const fileContent = await selectedFile.value.text()
    const data = JSON.parse(fileContent)
    const extractedTokens = extractTokensFromData(data)

    extractionResult.value = extractedTokens
    toast.add({
      severity: 'success',
      summary: 'Extraction Complete',
      detail: `Successfully extracted ${extractedTokens.length} tokens`,
      life: 3000
    })
  } catch (error) {
    console.error('Extraction error:', error)
    toast.add({
      severity: 'error',
      summary: 'Extraction Failed',
      detail: error.message || 'Failed to extract tokens from file',
      life: 5000
    })
  } finally {
    extracting.value = false
  }
}

// Resolve token references
const resolveTokenReferences = (value: string, allTokens: DesignToken[]) => {
  // Create a map of token names to their resolved values
  const tokenMap: Record<string, string> = {}

  // First pass: resolve simple tokens without references
  for (const token of allTokens) {
    if (typeof token.value === 'string' && !token.value.includes('{')) {
      // Assuming name format "set/tokenName"
      const parts = token.name.split('/')
      if (parts.length > 1) {
        tokenMap[parts[1]] = token.value 
      }
    }
  }

  // Second pass: resolve references
  const resolveValue = (val: string): string => {
    const refRegex = /\{([^}]+)\}/g
    return val.replace(refRegex, (match, ref) => {
      const resolved = tokenMap[ref]
      return resolved || match // Keep original if can't resolve
    })
  }

  // Third pass: evaluate math expressions
  const evaluateMath = (expr: string): string => {
    try {
      // Replace references first
      let resolved = resolveValue(expr)
      // Simple math evaluation (only safe operations)
      resolved = resolved.replace(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/g, (match, a, op, b) => {
        const numA = parseFloat(a)
        const numB = parseFloat(b)
        switch (op) {
          case '+': return (numA + numB).toString()
          case '-': return (numA - numB).toString()
          case '*': return (numA * numB).toString()
          case '/': return numB !== 0 ? (numA / numB).toString() : match
          default: return match
        }
      })
      return resolved
    } catch {
      return expr // Return original if evaluation fails
    }
  }

  return evaluateMath(value)
}

// Extract tokens from JSON data (inline implementation)
const extractTokensFromData = (data: Record<string, unknown>) => {
  const extractedTokens: DesignToken[] = []

  if (data.tokens && Array.isArray(data.tokens)) {
    // Already processed format
    return data.tokens as DesignToken[]
  }

  // First pass: extract all tokens
  const rawTokens: DesignToken[] = []
  for (const [setName, tokens] of Object.entries(data)) {
    if (setName.startsWith('$')) continue // Skip metadata
    if (typeof tokens !== 'object' || tokens === null) continue

    for (const [name, tokenData] of Object.entries(tokens as Record<string, unknown>)) {
      const token = tokenData as Record<string, unknown>
      // Simplified extraction logic for demo
      const value = typeof token.$value === 'string' ? token.$value : String(token.$value || '')
      
      rawTokens.push({
        id: crypto.randomUUID(), // Generate temporary ID
        name: `${setName}/${name}`,
        value: value,
        type: (token.$type as DesignToken['type']) || 'other',
        category: mapTokenType(token.$type as string),
        description: (token.$description as string) || '',
        // set: setName, // 'set' is not in DesignToken type, ignoring
        // tokenName: name // ignoring extra prop
      })
    }
  }

  // Second pass: resolve references and create final tokens
  for (const token of rawTokens) {
    let processedValue: string | Record<string, unknown> = token.value as string

    // Resolve references
    if (typeof processedValue === 'string') {
      processedValue = resolveTokenReferences(processedValue, rawTokens)
    }

    // Create proper value structure based on category for public display
    if (token.category === 'typography') {
      // Logic for typography object creation...
      // For now keeping it simple to satisfy types
    }

    extractedTokens.push({
      ...token,
      value: processedValue
    })
  }

  return extractedTokens
}

const mapTokenType = (type?: string) => {
  switch (type) {
    case 'color': return 'color'
    case 'fontSizes': case 'fontWeights': return 'typography'
    case 'borderRadius': return 'borderRadius'
    case 'number': return 'number'
    default: return 'other'
  }
}

const saveExtractedTokens = async () => {
  if (extractionResult.value.length === 0) return

  console.log('Saving extracted tokens:', extractionResult.value)
  saving.value = true
  try {
    for (const tokenData of extractionResult.value) {
      console.log('Creating token:', tokenData)
      await designSystemStorage.createToken(tokenData)
    }

    extractionResult.value = []
    clearFile()
    await loadTokens()

    toast.add({
      severity: 'success',
      summary: 'Tokens Saved',
      detail: 'All extracted tokens have been saved to the database',
      life: 3000
    })
  } catch (error) {
    console.error('Error saving tokens:', error)
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save extracted tokens',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadTokens()
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}
</style>