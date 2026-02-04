<script setup lang="ts">
/**
 * Milkdown Editor Component
 * A WYSIWYG markdown editor for documentation pages
 * Uses Crepe for batteries-included experience
 */
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Crepe } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

interface Props {
  modelValue?: string
  placeholder?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start writing your documentation...',
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
let crepe: Crepe | null = null
let isReady = false
let updateTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  if (!editorRef.value) {
    error.value = 'Editor container not found'
    loading.value = false
    return
  }

  await nextTick()

  try {
    // Ensure defaultValue is always a string
    const initialValue = props.modelValue || ''
    
    crepe = new Crepe({
      root: editorRef.value,
      defaultValue: initialValue,
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: props.placeholder
        }
      }
    })

    // Create the editor
    await crepe.create()
    
    // Wait a bit more to ensure full initialization
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Mark as ready
    isReady = true
    loading.value = false

    // Set up a polling mechanism to detect content changes
    // This is safer than relying on the listener which may fire too early
    const checkForChanges = () => {
      if (!isReady || !crepe) return
      
      try {
        const currentContent = crepe.getMarkdown()
        if (currentContent !== props.modelValue) {
          emit('update:modelValue', currentContent)
        }
      } catch (e) {
        // Silently ignore - editor might not be fully ready yet
      }
      
      // Continue polling
      if (isReady) {
        updateTimeout = setTimeout(checkForChanges, 500)
      }
    }
    
    // Start polling after a short delay
    setTimeout(checkForChanges, 500)
    
  } catch (e: any) {
    console.error('Failed to initialize Milkdown editor:', e)
    error.value = `Failed to load editor: ${e.message}`
    loading.value = false
    isReady = false
  }
})

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (!crepe || !isReady || loading.value || error.value) return
  
  try {
    const current = crepe.getMarkdown()
    if (newValue !== current) {
      // @ts-ignore
      if (typeof crepe.setMarkdown === 'function') {
        // @ts-ignore
        crepe.setMarkdown(newValue || '')
      }
    }
  } catch (e) {
    console.warn('Error updating editor content:', e)
  }
})

onUnmounted(() => {
  isReady = false
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  crepe?.destroy()
})

defineExpose({
  getMarkdown: () => {
    if (!isReady || !crepe) return ''
    try {
      return crepe.getMarkdown()
    } catch {
      return ''
    }
  }
})
</script>

<template>
  <div class="milkdown-editor-wrapper relative">
    <div v-if="error" class="absolute inset-0 flex items-center justify-center text-red-500 bg-red-50 p-4 border border-red-200 rounded z-10">
      <i class="pi pi-exclamation-triangle mr-2"/> {{ error }}
    </div>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50 z-10">
      <i class="pi pi-spin pi-spinner mr-2"/> Loading editor...
    </div>
    <div ref="editorRef" class="milkdown-editor" />
  </div>
</template>

<style scoped>
.milkdown-editor-wrapper {
  width: 100%;
  min-height: 500px;
  /* Fallback border */
  border: 1px solid #e2e8f0; 
  border-radius: 8px;
  background: white;
  position: relative;
}

.milkdown-editor {
  min-height: 500px;
  height: 100%;
}

/* Dark mode support */
:root.dark .milkdown-editor-wrapper {
  border-color: var(--surface-border, #374151);
  background: var(--surface-card, #1f2937);
}
</style>
