<template>
  <div class="component-playground">
    <div class="playground-controls">
      <!-- Framework Selector -->
      <div class="control-group">
        <label class="control-label">Framework:</label>
        <Dropdown
          v-model="selectedFramework"
          :options="frameworkOptions"
          optionLabel="label"
          optionValue="value"
          class="control-select"
        />
      </div>

      <!-- Component Props Controls -->
      <div v-for="prop in componentProps" :key="prop.name" class="control-group">
        <label class="control-label">{{ prop.name }}:</label>

        <!-- String/Number inputs -->
        <InputText
          v-if="prop.type === 'string' || prop.type === 'number'"
          :type="prop.type === 'number' ? 'number' : 'text'"
          v-model="propValues[prop.name]"
          :placeholder="prop.default || prop.name"
          class="control-input"
        />

        <!-- Boolean toggle -->
        <InputSwitch
          v-else-if="prop.type === 'boolean'"
          v-model="propValues[prop.name]"
          class="control-switch"
        />

        <!-- Select for predefined options -->
        <Dropdown
          v-else-if="prop.type === 'select' && prop.options"
          v-model="propValues[prop.name]"
          :options="prop.options"
          class="control-select"
        />

        <!-- Default text input -->
        <InputText
          v-else
          v-model="propValues[prop.name]"
          :placeholder="prop.default || prop.name"
          class="control-input"
        />
      </div>

      <!-- Responsive Toggle -->
      <div class="control-group">
        <label class="control-label">Responsive:</label>
        <InputSwitch v-model="responsiveMode" class="control-switch" />
      </div>
    </div>

    <!-- Component Preview -->
    <div class="playground-preview">
      <div class="preview-container" :class="{ 'responsive-preview': responsiveMode }">
        <div class="preview-content">
          <!-- Loading state -->
          <div v-if="loading" class="component-placeholder">
            <i class="pi pi-spin pi-spinner text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Loading component...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="component-placeholder">
            <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <h3 class="text-lg font-semibold text-red-900">Error</h3>
            <p class="text-red-600">{{ error }}</p>
          </div>

          <!-- Component Preview -->
          <div v-else class="component-preview">
            <!-- Button component preview -->
            <button
              v-if="componentName === 'Button'"
              class="opends-button"
              :class="[
                `opends-button--${propValues.variant || 'primary'}`,
                `opends-button--${propValues.size || 'medium'}`,
                { 'opends-button--disabled': propValues.disabled },
                { 'opends-button--loading': propValues.loading }
              ]"
              :disabled="propValues.disabled || propValues.loading"
            >
              <i v-if="propValues.loading" class="pi pi-spin pi-spinner mr-2"></i>
              <i v-if="propValues.icon && !propValues.loading" :class="`pi pi-${propValues.icon} mr-2`"></i>
              <slot>{{ componentName }}</slot>
            </button>

            <!-- InputText component preview -->
            <input
              v-else-if="componentName === 'InputText'"
              type="text"
              class="opends-input"
              :placeholder="propValues.placeholder || 'Enter text...'"
              :disabled="propValues.disabled"
              :required="propValues.required"
              :maxlength="propValues.maxlength"
              v-model="inputValue"
            />

            <!-- Default placeholder -->
            <div v-else class="component-placeholder">
              <i class="pi pi-box text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-semibold text-gray-900">{{ componentName }}</h3>
              <p class="text-gray-600">Component preview not available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Code -->
    <div class="playground-code">
      <div class="code-header">
        <h4 class="font-semibold text-gray-900">Generated Code</h4>
        <Button
          @click="copyCode"
          icon="pi pi-copy"
          size="small"
          outlined
          label="Copy"
        />
      </div>
      <pre class="code-content"><code>{{ generatedCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Button from 'primevue/button'

interface Props {
  component: string
  frameworks?: string
}

const props = withDefaults(defineProps<Props>(), {
  frameworks: 'vue,react,svelte'
})

const componentName = props.component
const selectedFramework = ref('vue')
const responsiveMode = ref(false)
const propValues = ref<Record<string, any>>({})
const componentProps = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const inputValue = ref('Sample text')

// Framework options
const frameworkOptions = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' }
]

// Fetch component data from API
const fetchComponentData = async () => {
  try {
    loading.value = true
    error.value = null

    // Try to fetch from API, fallback to mock data
    try {
      const response = await fetch(`/api/components/${props.component}`)
      if (response.ok) {
        const data = await response.json()
        if (data.component) {
          componentProps.value = data.component.props || []
          return
        }
      }
    } catch (apiError) {
      console.warn('API fetch failed, using mock data:', apiError)
    }

    // Fallback to mock data
    const mockData = getMockComponentData(props.component)

    if (mockData) {
      componentProps.value = mockData.props || []
    } else {
      // Fallback to basic props
      componentProps.value = [
        { name: 'variant', type: 'string', default: 'primary', options: ['primary', 'secondary', 'outline'] },
        { name: 'size', type: 'string', default: 'medium', options: ['small', 'medium', 'large'] },
        { name: 'disabled', type: 'boolean', default: false }
      ]
    }
  } catch (err) {
    error.value = 'Failed to load component data'
    console.error('Error fetching component data:', err)
  } finally {
    loading.value = false
  }
}

// Mock component data (in production, this comes from the database)
const getMockComponentData = (componentName: string) => {
  const mockComponents: Record<string, any> = {
    'Button': {
      props: [
        { name: 'variant', type: 'string', default: 'primary', options: ['primary', 'secondary', 'outline', 'ghost'] },
        { name: 'size', type: 'string', default: 'medium', options: ['small', 'medium', 'large'] },
        { name: 'disabled', type: 'boolean', default: false },
        { name: 'loading', type: 'boolean', default: false },
        { name: 'icon', type: 'string', default: '' }
      ]
    },
    'InputText': {
      props: [
        { name: 'placeholder', type: 'string', default: '' },
        { name: 'disabled', type: 'boolean', default: false },
        { name: 'required', type: 'boolean', default: false },
        { name: 'maxlength', type: 'number', default: null }
      ]
    }
  }

  return mockComponents[componentName] || null
}

// Initialize prop values
onMounted(async () => {
  await fetchComponentData()
  componentProps.value.forEach(prop => {
    propValues.value[prop.name] = prop.default !== undefined ? prop.default : ''
  })
})

// Generated code based on framework and props
const generatedCode = computed(() => {

  const propsStr = Object.entries(propValues.value)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return selectedFramework.value === 'vue' ? `:${key}="${value}"` : `${key}={${value}}`
      } else if (typeof value === 'string') {
        return selectedFramework.value === 'vue' ? `${key}="${value}"` : `${key}="${value}"`
      }
      return `${key}={${JSON.stringify(value)}}`
    })
    .join(' ')

  switch (selectedFramework.value) {
    case 'vue':
      return `<${componentName} ${propsStr}>\n  <!-- Content -->\n</${componentName}>`

    case 'react':
      return `<${componentName} ${propsStr}>\n  {/* Content */}\n</${componentName}>`

    case 'svelte':
      return `<${componentName} ${propsStr}>\n  <!-- Content -->\n</${componentName}>`

    default:
      return `<!-- Component: ${componentName} -->`
  }
})

const copyCode = () => {
  navigator.clipboard.writeText(generatedCode.value)
  // Could show a toast notification here
}
</script>

<style scoped>
.component-playground {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.playground-controls {
  background: #f9fafb;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.control-input {
  width: 100%;
}

.control-select {
  width: 100%;
}

.control-switch {
  align-self: flex-start;
}

.playground-preview {
  padding: 2rem;
  background: white;
  min-height: 200px;
}

.preview-container {
  max-width: 100%;
}

.responsive-preview {
  max-width: 375px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.preview-content {
  padding: 1rem;
  background: #f9fafb;
}

.component-placeholder {
  text-align: center;
  padding: 2rem;
}

.props-display {
  margin-top: 1rem;
  text-align: left;
}

.props-display pre {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.75rem;
}

.playground-code {
  background: #1f2937;
  color: #f9fafb;
}

.code-header {
  padding: 1rem;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-content {
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Component Preview Styles */
.component-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

/* OpenDS Button Styles */
.opends-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  outline: none;
}

.opends-button--primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.opends-button--primary:hover:not(.opends-button--disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.opends-button--secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.opends-button--secondary:hover:not(.opends-button--disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
}

.opends-button--outline {
  background-color: transparent;
  color: #3b82f6;
  border-color: #3b82f6;
}

.opends-button--outline:hover:not(.opends-button--disabled) {
  background-color: #3b82f6;
  color: white;
}

.opends-button--ghost {
  background-color: transparent;
  color: #3b82f6;
  border-color: transparent;
}

.opends-button--ghost:hover:not(.opends-button--disabled) {
  background-color: #eff6ff;
}

.opends-button--small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.opends-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.opends-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.opends-button--loading {
  cursor: wait;
}

/* OpenDS Input Styles */
.opends-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.opends-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.opends-input:disabled {
  background-color: #f9fafb;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>