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
          <UButton icon="i-lucide-plus" @click="showAddDialog = true">Add Token</UButton>
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
              <UButton
                :loading="extracting"
                :disabled="!selectedFile"
                icon="i-lucide-upload"
                @click="extractFromFile"
              >
                Extract Tokens
              </UButton>
              <UButton
                :disabled="!selectedFile"
                icon="i-lucide-x"
                color="neutral"
                variant="outline"
                @click="clearFile"
              >
                Clear
              </UButton>
            </div>

            <div v-if="extractionResult" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <UIcon name="i-lucide-check-circle" class="text-green-400" />
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
                    <UButton
                      icon="i-lucide-save"
                      size="sm"
                      color="success"
                      @click="saveExtractedTokens"
                    >
                      Save to Database
                    </UButton>
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
          <UButton disabled icon="i-lucide-plus" color="neutral" variant="outline">Add Token Manually</UButton>
        </div>

        <!-- Token List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Token Library ({{ tokens.length }} tokens)</h2>
          </div>

          <div v-if="tokens.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-inbox" class="text-4xl text-gray-400 mb-4" />
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
                      <UIcon name="i-lucide-tag" class="text-xs text-gray-500" />
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
                  <UButton
                    icon="i-lucide-pencil"
                    variant="ghost"
                    size="sm"
                    @click="editToken(token)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    color="error"
                    size="sm"
                    @click="confirmDelete(token)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteConfirm" title="Delete Token">
      <p class="text-gray-600">Are you sure you want to delete token "{{ tokenToDelete?.name }}"?</p>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" color="neutral" @click="showDeleteConfirm = false">Cancel</UButton>
          <UButton color="error" @click="doDelete">Delete</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '#imports'
import AdminSidebar from '@/app/components/admin/AdminSidebar.vue'
import designSystemStorage, { type DesignToken } from '@/design-system/storage'

const toast = useToast()

// State
const loading = ref(false)
const saving = ref(false)
const extracting = ref(false)
const showAddDialog = ref(false)
const showDeleteConfirm = ref(false)
const tokenToDelete = ref<DesignToken | null>(null)
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
      title: 'Error',
      description: 'Failed to load tokens',
      color: 'error'
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
  tokenToDelete.value = token
  showDeleteConfirm.value = true
}

const doDelete = async () => {
  if (!tokenToDelete.value) return
  try {
    await designSystemStorage.deleteToken(tokenToDelete.value.id!)
    toast.add({
      title: 'Success',
      description: 'Token deleted successfully',
      color: 'success'
    })
    await loadTokens()
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to delete token',
      color: 'error'
    })
  } finally {
    showDeleteConfirm.value = false
    tokenToDelete.value = null
  }
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
      title: 'Extraction Complete',
      description: `Successfully extracted ${extractedTokens.length} tokens`,
      color: 'success'
    })
  } catch (error) {
    console.error('Extraction error:', error)
    toast.add({
      title: 'Extraction Failed',
      description: (error as Error).message || 'Failed to extract tokens from file',
      color: 'error'
    })
  } finally {
    extracting.value = false
  }
}

// Resolve token references
const resolveTokenReferences = (value: string, allTokens: DesignToken[]) => {
  const tokenMap: Record<string, string> = {}

  for (const token of allTokens) {
    if (typeof token.value === 'string' && !token.value.includes('{')) {
      const parts = token.name.split('/')
      if (parts.length > 1) {
        tokenMap[parts[1]] = token.value
      }
    }
  }

  const resolveValue = (val: string): string => {
    const refRegex = /\{([^}]+)\}/g
    return val.replace(refRegex, (match, ref) => {
      const resolved = tokenMap[ref]
      return resolved || match
    })
  }

  const evaluateMath = (expr: string): string => {
    try {
      let resolved = resolveValue(expr)
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
      return expr
    }
  }

  return evaluateMath(value)
}

const extractTokensFromData = (data: Record<string, unknown>) => {
  const extractedTokens: DesignToken[] = []

  if (data.tokens && Array.isArray(data.tokens)) {
    return data.tokens as DesignToken[]
  }

  const rawTokens: DesignToken[] = []
  for (const [setName, tokens] of Object.entries(data)) {
    if (setName.startsWith('$')) continue
    if (typeof tokens !== 'object' || tokens === null) continue

    for (const [name, tokenData] of Object.entries(tokens as Record<string, unknown>)) {
      const token = tokenData as Record<string, unknown>
      const value = typeof token.$value === 'string' ? token.$value : String(token.$value || '')

      rawTokens.push({
        id: crypto.randomUUID(),
        name: `${setName}/${name}`,
        value: value,
        type: (token.$type as DesignToken['type']) || 'other',
        category: mapTokenType(token.$type as string),
        description: (token.$description as string) || '',
      })
    }
  }

  for (const token of rawTokens) {
    let processedValue: string | Record<string, unknown> = token.value as string

    if (typeof processedValue === 'string') {
      processedValue = resolveTokenReferences(processedValue, rawTokens)
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
      title: 'Tokens Saved',
      description: 'All extracted tokens have been saved to the database',
      color: 'success'
    })
  } catch (error) {
    console.error('Error saving tokens:', error)
    toast.add({
      title: 'Save Failed',
      description: 'Failed to save extracted tokens',
      color: 'error'
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
