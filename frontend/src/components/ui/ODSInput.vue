<template>
  <div class="ods-input-wrapper">
    <label v-if="label" :for="id" class="ods-input-label">
      {{ label }}
      <span v-if="required" class="ods-input-required">*</span>
    </label>
    <InputText
      :id="inputId"
      v-bind="$attrs"
      :model-value="modelValue"
      :class="[customClass, { 'p-invalid': error }]"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      @update:model-value="$emit('update:modelValue', $event)"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />
    <small v-if="error" :id="`${inputId}-error`" class="ods-input-error">
      {{ error }}
    </small>
    <small v-else-if="hint" class="ods-input-hint">
      {{ hint }}
    </small>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  label?: string
  id?: string
  required?: boolean
  error?: string
  hint?: string
  customClass?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
  change: [event: Event]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.ods-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ods-input-label {
  font-weight: 500;
  color: var(--opends-admin-gray-700);
  font-size: 0.875rem;
}

.ods-input-required {
  color: var(--opends-admin-danger-500);
}

.ods-input-error {
  color: var(--opends-admin-danger-500);
  font-size: 0.75rem;
}

.ods-input-hint {
  color: var(--opends-admin-gray-500);
  font-size: 0.75rem;
}
</style>