<template>
  <div class="min-h-screen bg-gray-50">
    <div class="hero-section py-32 bg-gradient-to-br from-blue-50 to-blue-100">
      <div class="container text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">OpenDS</h1>
        <p class="text-xl text-gray-700 mb-8">Simple, self-hosted design system documentation</p>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/docs" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </NuxtLink>
          <NuxtLink to="/docs/components" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            View Components
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="features-section py-20 bg-white">
      <div class="container">
        <h2 class="text-2xl font-bold text-center mb-12">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg border shadow-sm">
            <p class="text-gray-900 font-bold text-lg mb-2">Design Tools</p>
            <p class="text-gray-600">Connect to Penpot or Figma</p>
          </div>
          <div class="bg-white p-6 rounded-lg border shadow-sm">
            <p class="text-gray-900 font-bold text-lg mb-2">Tokens</p>
            <p class="text-gray-600">Manage design tokens</p>
          </div>
          <div class="bg-white p-6 rounded-lg border shadow-sm">
            <p class="text-gray-900 font-bold text-lg mb-2">Components</p>
            <p class="text-gray-600">Document components</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section py-32 bg-blue-600">
      <div class="container text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p class="text-xl text-blue-100 mb-8">Nuxt 4 is now running!</p>
        <p class="text-blue-100">Visit <NuxtLink to="/docs" class="text-white underline">docs</NuxtLink> or <NuxtLink to="/components" class="text-white underline">components</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.features-section {
  background-color: #f9fafb;
}

.cta-section {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}
</style>
