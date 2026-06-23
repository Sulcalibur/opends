<script setup lang="ts">
defineProps<{
  active?: string
}>()

const auth = useAuthStore()
const user = computed(() => auth.user)
</script>

<template>
  <aside class="admin-sidebar">
    <!-- Brand -->
    <div class="sidebar-brand">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--primary)" />
        <path d="M10 11.5C10 9.567 11.567 8 13.5 8h5C20.433 8 22 9.567 22 11.5v9c0 1.933-1.567 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 10 20.5z" stroke="white" stroke-width="2.2"/>
        <circle cx="16" cy="16" r="1.7" fill="white"/>
      </svg>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-name">OpenDS</div>
        <div class="sidebar-brand-domain">admin</div>
      </div>
    </div>

    <!-- Jump to -->
    <div class="sidebar-search">
      <div class="sidebar-search-box">
        <UIcon name="i-lucide-search" class="size-3.5" />
        <span>Jump to…</span>
        <kbd>⌘K</kbd>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <NuxtLink to="/admin" class="admin-nav-item" :class="{ active: active === 'dashboard' }">
        <UIcon name="i-lucide-home" class="size-4" />
        Dashboard
      </NuxtLink>
      <NuxtLink to="/admin/components" class="admin-nav-item" :class="{ active: active === 'components' }">
        <UIcon name="i-lucide-component" class="size-4" />
        Components
        <span class="nav-count">48</span>
      </NuxtLink>
      <NuxtLink to="/admin/tokens" class="admin-nav-item" :class="{ active: active === 'tokens' }">
        <UIcon name="i-lucide-palette" class="size-4" />
        Tokens
        <span class="nav-count">218</span>
      </NuxtLink>
      <NuxtLink to="/admin/docs" class="admin-nav-item" :class="{ active: active === 'docs' }">
        <UIcon name="i-lucide-file-text" class="size-4" />
        Docs
        <span class="nav-count">32</span>
      </NuxtLink>

      <div class="sidebar-section">Workspace</div>
      <NuxtLink to="/admin/users" class="admin-nav-item" :class="{ active: active === 'users' }">
        <UIcon name="i-lucide-users" class="size-4" />
        Users &amp; Roles
        <span class="nav-count">9</span>
      </NuxtLink>
      <NuxtLink to="/admin/visibility" class="admin-nav-item" :class="{ active: active === 'visibility' }">
        <UIcon name="i-lucide-shield" class="size-4" />
        Visibility &amp; access
      </NuxtLink>
      <NuxtLink to="/admin/activity" class="admin-nav-item">
        <UIcon name="i-lucide-activity" class="size-4" />
        Activity
      </NuxtLink>
      <NuxtLink to="/admin/api-keys" class="admin-nav-item">
        <UIcon name="i-lucide-key" class="size-4" />
        API Keys
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="admin-nav-item" :class="{ active: active === 'settings' }">
        <UIcon name="i-lucide-settings" class="size-4" />
        Settings
      </NuxtLink>

      <div class="sidebar-section">Status</div>
      <div class="admin-nav-item faint">
        <span class="nav-dot" style="background: #FF6B4A" />
        Draft
        <span class="nav-count">12</span>
      </div>
      <div class="admin-nav-item faint">
        <span class="nav-dot" style="background: #1F8A5B" />
        Approved
        <span class="nav-count">34</span>
      </div>
      <div class="admin-nav-item faint">
        <span class="nav-dot" style="background: #8A91A0" />
        Deprecated
        <span class="nav-count">2</span>
      </div>
    </nav>

    <!-- User -->
    <div class="sidebar-user">
      <div class="sidebar-avatar">{{ user?.name?.charAt(0) || 'A' }}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">{{ user?.name || 'Admin' }}</div>
        <div class="sidebar-user-role">Admin</div>
      </div>
      <button class="sidebar-logout" title="Sign out" @click="auth.logout()">
        <UIcon name="i-lucide-log-out" class="size-4" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 12px;
}

.sidebar-brand-text {
  flex: 1;
  min-width: 0;
}

.sidebar-brand-name {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.sidebar-brand-domain {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
}

.sidebar-search {
  padding: 0 8px 8px;
}

.sidebar-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  background: var(--surface-2);
  border-radius: var(--r-input);
  color: var(--text-tertiary);
  font-size: 13px;
  cursor: pointer;
}
.sidebar-search-box span {
  flex: 1;
}
.sidebar-search-box kbd {
  font-family: var(--f-mono);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  line-height: 1.3;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.sidebar-section {
  padding: 14px 10px 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.admin-nav-item:hover {
  background: var(--surface-2);
  color: var(--text);
}
.admin-nav-item.active {
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
}
.admin-nav-item.active :deep(svg) {
  color: var(--primary);
}
.admin-nav-item :deep(svg) {
  color: var(--text-tertiary);
}
.admin-nav-item.faint {
  color: var(--text-tertiary);
}
.admin-nav-item.faint .nav-count {
  color: var(--text-tertiary);
}

.nav-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid var(--border);
}

.sidebar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.sidebar-user-info {
  flex: 1;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.sidebar-user-role {
  font-size: 11px;
  color: var(--text-tertiary);
}

.sidebar-logout {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  transition: all var(--duration-micro);
}
.sidebar-logout:hover {
  color: var(--danger);
  background: var(--danger-soft);
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .admin-sidebar { width: 200px; }
  .sidebar-brand-name { font-size: 15px; }
  .admin-nav-item { font-size: 13px; padding: 6px 8px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: var(--z-dropdown);
    transform: translateX(-100%);
    transition: transform var(--duration-structural) var(--ease-out-quart);
  }
  .admin-sidebar.open { transform: translateX(0); }
}
</style>
