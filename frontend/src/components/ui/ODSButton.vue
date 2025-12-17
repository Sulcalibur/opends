<template>
  <Button v-bind="$attrs">
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
/* OpenDS button styles will be added here */
</style>