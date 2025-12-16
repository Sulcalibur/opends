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
  background: var(--opends-admin-gray-50);
  color: var(--opends-admin-gray-900);
}

.dark #app {
  background: var(--opends-admin-gray-900);
  color: var(--opends-admin-gray-100);
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
  padding: 2rem;
  overflow-y: auto;
}
</style>