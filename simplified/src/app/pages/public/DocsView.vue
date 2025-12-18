<template>
  <div class="docs-view">
    <div class="container">
      <h1>Documentation</h1>
      <p class="text-color-secondary mb-6">
        Welcome to the OpenDS documentation. Here you'll find guides, API references, and examples.
      </p>
      
      <div class="grid">
        <div class="col-12 md:col-4">
          <Card class="h-full">
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-book text-primary"></i>
                <span>Getting Started</span>
              </div>
            </template>
            <template #content>
              <p>Learn how to set up and use OpenDS for your design system.</p>
              <Button label="Read Guide" severity="secondary" class="mt-3" />
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-4">
          <Card class="h-full">
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-palette text-green-500"></i>
                <span>Design Tokens</span>
              </div>
            </template>
            <template #content>
              <p>Learn about design tokens and how to manage them in OpenDS.</p>
              <Button label="View Tokens" severity="secondary" class="mt-3" @click="goToTokens" />
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-4">
          <Card class="h-full">
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-code text-blue-500"></i>
                <span>Components</span>
              </div>
            </template>
            <template #content>
              <p>Browse and learn about the components in your design system.</p>
              <Button label="View Components" severity="secondary" class="mt-3" @click="goToComponents" />
            </template>
          </Card>
        </div>
      </div>
      
      <div class="mt-8">
        <h2>Quick Links</h2>
        <div class="grid mt-4">
          <div class="col-12 md:col-6">
            <Card>
              <template #title>API Reference</template>
              <template #content>
                <p>Technical documentation for the OpenDS API and integrations.</p>
                <Button label="View API Docs" severity="secondary" class="mt-3" />
              </template>
            </Card>
          </div>
          <div class="col-12 md:col-6">
            <Card>
              <template #title>Deployment Guide</template>
              <template #content>
                <p>Learn how to deploy OpenDS to various hosting platforms.</p>
                <Button label="View Guide" severity="secondary" class="mt-3" />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

function goToTokens() {
  router.push('/tokens')
}

function goToComponents() {
  router.push('/components')
}
</script>

<style scoped>
.docs-view {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>