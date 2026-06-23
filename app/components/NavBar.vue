<template>
  <nav class="navbar">
    <NuxtLink to="/" class="navbar-brand">
      <Logo :text="orgName" />
    </NuxtLink>
    <div class="navbar-links">
      <NuxtLink to="/docs">Docs</NuxtLink>
      <NuxtLink to="/docs/components">Components</NuxtLink>
      <NuxtLink to="/tokens">Tokens</NuxtLink>
    </div>
    <div class="navbar-actions">
      <UiThemeToggle />
      <NuxtLink to="/login" class="navbar-signin">Sign In</NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})
const orgName = computed(() => settings.value?.organization_name || 'OpenDS')
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}
.navbar-brand { text-decoration: none; }
.navbar-links { display: flex; gap: 4px; }
.navbar-links a {
  padding: 6px 12px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--r-input);
}
.navbar-links a:hover { color: var(--text); background: var(--surface-2); }
.navbar-links .router-link-active { color: var(--text); font-weight: 600; }
.navbar-actions { display: flex; align-items: center; gap: 8px; }
.navbar-signin {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: var(--primary);
  border-radius: var(--r-btn);
  text-decoration: none;
}
</style>
