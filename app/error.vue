<template>
  <div class="error-page">
    <div class="container text-center py-20">
      <h1 class="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
      <p class="text-xl mb-8">{{ error?.message || 'An unexpected error occurred' }}</p>
      <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
        Go Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error?: {
    message?: string
    statusCode?: number
  }
}>()
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
