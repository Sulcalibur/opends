<template>
  <div class="min-h-screen bg-slate-50">
    <NavBar />
    <main class="pt-20">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/app/components/NavBar.vue'
</script>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}
</style>