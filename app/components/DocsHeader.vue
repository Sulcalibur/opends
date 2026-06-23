<script setup lang="ts">
const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})
const orgName = computed(() => settings.value.organization_name || 'Design System')

const searchOpen = ref(false)
useSearchShortcut(() => { searchOpen.value = true })

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <header class="docs-header">
    <!-- Brand -->
    <div class="header-brand">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="7" :fill="isDark ? '#F0F1F5' : '#1A1D21'" />
        <circle cx="16" cy="16" r="7" fill="none" :stroke="isDark ? '#FF8A70' : '#FF6B4A'" stroke-width="2.4" />
        <circle cx="16" cy="16" r="2.5" :fill="isDark ? '#FF8A70' : '#FF6B4A'" />
      </svg>
      <span class="header-team-name">{{ orgName }}</span>
      <UBadge color="neutral" variant="soft" size="sm">v2.4</UBadge>
    </div>

    <!-- Search -->
    <div class="header-search">
      <button class="search-trigger" @click="searchOpen = true">
        <kbd>⌘K</kbd>
        <span>Search components, tokens, docs…</span>
      </button>
    </div>

    <div class="header-spacer" />

    <!-- Navigation -->
    <nav class="header-nav">
      <NuxtLink to="/docs/components">Components</NuxtLink>
      <NuxtLink to="/tokens">Tokens</NuxtLink>
      <NuxtLink to="/docs">Guidelines</NuxtLink>
      <NuxtLink to="/docs/changelog" class="flex items-center gap-1">
        Changelog
        <UBadge color="primary" variant="soft" size="xs" :ui="{ base: 'px-1.5 py-px text-[10px]' }">3</UBadge>
      </NuxtLink>
    </nav>

    <div class="header-actions">
      <button class="header-icon-btn" title="Toggle theme" @click="toggleTheme">
        <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
      </button>
      <a href="https://github.com/opends/opends" target="_blank" class="header-icon-btn" title="GitHub">
        <UIcon name="i-lucide-github" class="size-4" />
      </a>
    </div>

    <LayoutSearchModal v-model="searchOpen" />
  </header>
</template>

<style scoped>
.docs-header {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
  flex-shrink: 0;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 248px;
  flex-shrink: 0;
}

.header-team-name {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.header-search {
  flex: 1;
  max-width: 520px;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  background: var(--surface-2);
  border: 1px solid transparent;
  border-radius: var(--r-input);
  color: var(--text-tertiary);
  font-size: 13.5px;
  cursor: pointer;
  transition: border-color var(--duration-micro);
  line-height: 1;
}
.search-trigger kbd {
  flex-shrink: 0;
  margin-right: 8px;
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  line-height: 1.3;
}

.search-trigger:hover {
  border-color: var(--border);
}
.search-trigger span {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.header-spacer {
  flex: 1;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 500;
}
.header-nav a {
  padding: 6px 10px;
  color: var(--text-secondary);
  border-radius: var(--r-input);
  text-decoration: none;
  transition: color var(--duration-micro);
}
.header-nav a:hover,
.header-nav .router-link-active {
  color: var(--text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-icon-btn {
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
.header-icon-btn:hover {
  color: var(--text);
  background: var(--surface-2);
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .docs-header {
    padding: 0 18px;
    height: 52px;
    gap: 12px;
  }
  .header-brand { width: auto; gap: 8px; }
  .header-team-name { font-size: 17px; }
  .header-search { max-width: 360px; }
  .header-nav { font-size: 13px; }
  .header-nav a { padding: 6px 8px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .docs-header {
    padding: 0 12px;
    height: 52px;
    gap: 8px;
  }
  .header-search { display: none; }
  .header-nav { display: none; }
  .header-actions { gap: 2px; }
  .header-brand { gap: 6px; }
  .header-team-name { font-size: 16px; }
}
</style>
