<template>
  <div class="error-page">
    <NavBar />
    <div class="container mx-auto text-center py-20">
      <div class="max-w-2xl mx-auto">
        <div class="text-6xl mb-6">{{ error?.statusCode === 404 ? '🔍' : '⚠️' }}</div>
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          {{ error?.statusCode === 404 ? 'Page Not Found' : 'Oops! Something went wrong' }}
        </h1>
        <p class="text-xl text-slate-600 mb-8">
          {{ error?.message || 'An unexpected error occurred' }}
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/" class="theme-btn-primary">
            <i class="pi pi-home mr-2"/>
            Go Home
          </NuxtLink>
          <NuxtLink to="/docs" class="px-6 py-3 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 transition-colors inline-flex items-center">
            <i class="pi pi-book mr-2"/>
            View Documentation
          </NuxtLink>
        </div>
      </div>
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
