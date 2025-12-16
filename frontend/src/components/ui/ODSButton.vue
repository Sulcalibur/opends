<template>
  <Button
    v-bind="$attrs"
    :class="customClass"
    @click="$emit('click', $event)"
  >
    <slot>
      {{ label }}
    </slot>
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  label?: string
  severity?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'help' | 'info' | 'contrast'
  size?: 'small' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPos?: 'left' | 'right'
  customClass?: string
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
/* Additional OpenDS-specific button styles can be added here */
</style>