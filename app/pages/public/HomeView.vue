<template>
  <div class="home-view">
    <div class="hero-section py-32">
      <div class="container text-center">
        <h1 class="hero-title mb-6">OpenDS</h1>
        <p class="hero-subtitle mb-8 text-xl opacity-90">Simple, self-hosted design system documentation</p>
        <p class="hero-description mx-auto mb-12 max-w-2xl">
          Connect your design tools, manage tokens and components, and generate beautiful documentation.
        </p>
        <div class="hero-actions flex justify-center gap-4">
          <NuxtLink to="/docs" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
            Get Started
          </NuxtLink>
          <NuxtLink to="/docs/components" class="text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
            View Components
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="features-section py-20 bg-gray-50">
      <div class="container">
        <h2 class="text-2xl font-bold text-center mb-12">Why OpenDS?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-lg border">
            <div class="flex items-center gap-4 mb-4">
              <i class="pi pi-sync text-blue-500 text-2xl"></i>
              <span class="font-bold text-xl">Design Tool Integration</span>
            </div>
            <p class="text-slate-600">Connect to Penpot or Figma and sync your design files automatically.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-lg border">
            <div class="flex items-center gap-4 mb-4">
              <i class="pi pi-palette text-green-500 text-2xl"></i>
              <span class="font-bold text-xl">Design Token Management</span>
            </div>
            <p class="text-slate-600">Manage colors, typography, spacing, and other design tokens in one place.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-lg border">
            <div class="flex items-center gap-4 mb-4">
              <i class="pi pi-code text-purple-500 text-2xl"></i>
              <span class="font-bold text-xl">Component Documentation</span>
            </div>
            <p class="text-slate-600">Generate beautiful documentation for your components with live examples.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section py-32 bg-white text-center">
      <div class="container">
        <h2 class="text-2xl font-bold mb-6">Ready to get started?</h2>
        <p class="text-xl mb-12 max-w-2xl mx-auto text-slate-600">
          Deploy your own instance in minutes or try the demo.
        </p>
        <div class="flex justify-center gap-4">
          <button class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
            View Demo
          </button>
          <NuxtLink to="/login" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
            Admin Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Navigation handled by router-link in template
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #1f2937;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
}

.hero-description {
  max-width: 700px;
  font-size: 1.25rem;
  opacity: 0.8;
  margin: 0 auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.features-section {
  background-color: #f9fafb;
}

.section-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
}

.cta-section {
  background-color: white;
}

.cta-description {
  color: #64748b;
}
</style>