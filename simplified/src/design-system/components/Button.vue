<template>
  <button
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors',
      {
        'bg-blue-600 text-white hover:bg-blue-700': severity === 'primary',
        'bg-gray-600 text-white hover:bg-gray-700': severity === 'secondary',
        'bg-green-600 text-white hover:bg-green-700': severity === 'success',
        'bg-red-600 text-white hover:bg-red-700': severity === 'danger',
        'opacity-50 cursor-not-allowed': disabled
      }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>