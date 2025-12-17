<template>
  <div class="connections p-4">
    <h2 class="mb-3">Connect Accounts</h2>
    <div class="grid">
      <div class="col-12 md:col-6" v-for="p in auth.providers" :key="p.id">
        <div class="card p-3">
          <div class="flex align-items-center justify-content-between">
            <div>
              <h3 class="m-0">{{ p.name }}</h3>
              <p class="m-0 text-muted">Authorize OpenDS to access your design files</p>
            </div>
            <button class="p-button p-component" @click="auth.connect(p.id)">
              <span class="p-button-icon pi pi-link"></span>
              <span class="p-button-label">Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
onMounted(() => auth.loadProviders())
</script>

<style scoped>
.card { border: 1px solid var(--opends-admin-gray-200); border-radius: var(--opends-admin-border-radius-md); }
.p-button-label { margin-left: .5rem; }
</style>

