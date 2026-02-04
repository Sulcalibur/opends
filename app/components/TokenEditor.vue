/**
 * Token Editor Component
 * Visual editor for different token types
 */

<template>
  <div class="token-editor">
    <!-- Color Token Editor -->
    <div v-if="token.category === 'color'" class="color-editor">
      <div class="flex items-center gap-4 mb-4">
        <div
          class="w-16 h-16 rounded-lg border-2 border-gray-300"
          :style="{ backgroundColor: colorValue }"
        />
        <div>
          <InputText
            v-model="colorValue"
            placeholder="#000000"
            class="w-32"
            @input="updateColorValue"
          />
          <div class="text-sm text-gray-500 mt-1">
            Current: {{ token.value }}
          </div>
        </div>
      </div>

      <!-- Color Picker -->
      <div class="grid grid-cols-8 gap-2 mb-4">
        <button
          v-for="preset in colorPresets"
          :key="preset"
          class="w-8 h-8 rounded border-2"
          :class="colorValue === preset ? 'border-blue-500' : 'border-gray-300'"
          :style="{ backgroundColor: preset }"
          @click="colorValue = preset"
        />
      </div>
    </div>

    <!-- Typography Token Editor -->
    <div v-else-if="token.category === 'typography'" class="typography-editor">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Preview</label>
          <div
            class="p-4 border rounded-lg bg-gray-50"
            :style="typographyStyles"
          >
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <div v-if="isFontFamily" class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Family</label>
            <Dropdown
              v-model="fontFamily"
              :options="fontOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <InputText
              v-model="fontSize"
              placeholder="16px"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <Dropdown
              v-model="fontWeight"
              :options="weightOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>

        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <InputText
            v-model="typographyValue"
            :placeholder="getTypographyPlaceholder()"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Spacing Token Editor -->
    <div v-else-if="token.category === 'spacing'" class="spacing-editor">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Visual Preview</label>
          <div class="flex items-center gap-4">
            <div class="w-4 h-16 bg-blue-500 rounded"/>
            <div
              class="h-16 bg-blue-100 border-2 border-blue-200 rounded flex items-center justify-center"
              :style="{ width: spacingValue }"
            >
              <span class="text-xs text-blue-800 font-mono">{{ spacingValue }}</span>
            </div>
            <div class="w-4 h-16 bg-blue-500 rounded"/>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <InputText
            v-model="spacingValue"
            placeholder="1rem"
            class="w-48"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Presets</label>
          <div class="flex gap-2 flex-wrap">
            <Button
              v-for="preset in spacingPresets"
              :key="preset"
              :label="preset"
              size="small"
              outlined
              @click="spacingValue = preset"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Generic Token Editor -->
    <div v-else class="generic-editor">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <Textarea
            v-model="genericValue"
            :placeholder="getGenericPlaceholder()"
            rows="3"
            class="w-full"
          />
        </div>

        <div v-if="token.type === 'reference'" class="border-t pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Referenced Tokens</label>
          <div v-if="token.references && token.references.length > 0" class="space-y-2">
            <div
              v-for="refId in token.references"
              :key="refId"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <i class="pi pi-link text-gray-500"/>
              <code class="text-sm">{{ refId }}</code>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">
            No references set
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DesignToken } from '@/utils/tokenUtils'

interface Props {
  token: DesignToken
  modelValue: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const colorValue = ref(typeof props.token.value === 'string' ? props.token.value : '#000000')
const typographyValue = ref(JSON.stringify(props.token.value, null, 2))
const spacingValue = ref(typeof props.token.value === 'string' ? props.token.value : '1rem')
const genericValue = ref(JSON.stringify(props.token.value, null, 2))

// Presets
const colorPresets = [
  '#000000', '#ffffff', '#f3f4f6', '#6b7280', '#3b82f6',
  '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
]

const spacingPresets = [
  '0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem',
  '2rem', '3rem', '4rem', '6rem', '8rem'
]

const fontOptions = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'System', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'monospace' }
]

const weightOptions = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' }
]

// Computed
const isFontFamily = computed(() => {
  return props.token.name.toLowerCase().includes('font') &&
         props.token.name.toLowerCase().includes('family')
})

const fontFamily = computed({
  get: () => {
    if (typeof props.token.value === 'string') {
      return props.token.value.split(',')[0].trim()
    }
    return ''
  },
  set: (value) => {
    updateTypography('family', value)
  }
})

const fontSize = computed({
  get: () => {
    if (props.token.name.toLowerCase().includes('size')) {
      return props.token.value
    }
    return ''
  },
  set: (value) => {
    updateTypography('size', value)
  }
})

const fontWeight = computed({
  get: () => {
    if (props.token.name.toLowerCase().includes('weight')) {
      return props.token.value
    }
    return '400'
  },
  set: (value) => {
    updateTypography('weight', value)
  }
})

const typographyStyles = computed(() => {
  if (typeof props.token.value === 'string') {
    if (props.token.name.toLowerCase().includes('family')) {
      return { fontFamily: props.token.value }
    } else if (props.token.name.toLowerCase().includes('size')) {
      return { fontSize: props.token.value }
    } else if (props.token.name.toLowerCase().includes('weight')) {
      return { fontWeight: props.token.value }
    }
  }
  return {}
})

// Watchers
watch(colorValue, (newValue) => {
  if (props.token.category === 'color') {
    emit('update:modelValue', newValue)
  }
})

watch(typographyValue, (newValue) => {
  try {
    const parsed = JSON.parse(newValue)
    emit('update:modelValue', parsed)
  } catch {
    // Invalid JSON, don't update
  }
})

watch(spacingValue, (newValue) => {
  if (props.token.category === 'spacing') {
    emit('update:modelValue', newValue)
  }
})

watch(genericValue, (newValue) => {
  try {
    const parsed = JSON.parse(newValue)
    emit('update:modelValue', parsed)
  } catch {
    // Invalid JSON, don't update
  }
})

// Methods
function updateColorValue() {
  if (props.token.category === 'color') {
    emit('update:modelValue', colorValue.value)
  }
}

function updateTypography(type: string, value: string) {
  if (props.token.category === 'typography') {
    emit('update:modelValue', value)
  }
}

function getTypographyPlaceholder() {
  if (props.token.name.toLowerCase().includes('size')) {
    return '16px'
  } else if (props.token.name.toLowerCase().includes('weight')) {
    return '400'
  } else if (props.token.name.toLowerCase().includes('family')) {
    return '"Inter", sans-serif'
  }
  return 'Typography value'
}

function getGenericPlaceholder() {
  switch (props.token.category) {
    case 'border': return '1px solid #e5e7eb'
    case 'shadow': return '0 1px 3px rgba(0, 0, 0, 0.1)'
    case 'opacity': return '0.8'
    default: return 'Token value as JSON'
  }
}
</script>