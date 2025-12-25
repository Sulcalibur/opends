<template>
  <div class="component-preview">
    <div class="preview-controls mb-4">
      <h3 class="text-lg font-semibold mb-2">Component Preview</h3>

      <!-- Prop Editor -->
      <div v-if="componentSpec && componentSpec.props" class="mb-4">
        <h4 class="text-md font-medium mb-2">Props</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="prop in componentSpec.props"
            :key="prop.name"
            class="prop-editor"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ prop.name }}
              <span v-if="prop.required" class="text-red-500">*</span>
            </label>

            <!-- String input -->
            <input
              v-if="prop.type === 'string'"
              v-model="previewProps[prop.name]"
              type="text"
              :placeholder="prop.default || getExampleValue(prop)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Number input -->
            <input
              v-if="prop.type === 'number'"
              v-model.number="previewProps[prop.name]"
              type="number"
              :placeholder="prop.default || getExampleValue(prop)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Boolean checkbox -->
            <label v-if="prop.type === 'boolean'" class="flex items-center">
              <input
                v-model="previewProps[prop.name]"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm text-gray-600">{{ prop.name }}</span>
            </label>

            <!-- Select for options -->
            <select
              v-if="prop.options && prop.options.length"
              v-model="previewProps[prop.name]"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select {{ prop.name }}</option>
              <option
                v-for="option in prop.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>

            <div v-if="prop.description" class="text-xs text-gray-500 mt-1">
              {{ prop.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Variant Selector -->
      <div v-if="componentSpec && componentSpec.variants" class="mb-4">
        <h4 class="text-md font-medium mb-2">Variants</h4>
        <select
          v-model="selectedVariant"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default</option>
          <option
            v-for="variant in componentSpec.variants"
            :key="variant.name"
            :value="variant.name"
          >
            {{ variant.name }}
          </option>
        </select>
      </div>

      <!-- Responsive Modes -->
      <div class="mb-4">
        <h4 class="text-md font-medium mb-2">Preview Mode</h4>
        <div class="flex gap-2">
          <button
            v-for="mode in previewModes"
            :key="mode.name"
            @click="selectedMode = mode"
            :class="[
              'px-3 py-1 rounded text-sm',
              selectedMode.name === mode.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Area -->
    <div
      class="preview-area border border-gray-300 rounded-lg p-4 bg-gray-50"
      :style="previewStyle"
    >
      <div v-if="!componentSpec" class="text-gray-500 text-center py-8">
        No component specification provided
      </div>
      <component
        v-else
        :is="renderedComponent"
        v-bind="previewProps"
      />
    </div>

    <!-- Accessibility Check -->
    <div v-if="componentSpec" class="mt-4">
      <button
        @click="runAccessibilityCheck"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Check Accessibility
      </button>
      <div v-if="accessibilityResult" class="mt-2 p-3 rounded"
           :class="accessibilityResult.score === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
        <div class="font-medium">Accessibility Score: {{ accessibilityResult.score }}</div>
        <ul v-if="accessibilityResult.issues.length" class="mt-1 text-sm">
          <li v-for="issue in accessibilityResult.issues" :key="issue.message">
            <span :class="issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'">
              {{ issue.type === 'error' ? '❌' : '⚠️' }}
            </span>
            {{ issue.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import {
  renderComponent,
  validateComponentProps,
  generatePreviewProps,
  checkComponentAccessibility
} from '../../utils/componentRenderer.js'

// Props
const props = defineProps({
  componentSpec: {
    type: Object,
    required: true
  }
})

// Reactive data
const previewProps = ref({})
const selectedVariant = ref('')
const selectedMode = ref({
  name: 'desktop',
  label: 'Desktop',
  width: '100%',
  maxWidth: 'none'
})
const accessibilityResult = ref(null)

// Preview modes
const previewModes = [
  { name: 'mobile', label: 'Mobile', width: '375px', maxWidth: '375px' },
  { name: 'tablet', label: 'Tablet', width: '768px', maxWidth: '768px' },
  { name: 'desktop', label: 'Desktop', width: '100%', maxWidth: 'none' }
]

// Computed
const previewStyle = computed(() => ({
  width: selectedMode.value.width,
  maxWidth: selectedMode.value.maxWidth,
  margin: selectedMode.value.name === 'desktop' ? '0' : '0 auto'
}))

const renderedComponent = computed(() => {
  if (!props.componentSpec) return null

  // For now, return a simple div - in a real implementation,
  // this would dynamically create the component
  return 'div'
})

// Methods
function getExampleValue(prop) {
  if (prop.default !== undefined) return prop.default

  switch (prop.type) {
    case 'string': return prop.name.includes('label') ? 'Example Label' : 'Example'
    case 'number': return 1
    case 'boolean': return false
    default: return ''
  }
}

function runAccessibilityCheck() {
  if (!props.componentSpec) return

  accessibilityResult.value = checkComponentAccessibility(props.componentSpec, previewProps.value)
}

// Initialize
function initializePreview() {
  if (!props.componentSpec) return

  // Generate initial props
  previewProps.value = generatePreviewProps(props.componentSpec)

  // Reset variant selection
  selectedVariant.value = ''
}

// Watch for spec changes
watch(() => props.componentSpec, initializePreview, { immediate: true })

// Watch for variant changes
watch(selectedVariant, (newVariant) => {
  if (!props.componentSpec || !newVariant) return

  const variant = props.componentSpec.variants?.find(v => v.name === newVariant)
  if (variant && variant.props) {
    previewProps.value = { ...previewProps.value, ...variant.props }
  }
})
</script>

<style scoped>
.component-preview {
  @apply bg-white rounded-lg shadow-sm;
}

.preview-controls {
  @apply p-6 border-b border-gray-200;
}

.preview-area {
  @apply min-h-32 flex items-center justify-center;
}
</style>