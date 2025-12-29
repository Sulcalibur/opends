<template>
  <div
    :class="[
      'bg-white border rounded-lg shadow-sm p-6',
      {
        'shadow-md': elevation === 1,
        'shadow-lg': elevation === 2,
        'shadow-xl': elevation === 3
      }
    ]"
  >
    <div v-if="title" class="text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </div>
    <div v-if="subtitle" class="text-gray-600 mb-4">
      {{ subtitle }}
    </div>
    <div class="text-gray-800">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  elevation: {
    type: Number,
    default: 1,
    validator: (value) => [0, 1, 2, 3, 4, 5].includes(value)
  }
})
</script>