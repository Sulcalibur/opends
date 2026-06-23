<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.includes('components')) return 'Components'
  if (path.includes('tokens')) return 'Design Tokens'
  if (path.includes('docs')) return 'Documentation'
  if (path.includes('users')) return 'Users & Roles'
  if (path.includes('settings')) return 'Settings'
  if (path.includes('api-keys')) return 'API Keys'
  if (path.includes('visibility')) return 'Visibility & Access'
  if (path.includes('activity')) return 'Activity'
  return 'Admin'
})
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar
      :active="
        route.path.includes('components') ? 'components'
        : route.path.includes('tokens') ? 'tokens'
        : route.path.includes('docs') ? 'docs'
        : route.path.includes('users') ? 'users'
        : route.path.includes('settings') ? 'settings'
        : route.path.includes('visibility') ? 'visibility'
        : 'dashboard'
      "
    />

    <div class="admin-main">
      <!-- Header -->
      <header class="admin-header">
        <div class="admin-header-content">
          <div class="admin-header-left">
            <h1 class="admin-page-title">{{ pageTitle }}</h1>
          </div>
          <div class="admin-header-right">
            <button class="admin-header-btn" @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
              <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
            </button>
            <button class="admin-header-btn">
              <UIcon name="i-lucide-bell" class="size-4" />
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
const colorMode = useColorMode()
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: var(--bg);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
  flex-shrink: 0;
}

.admin-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.admin-header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-page-title {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.01em;
  color: var(--text);
  margin: 0;
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-input);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-micro);
}
.admin-header-btn:hover {
  color: var(--text);
  background: var(--surface-2);
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .admin-content { padding: 20px; }
  .admin-header { padding: 0 20px; }
  .admin-page-title { font-size: 17px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .admin-content { padding: 16px; }
  .admin-header { padding: 0 16px; height: 52px; }
  .admin-page-title { font-size: 16px; }
}
</style>
