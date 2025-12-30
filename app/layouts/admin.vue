<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-[280px] flex-shrink-0 border-r border-white/10 text-white admin-sidebar-bg transition-all duration-300">
      <div class="sidebar-header">
        <h2 class="sidebar-logo">OpenDS</h2>
        <p class="sidebar-subtitle">Admin Panel</p>
      </div>

      <nav class="sidebar-nav flex-1 overflow-y-auto custom-scrollbar">
        <NuxtLink to="/admin" class="nav-item" active-class="active" exact>
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/components" class="nav-item" active-class="active">
          <i class="pi pi-box"></i>
          <span>Components</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/tokens" class="nav-item" active-class="active">
          <i class="pi pi-palette"></i>
          <span>Design Tokens</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/docs" class="nav-item" active-class="active">
          <i class="pi pi-file-edit"></i>
          <span>Documentation</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/users" class="nav-item" active-class="active">
          <i class="pi pi-users"></i>
          <span>Users</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/settings" class="nav-item" active-class="active">
          <i class="pi pi-cog"></i>
          <span>Settings</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-info">
            <p class="user-name truncate">{{ authStore.user?.name }}</p>
            <p class="user-role">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <Button 
          icon="pi pi-sign-out" 
          label="Logout" 
          text 
          severity="secondary"
          class="logout-btn"
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Bar -->
      <header class="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
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
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

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
})
</script>

<style scoped>
.admin-sidebar-bg {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.sidebar-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
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
}

.sidebar-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
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

/* Custom Scrollbar for Webkit */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
