<script setup lang="ts">
// CmdK — Command palette overlay for searching components, tokens, docs, and actions

const isOpen = defineModel<boolean>({ default: false })
const query = ref('')
const activeScope = ref('All')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

const scopes = ['All', 'Components', 'Tokens', 'Docs', 'Settings']

interface Result {
  section: string
  icon: string
  title: string
  sub: string
  path: string
  mono?: boolean
  to?: string
}

// Hardcoded results — in production this would query an API
const allResults = computed<Result[]>(() => {
  const results: Result[] = [
    {
      section: 'Components',
      icon: 'i-lucide-component',
      title: 'Button',
      sub: 'Triggers an action or event',
      path: 'Components / Inputs',
      to: '/docs/components/button',
    },
    {
      section: 'Components',
      icon: 'i-lucide-component',
      title: 'ButtonGroup',
      sub: 'Group of related buttons',
      path: 'Components / Inputs',
      to: '/docs/components/buttongroup',
    },
    {
      section: 'Tokens',
      icon: 'i-lucide-palette',
      title: 'color.button.primary',
      sub: '#CC4128 · 27 uses',
      path: 'Tokens / Color',
      mono: true,
      to: '/tokens',
    },
    {
      section: 'Docs',
      icon: 'i-lucide-file-text',
      title: 'Writing for buttons',
      sub: 'Guidelines for button copy',
      path: 'Guidelines',
      to: '/docs',
    },
    {
      section: 'Actions',
      icon: 'i-lucide-plus',
      title: 'Create new component…',
      sub: '',
      path: 'Admin shortcut',
      to: '/admin/components/new',
    },
    {
      section: 'Actions',
      icon: 'i-lucide-moon',
      title: 'Toggle dark theme',
      sub: '',
      path: 'Preferences',
      to: '#',
    },
  ]

  if (!query.value.trim()) return results

  const q = query.value.toLowerCase()
  return results.filter(
    r => r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.path.toLowerCase().includes(q),
  )
})

const groupedResults = computed(() => {
  const groups: Record<string, Result[]> = {}
  const filtered = activeScope.value === 'All'
    ? allResults.value
    : allResults.value.filter(r => r.section === activeScope.value || (activeScope.value === 'Settings' && r.section === 'Actions'))
  for (const r of filtered) {
    if (!groups[r.section]) groups[r.section] = []
    groups[r.section].push(r)
  }
  return groups
})

const flatResults = computed(() => Object.values(groupedResults.value).flat())

const router = useRouter()

function selectResult(result: Result) {
  if (!result.to || result.to === '#') return
  isOpen.value = false
  router.push(result.to)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, flatResults.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const result = flatResults.value[activeIndex.value]
    if (result) selectResult(result)
  }
}

watch(isOpen, (val) => {
  if (val) {
    query.value = ''
    activeIndex.value = 0
    activeScope.value = 'All'
    nextTick(() => inputRef.value?.focus())
  }
})

function highlightMatch(text: string): string {
  if (!query.value.trim()) return text
  const re = new RegExp(`(${query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cmdk">
      <div v-if="isOpen" class="cmdk-overlay" @click.self="isOpen = false">
        <div class="cmdk-palette" @keydown="handleKeydown">
          <!-- Search input -->
          <div class="cmdk-search">
            <UIcon name="i-lucide-search" class="size-4 cmdk-search-icon" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search components, tokens, docs…"
              class="cmdk-input"
            />
            <kbd class="cmdk-kbd">esc</kbd>
          </div>

          <!-- Scope tabs -->
          <div class="cmdk-scopes">
            <button
              v-for="scope in scopes"
              :key="scope"
              class="cmdk-scope"
              :class="{ active: activeScope === scope }"
              @click="activeScope = scope"
            >
              {{ scope }}
            </button>
            <div class="flex-1" />
            <span class="cmdk-count">{{ flatResults.length }} results</span>
          </div>

          <!-- Results -->
          <div class="cmdk-results">
            <template v-for="(items, section) in groupedResults" :key="section">
              <div class="cmdk-section-label">{{ section }}</div>
              <button
                v-for="(result, idx) in items"
                :key="result.title"
                class="cmdk-result"
                :class="{ active: flatResults.indexOf(result) === activeIndex }"
                @click="selectResult(result)"
                @mouseenter="activeIndex = flatResults.indexOf(result)"
              >
                <span class="cmdk-result-icon" :class="{ 'cmdk-result-icon-active': flatResults.indexOf(result) === activeIndex }">
                  <UIcon :name="result.icon" class="size-3.5" />
                </span>
                <div class="cmdk-result-text">
                  <div class="cmdk-result-title" :class="{ 'cmdk-result-mono': result.mono }">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="highlightMatch(result.title)" />
                  </div>
                  <div v-if="result.sub" class="cmdk-result-sub">{{ result.sub }}</div>
                </div>
                <div class="cmdk-result-path">{{ result.path }}</div>
                <UIcon
                  v-if="flatResults.indexOf(result) === activeIndex"
                  name="i-lucide-corner-down-left"
                  class="size-3.5"
                />
              </button>
            </template>

            <div v-if="flatResults.length === 0" class="cmdk-empty">
              No results found for "{{ query }}"
            </div>
          </div>

          <!-- Footer -->
          <div class="cmdk-footer">
            <span class="cmdk-footer-hint"><kbd>↑↓</kbd> navigate</span>
            <span class="cmdk-footer-hint"><kbd>↵</kbd> open</span>
            <div class="flex-1" />
            <span class="cmdk-footer-brand">Powered by OpenDS</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cmdk-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(26, 29, 33, 0.4);
  display: flex;
  justify-content: center;
  padding-top: 120px;
}

.cmdk-palette {
  width: 640px;
  max-height: calc(100vh - 200px);
  background: var(--surface);
  border-radius: var(--r-modal);
  box-shadow: var(--shadow-pop), 0 0 0 1px var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cmdk-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}

.cmdk-search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.cmdk-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--text);
  font-family: inherit;
}
.cmdk-input::placeholder {
  color: var(--text-tertiary);
}

.cmdk-kbd {
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  line-height: 1.3;
}

.cmdk-scopes {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  align-items: center;
}

.cmdk-scope {
  padding: 4px 10px;
  font-size: 12.5px;
  font-weight: 600;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-micro);
}
.cmdk-scope:hover {
  color: var(--text);
}
.cmdk-scope.active {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.cmdk-count {
  font-size: 11.5px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
}

.cmdk-results {
  max-height: 420px;
  overflow-y: auto;
  padding: 4px 0;
}

.cmdk-section-label {
  padding: 10px 16px 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cmdk-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin: 0 6px;
  border-radius: 6px;
  cursor: pointer;
  width: calc(100% - 12px);
  border: none;
  background: transparent;
  font-family: inherit;
  text-align: left;
  transition: background var(--duration-micro);
}
.cmdk-result:hover,
.cmdk-result.active {
  background: var(--primary-soft);
}

.cmdk-result-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cmdk-result-icon-active {
  background: var(--primary);
  color: white;
}

.cmdk-result-text {
  flex: 1;
  min-width: 0;
}

.cmdk-result-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.cmdk-result.active .cmdk-result-title {
  color: var(--primary);
}
.cmdk-result-mono {
  font-family: var(--f-mono);
}

.cmdk-result-title :deep(mark) {
  background: var(--secondary-soft);
  color: var(--warning);
  padding: 0 1px;
  border-radius: 2px;
  font-weight: 700;
}

.cmdk-result-sub {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 1px;
}

.cmdk-result-path {
  font-size: 11.5px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
}

.cmdk-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 14px;
}

.cmdk-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  font-size: 11.5px;
  color: var(--text-tertiary);
}

.cmdk-footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cmdk-footer-hint kbd {
  font-family: var(--f-mono);
  font-size: 10.5px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.cmdk-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Transition */
.cmdk-enter-active,
.cmdk-leave-active {
  transition: opacity 0.15s ease;
}
.cmdk-enter-from,
.cmdk-leave-to {
  opacity: 0;
}
.cmdk-enter-active .cmdk-palette,
.cmdk-leave-active .cmdk-palette {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.cmdk-enter-from .cmdk-palette {
  transform: translateY(-8px) scale(0.98);
  opacity: 0;
}
.cmdk-leave-to .cmdk-palette {
  transform: translateY(-4px) scale(0.99);
  opacity: 0;
}
</style>
