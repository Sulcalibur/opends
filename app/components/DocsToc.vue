<script setup lang="ts">
defineProps<{
  items?: string[]
  active?: string
}>()
</script>

<template>
  <aside class="docs-toc">
    <div class="toc-heading">On this page</div>
    <div class="toc-items">
      <a
        v-for="item in items"
        :key="item"
        href="#"
        class="toc-item"
        :class="{ active: item === active }"
      >
        {{ item }}
      </a>
    </div>
    <div class="toc-meta">
      <span class="toc-meta-row">
        <UIcon name="i-lucide-edit" class="size-3.5" />
        Edit on GitHub
      </span>
      <span class="toc-meta-row">
        <UIcon name="i-lucide-clock" class="size-3.5" />
        Updated 2 days ago
      </span>
    </div>
  </aside>
</template>

<style scoped>
.docs-toc {
  width: 220px;
  flex-shrink: 0;
  padding: 32px 20px 32px 16px;
  overflow-y: auto;
  border-left: 1px solid var(--border);
}

.toc-heading {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.toc-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-item {
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-left: 2px solid transparent;
  margin-left: -2px;
  text-decoration: none;
  transition: color 0.12s;
}
.toc-item:hover {
  color: var(--text);
}
.toc-item.active {
  font-weight: 600;
  color: var(--primary);
  border-left-color: var(--primary);
}

.toc-meta {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-meta-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}
.toc-meta-row :deep(svg) {
  color: var(--text-tertiary);
}
</style>
