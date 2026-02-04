<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'px-3 py-2 border rounded-md transition-colors',
      {
        'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500': !error,
        'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500': error,
        'bg-gray-100 cursor-not-allowed': disabled
      }
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
  <div v-if="error" class="text-red-600 text-sm mt-1">
    {{ error }}
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>