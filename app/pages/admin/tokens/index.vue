<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

// Token tree
interface TokenGroup {
  name: string
  open: boolean
  count: number
  active?: boolean
  children?: TokenGroup[]
}

const tree = ref<TokenGroup[]>([
  { name: 'color', open: true, count: 88, children: [
    { name: 'primary', open: true, count: 11, active: true },
    { name: 'secondary', count: 11 },
    { name: 'neutral', count: 22 },
    { name: 'success', count: 11 },
    { name: 'warning', count: 11 },
    { name: 'danger', count: 11 },
    { name: 'info', count: 11 },
  ]},
  { name: 'space', count: 12 },
  { name: 'radius', count: 6 },
  { name: 'shadow', count: 4 },
  { name: 'font', open: false, count: 38, children: [
    { name: 'family', count: 3 },
    { name: 'size', count: 10 },
    { name: 'weight', count: 6 },
    { name: 'line-height', count: 5 },
    { name: 'letter-spacing', count: 4 },
  ]},
  { name: 'motion', count: 8 },
  { name: 'z-index', count: 6 },
])

const treeFilter = ref('')
const selectedGroup = ref('color.primary')

interface TokenRow {
  shade: number
  value: string
  aliases: string[]
  used: number
}

const tokens: TokenRow[] = [
  [50, '#FFF1ED', ['--bg-primary-soft'], 4],
  [100, '#FFE2DA', [], 3],
  [200, '#FFC4B5', ['--border-primary'], 7],
  [300, '#FFA590', [], 2],
  [400, '#FF8770', [], 5],
  [500, '#FF6B4A', ['--primary', '--color-primary-500'], 48],
  [600, '#E85A3A', ['--primary-hover', '--color-primary-600'], 12],
  [700, '#C44A2D', [], 3],
  [800, '#9E3C24', [], 1],
  [900, '#7D301D', [], 0],
  [950, '#44180D', [], 2],
].map(([shade, value, aliases, used]) => ({ shade, value, aliases, used } as TokenRow))

const selectedTokenIndex = ref(4) // 500
const selectedToken = computed(() => tokens[selectedTokenIndex.value])

const editName = ref('color.primary.500')
const editValue = ref('#FF6B4A')
const editDesc = ref('Sweet Salmon — primary CTAs, focus rings, active navigation. Use sparingly; one CTA per screen.')

function selectGroup(group: TokenGroup) {
  group.active = true
  selectedGroup.value = group.name
  tree.value.forEach(g => {
    if (g !== group) {
      g.active = false
      g.children?.forEach(c => c.active = false)
      if (!g.children) g.active = false
    }
  })
}

function selectChildGroup(parent: TokenGroup, child: TokenGroup) {
  parent.active = false
  parent.children?.forEach(c => c.active = false)
  child.active = true
  selectedGroup.value = `${parent.name}.${child.name}`
}

function toggleGroup(group: TokenGroup) {
  group.open = !group.open
}

// Fetch tokens from API
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/tokens')
    const apiTokens = (data.value as any)?.tokens || (data.value as any)?.data || []

    if (apiTokens.length > 0) {
      // Build tree from token categories
      const categoryMap = new Map<string, { tokens: any[]; count: number }>()
      apiTokens.forEach((t: any) => {
        const cat = t.category || t.name?.split('.')[0] || 'other'
        if (!categoryMap.has(cat)) categoryMap.set(cat, { tokens: [], count: 0 })
        const entry = categoryMap.get(cat)!
        entry.tokens.push(t)
        entry.count++
      })

      // Update tree with real counts
      tree.value = tree.value.map(g => {
        const match = categoryMap.get(g.name)
        if (match) {
          g.count = match.count
          g.children?.forEach(c => {
            const childCount = match.tokens.filter((t: any) =>
              t.name?.includes(c.name)
            ).length
            c.count = childCount || c.count
          })
        }
        return g
      })

      // Populate token rows from API data
      const colorTokens = apiTokens.filter((t: any) =>
        t.category === 'color' || t.name?.startsWith('color.')
      )
      if (colorTokens.length > 0) {
        tokens.length = 0
        tokens.push(...colorTokens.map((t: any) => ({
          shade: parseInt(t.name?.split('.').pop()) || 0,
          value: typeof t.value === 'string' ? t.value : (t.value?.hex || t.value?.value || '#FF6B4A'),
          aliases: t.aliases || t.alias ? [t.aliases || t.alias] : [],
          used: t.usage_count || 0,
        })))
        tokens.sort((a, b) => a.shade - b.shade)
      }
    }
  } catch { /* keep fallback data */ }
  loading.value = false
})

useHead({ title: 'Tokens — Admin' })
</script>

<template>
  <div class="tokens-page">
    <!-- Three-column layout -->
    <div class="tokens-layout">
      <!-- Left: Tree -->
      <aside class="tokens-tree">
        <div class="tree-search">
          <UInput v-model="treeFilter" size="sm" placeholder="Filter 218 tokens…" icon="i-lucide-search" />
        </div>

        <div class="tree-list">
          <div v-for="group in tree" :key="group.name">
            <!-- Group -->
            <button
              class="tree-group"
              :class="{ active: group.active && !group.children?.length }"
              @click="group.children?.length ? toggleGroup(group) : selectGroup(group)"
            >
              <UIcon
                :name="group.open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="size-3.5 tree-chevron"
                :class="{ invisible: !group.children?.length }"
              />
              <UIcon name="i-lucide-folder" class="size-3.5" />
              <span class="tree-name">{{ group.name }}</span>
              <span class="tree-count">{{ group.count }}</span>
            </button>

            <!-- Children -->
            <div v-if="group.open && group.children">
              <button
                v-for="child in group.children"
                :key="child.name"
                class="tree-child"
                :class="{ active: child.active }"
                @click="selectChildGroup(group, child)"
              >
                <span class="tree-name">{{ child.name }}</span>
                <span class="tree-count" :class="{ active: child.active }">{{ child.count }}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center: Token list -->
      <main class="tokens-main">
        <!-- Breadcrumb -->
        <div class="token-breadcrumb">
          <span>color</span><UIcon name="i-lucide-chevron-right" class="size-3" /><span>primary</span>
        </div>

        <div class="token-header">
          <h2 class="token-title">color.primary</h2>
          <div class="token-header-right">
            <UBadge color="success" variant="soft" size="xs">11 tokens</UBadge>
            <span class="token-meta">· edited 2d ago by Sun</span>
          </div>
        </div>

        <p class="token-desc">
          Sweet Salmon ramp. Used for primary CTAs, focus rings, and active navigation.
          Aliased to <code>--primary</code> in the runtime stylesheet.
        </p>

        <!-- Token table -->
        <div class="token-table">
          <div class="token-table-head">
            <span></span><span>Name</span><span>Value</span><span>Aliases</span><span>Used</span><span></span>
          </div>

          <div
            v-for="(t, i) in tokens"
            :key="t.shade"
            class="token-table-row"
            :class="{ selected: i === selectedTokenIndex }"
            @click="selectedTokenIndex = i"
          >
            <div class="token-swatch" :style="{ background: t.value }" />
            <span class="token-cell-name">color.primary.{{ t.shade }}</span>
            <span class="token-cell-value">{{ t.value }}</span>
            <div class="token-cell-aliases">
              <span v-for="a in t.aliases" :key="a" class="alias-chip">{{ a }}</span>
              <span v-if="!t.aliases.length" class="token-none">—</span>
            </div>
            <span class="token-cell-used">{{ t.used || '—' }}</span>
            <UIcon name="i-lucide-more-horizontal" class="size-4 token-cell-more" />
          </div>
        </div>
      </main>

      <!-- Right: Properties panel -->
      <aside class="tokens-props" v-if="selectedToken">
        <div class="props-header">Properties</div>

        <div class="props-preview">
          <div class="props-swatch" :style="{ background: selectedToken.value }" />
          <span class="props-value">{{ selectedToken.value }}</span>
        </div>

        <div class="props-fields">
          <div class="prop-field">
            <label class="prop-label">Name</label>
            <UInput v-model="editName" size="sm" class="prop-mono" />
          </div>

          <div class="prop-field">
            <label class="prop-label">Value</label>
            <div class="prop-value-row">
              <UInput v-model="editValue" size="sm" class="prop-mono flex-1" />
              <div class="prop-color-dot" :style="{ background: editValue }" />
            </div>
          </div>

          <div class="prop-field">
            <label class="prop-label">Aliases</label>
            <div class="prop-aliases">
              <span v-for="a in selectedToken.aliases" :key="a" class="alias-chip removable">
                {{ a }}
                <UIcon name="i-lucide-x" class="size-3" />
              </span>
              <button class="alias-add">+ Add</button>
            </div>
          </div>

          <div class="prop-field">
            <label class="prop-label">Description</label>
            <textarea
              v-model="editDesc"
              class="prop-textarea"
              rows="4"
            />
          </div>

          <div class="prop-actions">
            <UButton variant="outline" size="sm" block>Cancel</UButton>
            <UButton size="sm" block>Apply</UButton>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tokens-page {
  margin: -28px;
  height: calc(100vh - 60px);
}

.tokens-layout {
  display: grid;
  grid-template-columns: 320px 1fr 380px;
  height: 100%;
}

/* ── Tree ────────────────────────────────────────────────── */
.tokens-tree {
  border-right: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
}

.tree-search {
  padding: 12px;
}

.tree-list {
  padding: 0 4px 24px;
}

.tree-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background var(--duration-micro);
}
.tree-group:hover { background: var(--surface-2); }
.tree-group.active { color: var(--primary); background: var(--primary-soft); }

.tree-chevron { color: var(--text-tertiary); flex-shrink: 0; }
.tree-chevron.invisible { visibility: hidden; }

.tree-name {
  flex: 1;
  font-family: var(--f-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-count {
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}
.tree-count.active { color: var(--primary); opacity: 0.7; }

.tree-child {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px 5px 30px;
  border-radius: 6px;
  font-family: var(--f-mono);
  font-size: 12.5px;
  color: var(--text-secondary);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background var(--duration-micro);
}
.tree-child:hover { background: var(--surface-2); }
.tree-child.active { color: var(--primary); font-weight: 600; background: var(--primary-soft); }

/* ── Main ────────────────────────────────────────────────── */
.tokens-main {
  overflow-y: auto;
  padding: 28px;
  background: var(--bg);
}

.token-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
  margin-bottom: 12px;
}

.token-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 6px;
}

.token-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0;
}

.token-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-meta {
  font-size: 12px;
  color: var(--text-tertiary);
}

.token-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  max-width: 520px;
  line-height: 1.55;
}
.token-desc code {
  font-family: var(--f-mono);
  background: var(--surface-2);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12.5px;
  color: var(--text);
}

/* ── Token table ─────────────────────────────────────────── */
.token-table {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  background: var(--surface);
  overflow: hidden;
}

.token-table-head {
  display: grid;
  grid-template-columns: 60px 1.4fr 120px 1fr 90px 36px;
  padding: 10px 16px;
  background: var(--surface-2);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.token-table-row {
  display: grid;
  grid-template-columns: 60px 1.4fr 120px 1fr 90px 36px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  cursor: pointer;
  transition: background var(--duration-micro);
}
.token-table-row:last-child { border-bottom: none; }
.token-table-row:hover { background: var(--surface-2); }
.token-table-row.selected { background: var(--primary-soft); }

.token-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.token-cell-name { font-family: var(--f-mono); font-weight: 500; color: var(--text); }
.token-cell-value { font-family: var(--f-mono); font-size: 12px; color: var(--text-secondary); }
.token-cell-used { font-variant-numeric: tabular-nums; color: var(--text-secondary); }
.token-cell-more { color: var(--text-tertiary); cursor: pointer; }
.token-none { color: var(--text-tertiary); }

.alias-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--surface-2);
  border-radius: 4px;
  font-family: var(--f-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.alias-chip.removable { padding-right: 4px; }
.alias-chip :deep(svg) { color: var(--text-tertiary); }

/* ── Properties panel ────────────────────────────────────── */
.tokens-props {
  border-left: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
  padding: 20px;
}

.props-header {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.props-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  margin-bottom: 20px;
}

.props-swatch {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}

.props-value {
  font-family: var(--f-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.props-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.prop-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prop-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.prop-mono {
  font-family: var(--f-mono);
}

.prop-value-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.prop-color-dot {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.prop-aliases {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.alias-add {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  background: none;
  border: 1px dashed var(--border);
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.prop-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  font-size: 13px;
  font-family: inherit;
  border: 1px solid var(--border);
  border-radius: var(--r-input);
  background: var(--surface);
  outline: none;
  resize: vertical;
  line-height: 1.5;
  color: var(--text);
}
.prop-textarea:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
}

.prop-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .tokens-layout { grid-template-columns: 1fr; }
  .tokens-tree { display: none; }
  .tokens-main { padding: 16px; }
}
</style>
