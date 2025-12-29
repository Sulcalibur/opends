<template>
  <div class="tokens-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Design Tokens</h1>
        <p class="page-subtitle">Manage colors, typography, spacing, and more</p>
      </div>
      <div class="header-actions">
        <input 
          type="file" 
          ref="fileInput" 
          accept=".json" 
          @change="importTokens" 
          style="display: none"
        />
        <Button 
          icon="pi pi-download" 
          label="Export" 
          severity="secondary"
          outlined
          :loading="exporting"
          @click="exportTokens" 
        />
        <Button 
          icon="pi pi-upload" 
          label="Import" 
          severity="secondary"
          outlined
          :loading="importing"
          @click="$refs.fileInput.click()" 
        />
        <Button icon="pi pi-plus" label="New Token" @click="showCreateDialog = true" />
      </div>
    </div>

    <!-- Token Categories -->
    <div class="token-categories">
      <button 
        v-for="cat in tokenCategories" 
        :key="cat.value"
        :class="['category-btn', { active: selectedTokenCategory === cat.value }]"
        @click="selectedTokenCategory = cat.value"
      >
        <i :class="cat.icon"></i>
        <span>{{ cat.label }}</span>
        <span class="count">{{ getTokenCount(cat.value) }}</span>
      </button>
    </div>

    <!-- Tokens Table -->
    <Card class="tokens-table-card">
      <template #content>
        <DataTable 
          :value="filteredTokens" 
          :rows="20"
          :paginator="filteredTokens.length > 20"
          responsive-layout="scroll"
        >
          <Column field="name" header="Name" :sortable="true">
            <template #body="{ data }">
              <div class="token-name-cell">
                <code class="token-code">{{ data.name }}</code>
              </div>
            </template>
          </Column>

          <Column field="value" header="Value">
            <template #body="{ data }">
              <div class="token-value-cell">
                <div 
                  v-if="data.category === 'color'" 
                  class="color-preview"
                  :style="{ background: getColorValue(data.value) }"
                ></div>
                <span v-if="data.category === 'color'">{{ getColorValue(data.value) }}</span>
                <span v-else>{{ formatTokenValue(data.value) }}</span>
              </div>
            </template>
          </Column>

          <Column field="category" header="Category">
            <template #body="{ data }">
              <Tag :value="data.category" :severity="getCategorySeverity(data.category)" />
            </template>
          </Column>

          <Column field="description" header="Description">
            <template #body="{ data }">
              <span class="token-description">{{ data.description || '-' }}</span>
            </template>
          </Column>

          <Column header="Actions" :style="{ width: '120px' }">
            <template #body="{ data }">
              <div class="table-actions">
                <Button icon="pi pi-pencil" text size="small" @click="editToken(data)" />
                <Button icon="pi pi-trash" text size="small" severity="danger" @click="deleteToken(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Create/Edit Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      :header="editingToken ? 'Edit Token' : 'New Design Token'"
      :style="{ width: '600px' }"
      modal
    >
      <div class="dialog-form">
        <div class="form-field">
          <label for="token-name">Token Name *</label>
          <InputText 
            id="token-name" 
            v-model="tokenForm.name" 
            placeholder="e.g., primary-500"
          />
          <small class="field-hint">Use kebab-case for token names</small>
        </div>

        <div class="form-field">
          <label for="token-category">Category *</label>
          <Dropdown 
            id="token-category" 
            v-model="tokenForm.category" 
            :options="tokenCategories.map(c => c.value)"
            placeholder="Select category"
          />
        </div>

        <div class="form-field" v-if="tokenForm.category === 'color'">
          <label for="token-color">Color Value *</label>
          <div class="color-input-group">
            <ColorPicker v-model="tokenForm.colorValue" format="hex" />
            <InputText 
              id="token-color" 
              v-model="tokenForm.colorValue" 
              placeholder="#000000"
            />
          </div>
        </div>

        <div class="form-field" v-else-if="tokenForm.category === 'spacing'">
          <label for="token-spacing">Spacing Value *</label>
          <div class="spacing-input-group">
            <InputNumber 
              v-model="tokenForm.numericValue" 
              :min="0"
              :max="1000"
              suffix="px"
            />
          </div>
        </div>

        <div class="form-field" v-else-if="tokenForm.category === 'fontSize'">
          <label for="token-fontsize">Font Size *</label>
          <InputNumber 
            v-model="tokenForm.numericValue" 
            :min="8"
            :max="128"
            suffix="px"
          />
        </div>

        <div class="form-field" v-else-if="tokenForm.category === 'fontFamily'">
          <label for="token-font">Font Family *</label>
          <InputText 
            id="token-font" 
            v-model="tokenForm.stringValue" 
            placeholder="e.g., Inter, sans-serif"
          />
        </div>

        <div class="form-field" v-else>
          <label for="token-value">Value *</label>
          <Textarea 
            id="token-value" 
            v-model="tokenForm.stringValue" 
            rows="3"
            placeholder="Enter token value..."
          />
        </div>

        <div class="form-field">
          <label for="token-description">Description</label>
          <Textarea 
            id="token-description" 
            v-model="tokenForm.description" 
            rows="2"
            placeholder="Describe this token..."
          />
        </div>

        <!-- Preview -->
        <div v-if="tokenForm.category === 'color' && tokenForm.colorValue" class="token-preview">
          <label>Preview</label>
          <div class="color-preview-large" :style="{ background: tokenForm.colorValue }">
            <span class="preview-text" :style="{ color: isLightColor(tokenForm.colorValue) ? '#000' : '#fff' }">
              Aa
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="closeDialog" />
        <Button 
          :label="editingToken ? 'Update' : 'Create'" 
          :loading="saving"
          @click="saveToken" 
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

interface DesignToken {
  id: string
  name: string
  category: string
  value: any
  description?: string
}

const showCreateDialog = ref(false)
const editingToken = ref<DesignToken | null>(null)
const saving = ref(false)
const selectedTokenCategory = ref('all')
const loading = ref(false)
const exporting = ref(false)
const importing = ref(false)

const tokenForm = ref({
  name: '',
  category: '',
  colorValue: '#3b82f6',
  numericValue: 16,
  stringValue: '',
  description: ''
})

const tokenCategories = [
  { label: 'All', value: 'all', icon: 'pi pi-th-large' },
  { label: 'Colors', value: 'color', icon: 'pi pi-palette' },
  { label: 'Spacing', value: 'spacing', icon: 'pi pi-arrows-alt' },
  { label: 'Typography', value: 'fontSize', icon: 'pi pi-font' },
  { label: 'Font Family', value: 'fontFamily', icon: 'pi pi-align-left' },
  { label: 'Border Radius', value: 'borderRadius', icon: 'pi pi-circle' },
  { label: 'Shadow', value: 'shadow', icon: 'pi pi-sun' }
]

const tokens = ref<DesignToken[]>([])
const api = useApi()

const filteredTokens = computed(() => {
  if (selectedTokenCategory.value === 'all') {
    return tokens.value
  }
  return tokens.value.filter(t => t.category === selectedTokenCategory.value)
})

function getTokenCount(category: string) {
  if (category === 'all') return tokens.value.length
  return tokens.value.filter(t => t.category === category).length
}

function getColorValue(value: any): string {
  return value?.hex || value?.rgb || value || '#000000'
}

function formatTokenValue(value: any): string {
  if (typeof value === 'object') {
    if (value.px) return `${value.px}px`
    if (value.rem) return `${value.rem}rem`
    return JSON.stringify(value)
  }
  return String(value)
}

function getCategorySeverity(category: string) {
  const map: Record<string, any> = {
    color: 'info',
    spacing: 'success',
    fontSize: 'warning',
    fontFamily: 'secondary'
  }
  return map[category] || 'info'
}

function isLightColor(hex: string): boolean {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luma > 128
}

function editToken(token: DesignToken) {
  editingToken.value = token
  tokenForm.value = {
    name: token.name,
    category: token.category,
    colorValue: getColorValue(token.value),
    numericValue: token.value?.px || 16,
    stringValue: typeof token.value === 'string' ? token.value : '',
    description: token.description || ''
  }
  showCreateDialog.value = true
}

async function deleteToken(token: DesignToken) {
  if (confirm(`Delete ${token.name}?`)) {
    try {
      await api.delete(`/tokens/${token.id}`)
      tokens.value = tokens.value.filter(t => t.id !== token.id)
    } catch (error: any) {
      alert('Failed to delete token: ' + error.message)
    }
  }
}

async function saveToken() {
  saving.value = true
  try {
    let value: any
    
    if (tokenForm.value.category === 'color') {
      value = { hex: tokenForm.value.colorValue }
    } else if (['spacing', 'fontSize', 'borderRadius'].includes(tokenForm.value.category)) {
      value = { px: tokenForm.value.numericValue }
    } else {
      value = tokenForm.value.stringValue
    }

    const tokenData = {
      name: tokenForm.value.name,
      category: tokenForm.value.category,
      value,
      description: tokenForm.value.description
    }

    if (editingToken.value) {
      const updated = await api.put(`/tokens/${editingToken.value.id}`, tokenData)
      const index = tokens.value.findIndex(t => t.id === editingToken.value!.id)
      if (index !== -1) tokens.value[index] = updated.token
    } else {
      const created = await api.post('/tokens', tokenData)
      tokens.value.unshift(created.token)
    }

    closeDialog()
  } catch (error: any) {
    alert('Failed to save token: ' + error.message)
  } finally {
    saving.value = false
  }
}

function closeDialog() {
  showCreateDialog.value = false
  editingToken.value = null
  tokenForm.value = {
    name: '',
    category: '',
    colorValue: '#3b82f6',
    numericValue: 16,
    stringValue: '',
    description: ''
  }
}

async function loadTokens() {
  loading.value = true
  try {
    const response = await api.get('/tokens')
    tokens.value = response.tokens || []
  } catch (error: any) {
    console.error('Failed to load tokens:', error)
  } finally {
    loading.value = false
  }
}

async function exportTokens() {
  exporting.value = true
  try {
    const response = await api.get('/tokens/export')
    const dataStr = JSON.stringify(response.tokens, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `design-tokens-${Date.now()}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  } catch (error: any) {
    alert('Failed to export tokens: ' + error.message)
  } finally {
    exporting.value = false
  }
}

async function importTokens(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  importing.value = true
  try {
    const file = input.files[0]
    const text = await file.text()
    const tokensData = JSON.parse(text)

    const result = await api.post('/tokens/import', { tokens: tokensData })
    
    alert(`Import complete!\nImported: ${result.imported}\nSkipped: ${result.skipped}\nErrors: ${result.errors.length}`)
    
    await loadTokens()
  } catch (error: any) {
    alert('Failed to import tokens: ' + error.message)
  } finally {
    importing.value = false
    input.value = ''
  }
}

onMounted(async () => {
  await loadTokens()
})
</script>

<style scoped>
.tokens-page {
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

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.token-categories {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.category-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
}

.category-btn .count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.tokens-table-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.token-name-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.token-code {
  font-family: 'Monaco', 'Courier New', monospace;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #3b82f6;
}

.token-value-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 2px solid #e2e8f0;
}

.token-description {
  color: #64748b;
  font-size: 0.875rem;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
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

.field-hint {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
}

.color-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-preview-large {
  width: 100%;
  height: 120px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
}

.preview-text {
  font-size: 3rem;
  font-weight: 700;
}

:deep(.p-datatable) {
  font-size: 0.875rem;
}

:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
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
  padding: 1.5rem;
}

:deep(.p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}
</style>
