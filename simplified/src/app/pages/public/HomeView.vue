<template>
  <div class="home-view">
    <div class="hero-section py-32">
      <div class="container text-center">
        <h1 class="hero-title mb-6">OpenDS</h1>
        <p class="hero-subtitle mb-8 text-xl opacity-90">Simple, self-hosted design system documentation</p>
        <p class="hero-description mx-auto mb-12">
          Connect your design tools, manage tokens and components, and generate beautiful documentation.
        </p>
        <div class="hero-actions flex justify-center gap-4">
          <Button label="Get Started" severity="primary" size="large" @click="goToDocs" rounded />
          <Button label="View Components" severity="secondary" size="large" @click="goToComponents" text class="text-white hover:bg-white-alpha-10" />
        </div>
      </div>
    </div>

    <div class="features-section py-20 bg-surface-50">
      <div class="container">
        <h2 class="section-title text-center mb-12">Why OpenDS?</h2>
        <div class="grid">
          <div class="col-12 md:col-span-4">
            <Card class="feature-card h-full shadow-lg border-none">
              <template #title>
                <div class="flex items-center gap-4 mb-2">
                  <i class="pi pi-sync text-primary text-2xl"></i>
                  <span class="font-bold text-xl">Design Tool Integration</span>
                </div>
              </template>
              <template #content>
                <p class="text-lg text-slate-600">Connect to Penpot or Figma and sync your design files automatically.</p>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-span-4">
            <Card class="feature-card h-full shadow-lg border-none">
              <template #title>
                <div class="flex items-center gap-4 mb-2">
                  <i class="pi pi-palette text-green-500 text-2xl"></i>
                  <span class="font-bold text-xl">Design Token Management</span>
                </div>
              </template>
              <template #content>
                <p class="text-lg text-slate-600">Manage colors, typography, spacing, and other design tokens in one place.</p>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-span-4">
            <Card class="feature-card h-full shadow-lg border-none">
              <template #title>
                <div class="flex items-center gap-4 mb-2">
                  <i class="pi pi-code text-blue-500 text-2xl"></i>
                  <span class="font-bold text-xl">Component Documentation</span>
                </div>
              </template>
              <template #content>
                <p class="text-lg text-slate-600">Generate beautiful documentation for your components with live examples.</p>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section py-32 bg-white text-center">
      <div class="container">
        <h2 class="section-title mb-6">Ready to get started?</h2>
        <p class="cta-description text-xl mb-12 max-w-2xl mx-auto text-slate-600">
          Deploy your own instance in minutes or try the demo.
        </p>
        <div class="cta-actions flex justify-center gap-4">
          <Button label="View Demo" severity="secondary" size="large" outlined />
          <Button label="Admin Login" severity="primary" size="large" @click="goToLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'

const router = useRouter()

function goToDocs() {
  router.push('/docs')
}

function goToComponents() {
  router.push('/components')
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.hero-description {
  max-width: 700px;
  font-size: 1.25rem;
  opacity: 0.8;
}

/* Feature card hover effect */
.feature-card:hover {
  transform: translateY(-8px);
  transition: transform 0.3s ease;
}
</style>