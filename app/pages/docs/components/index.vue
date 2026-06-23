<script setup lang="ts">
const searchQuery = ref('')
const selectedFilter = ref('All')

const components = ref([
  { name: 'Button', status: 'approved', tags: ['inputs', 'action'], v: '1.4.0', desc: 'Triggers an action or event. Six variants from primary CTA to inline link.' },
  { name: 'Input', status: 'approved', tags: ['inputs', 'form'], v: '1.2.1', desc: 'Single-line text field for short-form data entry.' },
  { name: 'Select', status: 'approved', tags: ['inputs', 'form'], v: '1.1.0', desc: 'Dropdown selection from a predefined list of options.' },
  { name: 'Checkbox', status: 'approved', tags: ['inputs', 'form'], v: '1.0.2', desc: 'Binary toggle for selecting one or more options.' },
  { name: 'Badge', status: 'approved', tags: ['display', 'status'], v: '1.3.0', desc: 'Small label for status, counts, or categorization.' },
  { name: 'Card', status: 'approved', tags: ['display', 'layout'], v: '1.2.0', desc: 'Container for grouping related content and actions.' },
  { name: 'Modal', status: 'approved', tags: ['overlay'], v: '1.1.1', desc: 'Overlay dialog for focused tasks or confirmations.' },
  { name: 'Toast', status: 'draft', tags: ['overlay', 'feedback'], v: '0.9.0', desc: 'Brief notification that appears and dismisses automatically.' },
  { name: 'Table', status: 'approved', tags: ['display', 'data'], v: '1.0.0', desc: 'Structured data display with sortable columns.' },
  { name: 'Avatar', status: 'approved', tags: ['display'], v: '1.1.0', desc: 'User representation with image, initials, or fallback.' },
  { name: 'Tooltip', status: 'approved', tags: ['overlay'], v: '1.0.1', desc: 'Contextual hint on hover or focus.' },
  { name: 'Tabs', status: 'approved', tags: ['navigation'], v: '1.0.0', desc: 'Organize content into switchable panels.' },
])

const statusTone: Record<string, 'success' | 'warning' | 'neutral'> = {
  approved: 'success',
  draft: 'warning',
  deprecated: 'neutral',
}

const filteredComponents = computed(() =>
  components.value.filter((c) => {
    if (searchQuery.value && !c.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (selectedFilter.value === 'Approved' && c.status !== 'approved') return false
    if (selectedFilter.value === 'Draft' && c.status !== 'draft') return false
    if (selectedFilter.value === 'Deprecated' && c.status !== 'deprecated') return false
    return true
  }),
)

useHead({ title: 'Components — Design System' })
</script>

<template>
  <div class="components-page">
    <DocsSidebar active="button" />

    <main class="components-main">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs">
        <NuxtLink to="/docs">Docs</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="size-3" />
        <span class="breadcrumb-current">Components</span>
      </div>

      <h1 class="page-title">Components</h1>
      <p class="page-subtitle">{{ components.length }} components across inputs, display, overlay, and navigation.</p>

      <!-- Toolbar -->
      <div class="toolbar">
        <UInput
          v-model="searchQuery"
          size="sm"
          placeholder="Search components…"
          icon="i-lucide-search"
          class="toolbar-search"
        />
        <div class="toolbar-filters">
          <button
            v-for="f in ['All','Approved','Draft','Deprecated']"
            :key="f"
            class="filter-chip"
            :class="{ active: selectedFilter === f }"
            @click="selectedFilter = f"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="status-tabs">
        <button
          v-for="[label, count, active] in [
            ['All', components.length, selectedFilter === 'All'],
            ['Approved', components.filter(c => c.status === 'approved').length, selectedFilter === 'Approved'],
            ['Draft', components.filter(c => c.status === 'draft').length, selectedFilter === 'Draft'],
            ['Deprecated', components.filter(c => c.status === 'deprecated').length, selectedFilter === 'Deprecated'],
          ]"
          :key="label as string"
          class="status-tab"
          :class="{ active }"
          @click="selectedFilter = label as string"
        >
          {{ label }}
          <span class="status-count">{{ count }}</span>
        </button>
      </div>

      <!-- Grid -->
      <div class="component-grid">
        <NuxtLink
          v-for="c in filteredComponents"
          :key="c.name"
          :to="`/docs/components/${c.name.toLowerCase()}`"
          class="component-card"
        >
          <div class="card-glyph">
            <span v-if="c.name === 'Button'" class="glyph-btn">Btn</span>
            <span v-else-if="c.name === 'Input'" class="glyph-input">abc</span>
            <span v-else-if="c.name === 'Select'" class="glyph-select">▼</span>
            <span v-else-if="c.name === 'Checkbox'" class="glyph-check">☑</span>
            <span v-else-if="c.name === 'Badge'" class="glyph-badge">●</span>
            <span v-else-if="c.name === 'Card'" class="glyph-card">▢</span>
            <span v-else-if="c.name === 'Modal'" class="glyph-modal">⏹</span>
            <span v-else-if="c.name === 'Toast'" class="glyph-toast">◉</span>
            <span v-else-if="c.name === 'Table'" class="glyph-table">≡</span>
            <span v-else-if="c.name === 'Avatar'" class="glyph-avatar">◐</span>
            <span v-else-if="c.name === 'Tooltip'" class="glyph-tooltip">◌</span>
            <span v-else-if="c.name === 'Tabs'" class="glyph-tabs">▬</span>
            <span v-else class="glyph-default">◆</span>
          </div>
          <div class="card-info">
            <div class="card-name">
              {{ c.name }}
              <UBadge :color="statusTone[c.status]" variant="soft" size="xs">{{ c.status }}</UBadge>
            </div>
            <div class="card-tags">
              <span v-for="t in c.tags" :key="t" class="card-tag">{{ t }}</span>
            </div>
            <div class="card-desc">{{ c.desc }}</div>
            <div class="card-meta">v{{ c.v }}</div>
          </div>
        </NuxtLink>
      </div>
    </main>

    <DocsToc :items="['Overview', 'Inputs', 'Display', 'Overlay']" active="Overview" />
  </div>
</template>

<style scoped>
.components-page {
  background: var(--bg);
}

.components-page {
  display: flex;
  min-height: calc(100vh - 56px - 57px);
}

.components-main {
  flex: 1;
  overflow-y: auto;
  padding: 40px 56px;
  min-width: 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}
.breadcrumbs a { color: var(--text-tertiary); text-decoration: none; }
.breadcrumbs a:hover { color: var(--text); }
.breadcrumb-current { color: var(--text-secondary); }

.page-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar-search {
  width: 300px;
}

.toolbar-filters {
  display: flex;
  gap: 6px;
}

.filter-chip {
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  background: var(--surface-2);
  color: var(--text-secondary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--duration-micro);
}
.filter-chip.active {
  background: var(--primary);
  color: white;
}

/* Status tabs */
.status-tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}

.status-tab {
  padding: 12px 0;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-tab.active {
  font-weight: 600;
  color: var(--text);
  border-bottom-color: var(--primary);
}

.status-count {
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

/* Grid */
.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.component-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transition: border-color var(--duration-micro), box-shadow var(--duration-micro);
}
.component-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-elevated);
}

.card-glyph {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
}

.card-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.card-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
  padding: 2px 6px;
  background: var(--surface-2);
  border-radius: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 10px;
}

.card-meta {
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}
</style>
