<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="hidden lg:flex flex-col flex-shrink-0 border-r border-white/10 text-white admin-sidebar-bg transition-all duration-300 relative"
      :class="isCollapsed ? 'w-20' : 'w-[280px]'"
    >
      <div class="sidebar-header" :class="{ 'px-3 justify-center': isCollapsed }">
        <h2 class="sidebar-logo" :class="{ 'text-2xl': isCollapsed }">
          {{ isCollapsed ? 'ODS' : 'OpenDS' }}
        </h2>
        <p v-if="!isCollapsed" class="sidebar-subtitle">Admin Panel</p>
      </div>

      <nav class="sidebar-nav flex-1 overflow-y-auto custom-scrollbar" :class="{ 'px-2': isCollapsed }">
        <NuxtLink 
          to="/admin" 
          class="nav-item" 
          active-class="active" 
          exact
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Dashboard' : ''"
        >
          <i class="pi pi-home"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/components" 
          class="nav-item" 
          active-class="active"
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Components' : ''"
        >
          <i class="pi pi-box"></i>
          <span v-if="!isCollapsed">Components</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/tokens" 
          class="nav-item" 
          active-class="active"
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Design Tokens' : ''"
        >
          <i class="pi pi-palette"></i>
          <span v-if="!isCollapsed">Design Tokens</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/docs" 
          class="nav-item" 
          active-class="active"
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Documentation' : ''"
        >
          <i class="pi pi-file-edit"></i>
          <span v-if="!isCollapsed">Documentation</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/users" 
          class="nav-item" 
          active-class="active"
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Users' : ''"
        >
          <i class="pi pi-users"></i>
          <span v-if="!isCollapsed">Users</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/settings" 
          class="nav-item" 
          active-class="active"
          :class="{ 'justify-center': isCollapsed }"
          v-tooltip.right="isCollapsed ? 'Settings' : ''"
        >
          <i class="pi pi-cog"></i>
          <span v-if="!isCollapsed">Settings</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer" :class="{ 'px-2': isCollapsed }">
        <!-- Collapse Toggle -->
        <button 
          class="collapse-btn mb-4" 
          @click="isCollapsed = !isCollapsed"
          :class="{ 'mx-auto': isCollapsed, 'ml-auto': !isCollapsed }"
          v-tooltip.top="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <i :class="['pi', isCollapsed ? 'pi-angle-double-right' : 'pi-angle-double-left']"></i>
        </button>

        <div class="user-profile" :class="{ 'justify-center': isCollapsed }">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div v-if="!isCollapsed" class="user-info">
            <p class="user-name truncate">{{ authStore.user?.name }}</p>
            <p class="user-role">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <Button 
          icon="pi pi-sign-out" 
          :label="isCollapsed ? '' : 'Logout'" 
          text 
          severity="secondary"
          class="logout-btn"
          :class="{ 'justify-center': isCollapsed }"
          @click="handleLogout"
          v-tooltip.right="isCollapsed ? 'Logout' : ''"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Bar -->
      <header class="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10 transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Toggle (Visible on small screens) -->
            <Button 
              icon="pi pi-bars" 
              text 
              rounded 
              class="lg:hidden" 
              aria-label="Menu" 
            />
            <h1 class="text-2xl font-bold text-gray-900 m-0">{{ pageTitle }}</h1>
          </div>
          <div class="flex gap-2">
            <Button icon="pi pi-bell" text rounded aria-label="Notifications" />
            <Button icon="pi pi-question-circle" text rounded aria-label="Help" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Initialize state from local storage preference if possible, default false
const isCollapsed = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.includes('components')) return 'Components'
  if (path.includes('tokens')) return 'Design Tokens'
  if (path.includes('/admin/docs')) return 'Documentation'
  if (path.includes('users')) return 'Users'
  if (path.includes('settings')) return 'Settings'
  return 'Admin'
})

async function handleLogout() {
  authStore.logout()
}

// Initialize auth on mount
onMounted(() => {
  authStore.initialize()
  // Recover collapsed state preference
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState) {
    isCollapsed.value = savedState === 'true'
  }
})

// Persist state
watch(isCollapsed, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidebarCollapsed', String(val))
  }
})
</script>

<style scoped>
.admin-sidebar-bg {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  min-height: 100px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  white-space: nowrap;
}

.sidebar-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  white-space: nowrap;
}

.sidebar-nav {
  padding: 1.5rem 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
  font-weight: 500;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-item i {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.user-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  margin: 0;
  font-size: 0.875rem;
  color: white;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0.125rem 0 0 0;
  text-transform: capitalize;
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
  color: #94a3b8 !important;
}

.logout-btn:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
