<script setup lang="ts">
/**
 * Milkdown Editor Component
 * A WYSIWYG markdown editor for documentation pages
 * Uses Crepe for batteries-included experience
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

onMounted(async () => {
  if (!editorRef.value) return

  try {
    crepe = new Crepe({
      root: editorRef.value,
      defaultValue: props.modelValue,
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: props.placeholder
        }
      }
    })

    // Listen for changes
    crepe.on((listener) => {
      const content = crepe?.getMarkdown() || ''
      emit('update:modelValue', content)
    })

    await crepe.create()
    loading.value = false
  } catch (e: any) {
    console.error('Failed to initialize Milkdown editor:', e)
    error.value = `Failed to load editor: ${e.message}`
    loading.value = false
  }
})

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (!crepe || loading.value || error.value) return
  
  try {
    const current = crepe.getMarkdown()
    if (newValue !== current) {
      // @ts-ignore - setMarkdown exists in implementation but typescript might miss it in some versions
      if (typeof crepe.setMarkdown === 'function') {
         // @ts-ignore
        crepe.setMarkdown(newValue)
      }
    }
  } catch (e) {
    console.warn('Error updating editor content:', e)
  }
})

onUnmounted(() => {
  crepe?.destroy()
})

defineExpose({
  getMarkdown: () => crepe?.getMarkdown() || ''
})
</script>

<template>
  <div class="milkdown-editor-wrapper relative">
    <div v-if="error" class="absolute inset-0 flex items-center justify-center text-red-500 bg-red-50 p-4 border border-red-200 rounded z-10">
      <i class="pi pi-exclamation-triangle mr-2"></i> {{ error }}
    </div>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50 z-10">
      <i class="pi pi-spin pi-spinner mr-2"></i> Loading editor...
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
