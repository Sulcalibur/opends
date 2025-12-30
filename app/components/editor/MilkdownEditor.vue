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
let crepe: Crepe | null = null

onMounted(async () => {
  if (!editorRef.value) return

  crepe = new Crepe({
    root: editorRef.value,
    defaultValue: props.modelValue,
    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: props.placeholder
      }
    }
  })

  // Listen for changes and emit
  crepe.on((ctx) => {
    const content = crepe?.getMarkdown() || ''
    emit('update:modelValue', content)
  })

  await crepe.create()
})

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (crepe && newValue !== crepe.getMarkdown()) {
    crepe.setMarkdown(newValue)
  }
})

onUnmounted(() => {
  crepe?.destroy()
})

// Expose method to get markdown content
defineExpose({
  getMarkdown: () => crepe?.getMarkdown() || ''
})
</script>

<template>
  <div class="milkdown-editor-wrapper" style="min-height: 500px; display: block;">
    <div ref="editorRef" class="milkdown-editor" />
  </div>
</template>

<style scoped>
.milkdown-editor-wrapper {
  width: 100%;
  /* Fallback border if theme doesn't load */
  border: 1px solid #e2e8f0; 
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.milkdown-editor {
  min-height: 400px;
  padding: 1rem;
}

/* Dark mode support */
:root.dark .milkdown-editor-wrapper {
  border-color: var(--surface-border, #374151);
  background: var(--surface-card, #1f2937);
}
</style>
