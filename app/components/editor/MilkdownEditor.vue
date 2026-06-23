<script setup lang="ts">
import { Crepe } from '@milkdown/crepe'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/vue'
import { replaceAll } from '@milkdown/kit/utils'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== content.value) content.value = val
})

watch(content, (val) => {
  emit('update:modelValue', val)
})

const editor = useEditor((root) => {
  const crepe = new Crepe({
    root,
    defaultValue: content.value,
  })

  crepe.editor.onMarkdownUpdated((_, markdown) => {
    content.value = markdown
  })

  return crepe
})

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <MilkdownProvider>
    <Milkdown />
  </MilkdownProvider>
</template>

<style>
/* Milkdown styles — unscoped so they apply to the editor DOM */
.milkdown {
  min-height: 300px;
}

.milkdown .editor {
  padding: 40px 64px 80px;
  max-width: 760px;
  margin: 0 auto;
  outline: none;
  font-family: var(--f-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--text);
}

.milkdown .editor h1 {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 16px;
  color: var(--text);
}

.milkdown .editor h2 {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.02em;
  margin: 40px 0 12px;
  color: var(--text);
}

.milkdown .editor h3 {
  font-family: var(--f-display);
  font-weight: 600;
  font-size: 20px;
  margin: 32px 0 8px;
  color: var(--text);
}

.milkdown .editor p {
  margin: 0 0 16px;
}

.milkdown .editor code {
  font-family: var(--f-mono);
  font-size: 0.875em;
  background: var(--surface-2);
  padding: 2px 6px;
  border-radius: 4px;
}

.milkdown .editor pre {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.milkdown .editor pre code {
  background: none;
  padding: 0;
}

.milkdown .editor blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--text-tertiary);
  font-style: italic;
}

.milkdown .editor ul,
.milkdown .editor ol {
  padding-left: 24px;
  margin: 0 0 16px;
}

.milkdown .editor li {
  margin-bottom: 4px;
}

.milkdown .editor a {
  color: var(--primary);
  text-decoration: underline;
}
</style>
