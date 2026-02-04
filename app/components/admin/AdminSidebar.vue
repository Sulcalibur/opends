<template>
  <aside
    class="admin-sidebar backdrop-blur"
    :class="{ 'is-collapsed': isCollapsed }"
  >
    <button
      class="collapse-btn"
      :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
      @click="isCollapsed = !isCollapsed"
    >
      <i :class="isCollapsed ? 'pi-angle-right' : 'pi-angle-left'"/>
    </button>

    <div class="sidebar-header">
      <h2 class="sidebar-logo" :class="{ 'text-xl': isCollapsed }">
        {{ isCollapsed ? "ODS" : "OpenDS" }}
      </h2>
      <p v-if="!isCollapsed" class="sidebar-subtitle">Admin Panel</p>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Dashboard' : ''"
        to="/admin"
        class="nav-item"
        active-class="active"
        exact
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-home"/>
        <span v-if="!isCollapsed">Dashboard</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Components' : ''"
        to="/admin/components"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-box"/>
        <span v-if="!isCollapsed">Components</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Design Tokens' : ''"
        to="/admin/tokens"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-palette"/>
        <span v-if="!isCollapsed">Design Tokens</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Documentation' : ''"
        to="/admin/docs"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-file-edit"/>
        <span v-if="!isCollapsed">Documentation</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Users' : ''"
        to="/admin/users"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-users"/>
        <span v-if="!isCollapsed">Users</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Settings' : ''"
        to="/admin/settings"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-cog"/>
        <span v-if="!isCollapsed">Settings</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'API Keys' : ''"
        to="/admin/api-keys"
        class="nav-item"
        active-class="active"
        :class="{ 'justify-center': isCollapsed }"
      >
        <i class="pi pi-key"/>
        <span v-if="!isCollapsed">API Keys</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Public Components' : ''"
        to="/components"
        class="nav-item"
        :class="[
          $route.path.startsWith('/components') ? 'active' : '',
          'justify-center': isCollapsed
        ]"
      >
        <i class="pi pi-box-open"/>
        <span v-if="!isCollapsed">Public Components</span>
        <span class="glow"/>
      </NuxtLink>

      <NuxtLink
        v-tooltip.right="isCollapsed ? 'Public Docs' : ''"
        to="/docs"
        class="nav-item"
        :class="[
          $route.path.startsWith('/docs') && !$route.path.startsWith('/admin/docs') ? 'active' : '',
          'justify-center': isCollapsed
        ]"
      >
        <i class="pi pi-book"/>
        <span v-if="!isCollapsed">Public Docs</span>
        <span class="glow"/>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
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
        v-tooltip.right="isCollapsed ? 'Logout' : ''"
        icon="pi pi-sign-out"
        :label="isCollapsed ? '' : 'Logout'"
        text
        severity="secondary"
        class="logout-btn"
        :class="{ 'justify-center': isCollapsed }"
        @click="handleLogout"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import "primeicons/primeicons.css";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isCollapsed = ref(false);

const userInitials = computed(() => {
  const name = authStore.user?.name || "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

async function handleLogout() {
  authStore.logout();
  router.push("/login");
}

onMounted(() => {
  authStore.initialize();
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState) {
    isCollapsed.value = savedState === "true";
  }
});

watch(isCollapsed, (val) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("sidebarCollapsed", String(val));
  }
});
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  overflow: hidden;
}

.admin-sidebar.is-collapsed {
  width: 80px;
}

.collapse-btn {
  position: absolute;
  right: -14px;
  top: 100px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: 3px solid #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  z-index: 10;
}

.collapse-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
}

.collapse-btn:active {
  transform: scale(0.95);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  min-height: 120px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.is-collapsed .sidebar-header {
  padding: 1.5rem 0.5rem;
}

.sidebar-logo {
  font-size: 1.75rem;
  font-weight: var(--font-weight-extrabold);
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  white-space: nowrap;
  text-align: center;
  transition: all var(--transition-base);
}

.is-collapsed .sidebar-logo {
  font-size: 1.5rem;
}

.sidebar-subtitle {
  color: #94a3b8;
  font-size: 0.8125rem;
  margin: 0.5rem 0 0 0;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.is-collapsed .sidebar-nav {
  padding: 1.5rem 0.25rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all var(--transition-slow);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  z-index: 1;
}

.nav-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity var(--transition-slow);
  z-index: -1;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.active {
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
  transform: translateX(4px);
}

.nav-item.active::before {
  opacity: 1;
}

.nav-item.active .glow {
  opacity: 1;
}

.glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: var(--radius-xl);
  opacity: 0;
  filter: blur(12px);
  transition: opacity var(--transition-slow);
  pointer-events: none;
  z-index: -1;
}

.nav-item.active .glow {
  opacity: 0.3;
}

.nav-item i {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
  transition: transform var(--transition-base);
}

.nav-item:hover i {
  transform: scale(1.1);
}

.nav-item.active i {
  transform: scale(1.15);
}

.nav-item span {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.is-collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem;
}

.sidebar-footer {
  padding: 1.5rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.is-collapsed .sidebar-footer {
  padding: 1rem 0.25rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-base);
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(2px);
}

.is-collapsed .user-profile {
  justify-content: center;
  padding: 0.5rem;
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
  font-weight: var(--font-weight-bold);
  font-size: 0.875rem;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all var(--transition-base);
}

.user-profile:hover .user-avatar {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: var(--font-weight-semibold);
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
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  background: rgba(255, 255, 255, 0.05);
}

.logout-btn:hover {
  color: white !important;
  background: rgba(239, 68, 68, 0.2) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.is-collapsed .logout-btn {
  justify-content: center;
  padding: 0.75rem;
}

.is-collapsed .logout-btn .p-button-label {
  display: none;
}

.is-collapsed .logout-btn .p-button-icon {
  margin-right: 0;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

<style>
.p-tooltip {
  z-index: 9999 !important;
}

.p-tooltip-text {
  background: #1e293b !important;
  color: #fff !important;
  padding: 0.5rem 0.75rem !important;
  border-radius: 8px !important;
  font-size: 0.8125rem !important;
  font-weight: var(--font-weight-medium) !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.p-tooltip-arrow {
  border-right-color: #1e293b !important;
  border-left-color: #1e293b !important;
  border-top-color: #1e293b !important;
  border-bottom-color: #1e293b !important;
}
</style>
