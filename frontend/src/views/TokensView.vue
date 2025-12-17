<template>
  <div class="tokens-view">
    <div class="view-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Design Tokens</h1>
          <p class="text-surface-600 dark:text-surface-400 mt-2">
            Manage your design system tokens (colors, spacing, typography, etc.)
          </p>
        </div>
        <Button 
          label="Add Token" 
          icon="pi pi-plus" 
          severity="primary"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <div class="view-content mt-8">
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-palette text-primary-500"></i>
            <span>Design Tokens</span>
          </div>
        </template>
        <template #content>
          <TabView>
            <TabPanel header="Colors">
              <div class="space-y-6">
                <div v-for="colorGroup in colorTokens" :key="colorGroup.category">
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    {{ colorGroup.category }}
                  </h3>
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div 
                      v-for="token in colorGroup.tokens" 
                      :key="token.name"
                      class="color-token-card p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow"
                      @click="editToken(token)"
                    >
                      <div 
                        class="color-preview w-full h-16 rounded mb-3 border border-surface-300 dark:border-surface-600"
                        :style="{ backgroundColor: token.value }"
                      />
                      <div class="font-medium text-sm truncate">{{ token.name }}</div>
                      <div class="text-xs text-surface-500 dark:text-surface-400 truncate">
                        {{ token.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel header="Spacing">
              <DataTable :value="spacingTokens" class="p-datatable-sm">
                <Column field="name" header="Name" sortable />
                <Column field="value" header="Value" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-24 h-8 rounded border border-surface-300 dark:border-surface-600 flex items-center justify-center"
                        :style="{ width: data.value }"
                      >
                        <span class="text-xs">{{ data.value }}</span>
                      </div>
                      <span>{{ data.value }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="category" header="Category" sortable />
                <Column header="Actions">
                  <template #body="{ data }">
                    <div class="flex gap-2">
                      <Button 
                        icon="pi pi-pencil" 
                        severity="secondary" 
                        size="small"
                        @click="editToken(data)"
                      />
                      <Button 
                        icon="pi pi-trash" 
                        severity="danger" 
                        size="small"
                        @click="deleteToken(data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
            
            <TabPanel header="Typography">
              <DataTable :value="typographyTokens" class="p-datatable-sm">
                <Column field="name" header="Name" sortable />
                <Column field="value" header="Value" sortable>
                  <template #body="{ data }">
                    <div :style="{ 
                      fontFamily: data.fontFamily,
                      fontSize: data.fontSize,
                      fontWeight: data.fontWeight,
                      lineHeight: data.lineHeight 
                    }">
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </template>
                </Column>
                <Column field="category" header="Category" sortable />
                <Column header="Actions">
                  <template #body="{ data }">
                    <div class="flex gap-2">
                      <Button 
                        icon="pi pi-pencil" 
                        severity="secondary" 
                        size="small"
                        @click="editToken(data)"
                      />
                      <Button 
                        icon="pi pi-trash" 
                        severity="danger" 
                        size="small"
                        @click="deleteToken(data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
            
            <TabPanel header="All Tokens">
              <DataTable :value="allTokens" class="p-datatable-sm" :paginator="true" :rows="10">
                <Column field="name" header="Name" sortable />
                <Column field="value" header="Value" sortable />
                <Column field="type" header="Type" sortable />
                <Column field="category" header="Category" sortable />
                <Column field="source" header="Source" sortable />
                <Column header="Actions">
                  <template #body="{ data }">
                    <div class="flex gap-2">
                      <Button 
                        icon="pi pi-pencil" 
                        severity="secondary" 
                        size="small"
                        @click="editToken(data)"
                      />
                      <Button 
                        icon="pi pi-trash" 
                        severity="danger" 
                        size="small"
                        @click="deleteToken(data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabView>
        </template>
      </Card>
    </div>

    <!-- Add/Edit Token Dialog -->
    <Dialog 
      v-model:visible="showAddDialog" 
      modal 
      :header="editingToken ? 'Edit Token' : 'Add Token'"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Name
          </label>
          <InputText 
            v-model="tokenForm.name" 
            placeholder="e.g., primary-500"
            class="w-full"
          />
        </div>

        <div class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Type
          </label>
          <Dropdown 
            v-model="tokenForm.type" 
            :options="tokenTypes" 
            optionLabel="label"
            optionValue="value"
            placeholder="Select type"
            class="w-full"
          />
        </div>

        <div class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Category
          </label>
          <InputText 
            v-model="tokenForm.category" 
            placeholder="e.g., colors, spacing, typography"
            class="w-full"
          />
        </div>

        <div class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Value
          </label>
          <InputText 
            v-model="tokenForm.value" 
            :placeholder="getValuePlaceholder(tokenForm.type)"
            class="w-full"
          />
        </div>

        <div v-if="tokenForm.type === 'color'" class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Color Preview
          </label>
          <div class="flex items-center gap-4">
            <div 
              class="w-16 h-16 rounded border border-surface-300 dark:border-surface-600"
              :style="{ backgroundColor: tokenForm.value }"
            />
            <ColorPicker 
              v-model="tokenForm.value" 
              format="hex"
            />
          </div>
        </div>

        <div class="field">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Description
          </label>
          <Textarea 
            v-model="tokenForm.description" 
            rows="3" 
            placeholder="Optional description"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="cancelEdit"
          />
          <Button 
            :label="editingToken ? 'Update' : 'Add Token'" 
            severity="primary" 
            :disabled="!canSaveToken"
            @click="saveToken"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ColorPicker from 'primevue/colorpicker'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const showAddDialog = ref(false)
const editingToken = ref(false)

const tokenForm = ref({
  name: '',
  type: 'color',
  category: '',
  value: '',
  description: '',
})

const tokenTypes = [
  { label: 'Color', value: 'color' },
  { label: 'Spacing', value: 'spacing' },
  { label: 'Typography', value: 'typography' },
  { label: 'Border Radius', value: 'border-radius' },
  { label: 'Box Shadow', value: 'box-shadow' },
  { label: 'Opacity', value: 'opacity' },
  { label: 'Z-Index', value: 'z-index' },
]

// Mock data
const colorTokens = ref([
  {
    category: 'Primary',
    tokens: [
      { name: 'primary-50', value: '#eff6ff', type: 'color', category: 'colors/primary' },
      { name: 'primary-100', value: '#dbeafe', type: 'color', category: 'colors/primary' },
      { name: 'primary-500', value: '#3b82f6', type: 'color', category: 'colors/primary' },
      { name: 'primary-900', value: '#1e3a8a', type: 'color', category: 'colors/primary' },
    ]
  },
  {
    category: 'Neutral',
    tokens: [
      { name: 'surface-50', value: '#f8fafc', type: 'color', category: 'colors/neutral' },
      { name: 'surface-100', value: '#f1f5f9', type: 'color', category: 'colors/neutral' },
      { name: 'surface-500', value: '#64748b', type: 'color', category: 'colors/neutral' },
      { name: 'surface-900', value: '#0f172a', type: 'color', category: 'colors/neutral' },
    ]
  }
])

const spacingTokens = ref([
  { name: 'spacing-xs', value: '0.25rem', type: 'spacing', category: 'spacing' },
  { name: 'spacing-sm', value: '0.5rem', type: 'spacing', category: 'spacing' },
  { name: 'spacing-md', value: '1rem', type: 'spacing', category: 'spacing' },
  { name: 'spacing-lg', value: '1.5rem', type: 'spacing', category: 'spacing' },
  { name: 'spacing-xl', value: '2rem', type: 'spacing', category: 'spacing' },
])

const typographyTokens = ref([
  { 
    name: 'font-family-base', 
    value: 'Inter, system-ui, sans-serif',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5',
    type: 'typography', 
    category: 'typography' 
  },
  { 
    name: 'font-size-sm', 
    value: '0.875rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.25',
    type: 'typography', 
    category: 'typography' 
  },
  { 
    name: 'font-size-lg', 
    value: '1.125rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '1.125rem',
    fontWeight: '500',
    lineHeight: '1.75',
    type: 'typography', 
    category: 'typography' 
  },
])

const allTokens = computed(() => {
  const tokens = []
  
  // Add color tokens
  colorTokens.value.forEach(group => {
    tokens.push(...group.tokens)
  })
  
  // Add spacing tokens
  tokens.push(...spacingTokens.value)
  
  // Add typography tokens
  tokens.push(...typographyTokens.value)
  
  return tokens
})

const canSaveToken = computed(() => {
  return tokenForm.value.name.trim() && tokenForm.value.value.trim()
})

function getValuePlaceholder(type: string) {
  switch (type) {
    case 'color': return '#3b82f6'
    case 'spacing': return '1rem or 16px'
    case 'typography': return 'Inter, system-ui, sans-serif'
    case 'border-radius': return '0.5rem'
    case 'box-shadow': return '0 1px 3px rgba(0,0,0,0.1)'
    default: return 'Enter value'
  }
}

function editToken(token: any) {
  tokenForm.value = { ...token }
  editingToken.value = true
  showAddDialog.value = true
}

function deleteToken(token: any) {
  // TODO: Implement delete
  console.log('Delete token:', token.name)
  toast.add({
    severity: 'info',
    summary: 'Delete Token',
    detail: `Would delete token "${token.name}"`,
    life: 3000,
  })
}

function saveToken() {
  if (!canSaveToken.value) return
  
  // TODO: Implement save
  console.log('Save token:', tokenForm.value)
  
  toast.add({
    severity: 'success',
    summary: 'Token Saved',
    detail: `Token "${tokenForm.value.name}" saved successfully`,
    life: 3000,
  })
  
  cancelEdit()
}

function cancelEdit() {
  tokenForm.value = {
    name: '',
    type: 'color',
    category: '',
    value: '',
    description: '',
  }
  editingToken.value = false
  showAddDialog.value = false
}

onMounted(() => {
  // Load tokens from API
})
</script>

<style scoped>
.tokens-view {
  @apply p-6;
}

.view-header {
  @apply mb-8;
}

.color-token-card {
  @apply cursor-pointer transition-all duration-200;
}

.color-token-card:hover {
  @apply transform -translate-y-0.5;
}
</style>