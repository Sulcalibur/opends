<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="container">
        <h1 class="hero-title">OpenDS</h1>
        <p class="hero-subtitle">Simple, self-hosted design system documentation</p>
        <p class="hero-description">
          Connect your design tools, manage tokens and components, and generate beautiful documentation.
        </p>
        <div class="hero-actions">
          <Button label="Get Started" severity="primary" @click="goToDocs" />
          <Button label="View Components" severity="secondary" @click="goToComponents" />
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Why OpenDS?</h2>
        <div class="grid">
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-sync text-primary"></i>
                  <span>Design Tool Integration</span>
                </div>
              </template>
              <template #content>
                <p>Connect to Penpot or Figma and sync your design files automatically.</p>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-palette text-green-500"></i>
                  <span>Design Token Management</span>
                </div>
              </template>
              <template #content>
                <p>Manage colors, typography, spacing, and other design tokens in one place.</p>
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-4">
            <Card class="feature-card">
              <template #title>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-code text-blue-500"></i>
                  <span>Component Documentation</span>
                </div>
              </template>
              <template #content>
                <p>Generate beautiful documentation for your components with live examples.</p>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <h2 class="section-title">Ready to get started?</h2>
        <p class="cta-description">
          Deploy your own instance in minutes or try the demo.
        </p>
        <div class="cta-actions">
          <Button label="View Demo" severity="primary" outlined />
          <Button label="Admin Login" severity="secondary" @click="goToLogin" />
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
.home-view {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features-section {
  padding: 5rem 2rem;
  background: var(--surface-50);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--surface-900);
}

.feature-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.cta-section {
  padding: 5rem 2rem;
  text-align: center;
  background: var(--surface-100);
}

.cta-description {
  font-size: 1.25rem;
  color: var(--surface-700);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>