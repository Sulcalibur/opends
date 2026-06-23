<script setup lang="ts">
defineProps<{
  active?: string
}>()
</script>

<template>
  <aside class="docs-sidebar">
    <!-- Getting Started -->
    <div class="sidebar-section">Getting Started</div>
    <NuxtLink to="/docs" class="nav-item" :class="{ active: active === 'intro' }">
      <UIcon name="i-lucide-sparkles" class="size-4" />
      Introduction
    </NuxtLink>
    <NuxtLink to="/docs/installation" class="nav-item">
      <UIcon name="i-lucide-zap" class="size-4" />
      Installation
    </NuxtLink>
    <NuxtLink to="/docs/theming" class="nav-item">
      <UIcon name="i-lucide-book" class="size-4" />
      Theming
    </NuxtLink>
    <NuxtLink to="/docs/contributing" class="nav-item">
      <UIcon name="i-lucide-layers" class="size-4" />
      Contributing
    </NuxtLink>

    <!-- Foundations -->
    <div class="sidebar-section">Foundations</div>
    <NuxtLink to="/tokens" class="nav-item" :class="{ active: active === 'color' }">
      <UIcon name="i-lucide-palette" class="size-4" />
      Color
    </NuxtLink>
    <NuxtLink to="/tokens" class="nav-item">
      <UIcon name="i-lucide-type" class="size-4" />
      Typography
    </NuxtLink>
    <NuxtLink to="/tokens" class="nav-item">
      <UIcon name="i-lucide-ruler" class="size-4" />
      Spacing
    </NuxtLink>
    <NuxtLink to="/tokens" class="nav-item">
      <UIcon name="i-lucide-box" class="size-4" />
      Radius &amp; Shadow
    </NuxtLink>
    <NuxtLink to="/tokens" class="nav-item">
      <UIcon name="i-lucide-sliders-horizontal" class="size-4" />
      Motion
    </NuxtLink>

    <!-- Components -->
    <div class="sidebar-section">Components</div>
    <NuxtLink to="/docs/components" class="nav-item">Overview</NuxtLink>
    <div class="nav-subgroup">
      <div class="nav-subtitle">Inputs</div>
      <NuxtLink to="/docs/components/button" class="nav-item indent" :class="{ active: active === 'button' }">Button</NuxtLink>
      <NuxtLink to="/docs/components/checkbox" class="nav-item indent">Checkbox</NuxtLink>
      <NuxtLink to="/docs/components/input" class="nav-item indent">Input</NuxtLink>
      <NuxtLink to="/docs/components/radio-group" class="nav-item indent">Radio Group</NuxtLink>
      <NuxtLink to="/docs/components/select" class="nav-item indent">Select</NuxtLink>
      <NuxtLink to="/docs/components/switch" class="nav-item indent">Switch</NuxtLink>
      <NuxtLink to="/docs/components/textarea" class="nav-item indent">Textarea</NuxtLink>

      <div class="nav-subtitle">Display</div>
      <NuxtLink to="/docs/components/avatar" class="nav-item indent">Avatar</NuxtLink>
      <NuxtLink to="/docs/components/badge" class="nav-item indent">Badge</NuxtLink>
      <NuxtLink to="/docs/components/card" class="nav-item indent">Card</NuxtLink>
      <NuxtLink to="/docs/components/table" class="nav-item indent">Table</NuxtLink>
      <NuxtLink to="/docs/components/tooltip" class="nav-item indent">Tooltip</NuxtLink>

      <div class="nav-subtitle">Overlay</div>
      <NuxtLink to="/docs/components/dialog" class="nav-item indent">Dialog</NuxtLink>
      <NuxtLink to="/docs/components/drawer" class="nav-item indent">Drawer</NuxtLink>
      <NuxtLink to="/docs/components/popover" class="nav-item indent">Popover</NuxtLink>
      <NuxtLink to="/docs/components/toast" class="nav-item indent">Toast</NuxtLink>
    </div>

    <!-- Patterns -->
    <div class="sidebar-section">Patterns</div>
    <NuxtLink to="/docs/patterns/forms" class="nav-item">
      <UIcon name="i-lucide-file-text" class="size-4" />
      Forms
    </NuxtLink>
    <NuxtLink to="/docs/patterns/empty-states" class="nav-item">
      <UIcon name="i-lucide-file-text" class="size-4" />
      Empty States
    </NuxtLink>
    <NuxtLink to="/docs/patterns/loading" class="nav-item">
      <UIcon name="i-lucide-file-text" class="size-4" />
      Loading &amp; Errors
    </NuxtLink>

    <!-- Internal -->
    <div class="sidebar-section">Internal · Team</div>
    <NuxtLink to="/docs/internal/brand-voice" class="nav-item faint">
      <UIcon name="i-lucide-users" class="size-4" />
      Brand voice
      <UIcon name="i-lucide-lock" class="size-3 ml-auto text-[var(--text-tertiary)]" />
    </NuxtLink>
    <NuxtLink to="/docs/internal/playbook" class="nav-item faint">
      <UIcon name="i-lucide-users" class="size-4" />
      Contributor playbook
      <UIcon name="i-lucide-lock" class="size-3 ml-auto text-[var(--text-tertiary)]" />
    </NuxtLink>
    <NuxtLink to="/docs/internal/token-roadmap" class="nav-item faint">
      <UIcon name="i-lucide-users" class="size-4" />
      Token roadmap
      <UIcon name="i-lucide-lock" class="size-3 ml-auto text-[var(--text-tertiary)]" />
    </NuxtLink>

    <div class="sidebar-hint">
      3 pages need sign-in.
      <NuxtLink to="/login" class="sidebar-hint-link">Sign in →</NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.docs-sidebar {
  width: 268px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
  padding: 12px 8px 24px;
}

.sidebar-section {
  padding: 14px 14px 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.nav-item {
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
.nav-item:hover {
  background: var(--surface-2);
  color: var(--text);
}
.nav-item.active {
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
}
.nav-item.active :deep(svg) {
  color: var(--primary);
}
.nav-item :deep(svg) {
  color: var(--text-tertiary);
}

.nav-item.indent {
  padding-left: 22px;
}

.nav-item.faint {
  color: var(--text-tertiary);
}

.nav-subgroup {
  padding-left: 6px;
}

.nav-subtitle {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 8px 10px 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sidebar-hint {
  margin: 8px 12px 4px;
  padding: 8px 10px;
  background: var(--surface-2);
  border-radius: 6px;
  font-size: 11.5px;
  color: var(--text-tertiary);
  line-height: 1.45;
}

.sidebar-hint-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .docs-sidebar { width: 220px; padding: 10px 6px 24px; }
  .nav-item { font-size: 13px; padding: 6px 8px; }
  .sidebar-section { padding: 10px 10px 4px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .docs-sidebar {
    position: fixed;
    top: 52px;
    left: 0;
    bottom: 0;
    z-index: var(--z-dropdown);
    width: 280px;
    transform: translateX(-100%);
    transition: transform var(--duration-structural) var(--ease-out-quart);
  }
  .docs-sidebar.open { transform: translateX(0); }
}
</style>
