<template>
  <div class="ods-input">
    <label v-if="label" class="ods-input-label">{{ label }}</label>
    <InputText v-bind="$attrs" :class="{ 'p-invalid': error }">
      <slot />
    </InputText>
    <small v-if="hint && !error" class="ods-input-hint">{{ hint }}</small>
    <small v-if="error" class="ods-input-error">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineProps<{
  label?: string
  hint?: string
  error?: string
}>()

defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.ods-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ods-input-label {
  font-weight: 500;
  color: var(--opends-admin-gray-700);
}

.dark .ods-input-label {
  color: var(--opends-admin-gray-300);
}

.ods-input-hint {
  color: var(--opends-admin-gray-500);
  font-size: 0.875rem;
}

.dark .ods-input-hint {
  color: var(--opends-admin-gray-400);
}

.ods-input-error {
  color: var(--opends-admin-danger-500);
  font-size: 0.875rem;
}

.dark .ods-input-error {
  color: var(--opends-admin-danger-400);
}
</style>