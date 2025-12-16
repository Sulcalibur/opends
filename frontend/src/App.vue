<template>
  <div id="app">
    <!-- Authentication layout (for login/register) -->
    <div v-if="!isAuthenticated" class="auth-layout">
      <router-view />
    </div>
    
    <!-- Main application layout (for authenticated users) -->
    <div v-else class="app-layout">
      <AppSidebar />
      <main class="app-main">
        <AppHeader />
        <div class="app-content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/layouts/AppSidebar.vue'
import AppHeader from '@/layouts/AppHeader.vue'

// TODO: Connect to auth store
const isAuthenticated = ref(true)
</script>

<style>
#app {
  min-height: 100vh;
}

.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  overflow-y: auto;
}
</style>