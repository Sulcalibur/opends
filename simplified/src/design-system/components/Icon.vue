<template>
  <span :class="iconClass">
    <!-- Simple emoji-based icons for now -->
    <span v-if="name === 'check-circle'">✅</span>
    <span v-else-if="name === 'exclamation-circle'">⚠️</span>
    <span v-else-if="name === 'information-circle'">ℹ️</span>
    <span v-else-if="name === 'x-circle'">❌</span>
    <span v-else>🔹</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'check-circle'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const iconClass = computed(() => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  return `${sizeClasses[props.size]} text-${props.color}`
})
</script>