<template>
  <div class="p-4">
    <div class="flex gap-2 mb-3">
      <button class="p-button p-component" @click="list('figma')">
        <span class="p-button-icon pi pi-figma"></span>
        <span class="p-button-label">Figma</span>
      </button>
      <button class="p-button p-component" @click="list('penpot')">
        <span class="p-button-icon pi pi-box"></span>
        <span class="p-button-label">Penpot</span>
      </button>
    </div>
    <div v-if="store.loading">Loading…</div>
    <div v-else-if="store.error" class="text-danger">{{ store.error }}</div>
    <ul v-else class="list">
      <li v-for="f in store.files" :key="f.key || f.id">{{ f.name || f.title || f.id }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useFilesStore } from '@/stores/filesStore'
const store = useFilesStore()
function list(p: 'figma' | 'penpot') { store.list(p) }
</script>

<style scoped>
.list { list-style: none; padding: 0; }
.list li { padding: .5rem 0; border-bottom: 1px solid var(--opends-admin-gray-200); }
.p-button-label { margin-left: .5rem; }
</style>

