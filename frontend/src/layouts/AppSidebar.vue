<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <h1>OpenDS</h1>
      <p class="sidebar-subtitle">Design System Platform</p>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" active-class="active">
        <i class="pi pi-home mr-2" />
        Dashboard
      </router-link>
      
      <router-link to="/design-files" class="nav-item" active-class="active">
        <i class="pi pi-folder mr-2" />
        Design Files
      </router-link>
      
      <router-link to="/components" class="nav-item" active-class="active">
        <i class="pi pi-box mr-2" />
        Components
      </router-link>
      
      <router-link to="/tokens" class="nav-item" active-class="active">
        <i class="pi pi-palette mr-2" />
        Design Tokens
      </router-link>
      
       <router-link to="/codegen" class="nav-item" active-class="active">
        <i class="pi pi-code mr-2" />
        Code Generation
      </router-link>
      
      <a v-if="isAuthenticated" href="/documentation" class="nav-item" target="_self">
        <i class="pi pi-book mr-2" />
        Documentation
      </a>
      
      <div class="sidebar-divider" />
      
      <router-link to="/settings" class="nav-item" active-class="active">
        <i class="pi pi-cog mr-2" />
        Settings
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <div class="theme-toggle">
        <i class="pi pi-sun" />
        <ToggleButton 
          v-model="isDarkMode" 
          onLabel="Dark" 
          offLabel="Light"
          @change="toggleTheme"
          class="theme-switch"
        />
        <i class="pi pi-moon" />
      </div>
      <div class="user-menu">
        <Avatar icon="pi pi-user" shape="circle" />
        <span class="user-name">User</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Avatar from 'primevue/avatar'
import ToggleButton from 'primevue/togglebutton'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isDarkMode = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const toggleTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('opends-theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('opends-theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid var(--opends-admin-gray-200);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.dark .app-sidebar {
  background: var(--opends-admin-gray-800);
  border-right-color: var(--opends-admin-gray-700);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--opends-admin-gray-200);
}

.dark .sidebar-header {
  border-bottom-color: var(--opends-admin-gray-700);
}

.sidebar-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--opends-admin-primary-600);
  margin: 0;
}

.dark .sidebar-header h1 {
  color: var(--opends-admin-primary-400);
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: var(--opends-admin-gray-600);
  margin: 0.25rem 0 0;
}

.dark .sidebar-subtitle {
  color: var(--opends-admin-gray-400);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--opends-admin-gray-700);
  text-decoration: none;
  transition: all 0.2s;
}

.dark .nav-item {
  color: var(--opends-admin-gray-300);
}

.nav-item:hover {
  background: var(--opends-admin-gray-100);
  color: var(--opends-admin-primary-600);
}

.dark .nav-item:hover {
  background: var(--opends-admin-gray-700);
  color: var(--opends-admin-primary-400);
}

.nav-item.active {
  background: var(--opends-admin-primary-50);
  color: var(--opends-admin-primary-700);
  border-right: 3px solid var(--opends-admin-primary-500);
}

.dark .nav-item.active {
  background: var(--opends-admin-primary-900);
  color: var(--opends-admin-primary-300);
  border-right-color: var(--opends-admin-primary-500);
}

.sidebar-divider {
  height: 1px;
  background: var(--opends-admin-gray-200);
  margin: 1rem 1.5rem;
}

.dark .sidebar-divider {
  background: var(--opends-admin-gray-700);
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--opends-admin-gray-200);
}

.dark .sidebar-footer {
  border-top-color: var(--opends-admin-gray-700);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.theme-toggle i {
  color: var(--opends-admin-gray-600);
}

.dark .theme-toggle i {
  color: var(--opends-admin-gray-400);
}

.theme-switch {
  transform: scale(0.8);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 500;
  color: var(--opends-admin-gray-700);
}

.dark .user-name {
  color: var(--opends-admin-gray-300);
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>