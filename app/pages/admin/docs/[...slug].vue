<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || 'writing-for-buttons')

const activePage = ref(slug.value)
const content = ref(`# Writing for buttons

Buttons are the most common interactive element in any interface. Good button copy makes the action clear, concise, and confident.

## Principles

### Be action-oriented
Every button should start with a verb. Users should know exactly what will happen when they click.

| ❌ Do not | ✅ Do |
|-----------|------|
| Submit | Save changes |
| OK | Confirm deletion |
| Click here | Download report |

### Keep it short
Button labels should be 1-4 words. If you need more context, put it in the surrounding copy — not the button.

### Use sentence case
Only proper nouns and the first word should be capitalised. Never use ALL CAPS for standard actions.

## Do & Don't

<div class="do-dont">
  <div class="do">
    <strong>✅ Do</strong>
    <p>Use specific verbs that describe the outcome: "Publish page", "Add collaborator", "Export CSV".</p>
  </div>
  <div class="dont">
    <strong>❌ Don't</strong>
    <p>Use vague labels like "Submit", "OK", or "Done". They don't tell the user what happens next.</p>
  </div>
</div>

## Accessibility

- Button text must be readable by screen readers. Avoid icon-only buttons without \`aria-label\`.
- Ensure 4.5:1 contrast ratio between text and background.
- Focus states must be visible — 3px Sweet Salmon ring at 30% opacity.
`)

const isDraft = ref(true)
const wordCount = computed(() => content.value.split(/\s+/).filter(Boolean).length)
const readTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)))

// Page tree
interface PageItem {
  name: string
  indent?: number
  draft?: boolean
  active?: boolean
  children?: PageItem[]
  count?: number
  open?: boolean
}

const pageTree: (PageItem | string)[] = [
  { name: 'Getting started', count: 4, open: true, children: [
    { name: 'Introduction', indent: 1 },
    { name: 'Installation', indent: 1 },
    { name: 'Theming', indent: 1 },
    { name: 'Contributing', indent: 1 },
  ]},
  { name: 'Foundations', count: 5, open: true, children: [
    { name: 'Color', indent: 1 },
    { name: 'Typography', indent: 1 },
    { name: 'Spacing', indent: 1 },
    { name: 'Radius & Shadow', indent: 1 },
    { name: 'Motion', indent: 1, draft: true },
  ]},
  { name: 'Guidelines', count: 6, open: true, children: [
    { name: 'Writing for inputs', indent: 1 },
    { name: 'Writing for buttons', indent: 1, active: true },
    { name: 'Tone & voice', indent: 1 },
    { name: 'Empty states', indent: 1 },
    { name: 'Loading & errors', indent: 1, draft: true },
    { name: 'Accessibility', indent: 1 },
  ]},
  { name: 'Changelog', count: 12 },
]

function selectPage(name: string) {
  activePage.value = name.toLowerCase().replace(/\s+/g, '-')
}

useHead({ title: computed(() => `${activePage.value.replace(/-/g, ' ')} — Edit`) })
</script>

<template>
  <div class="docs-editor-page">
    <!-- Three-column layout -->
    <div class="editor-layout">
      <!-- Left: Page tree -->
      <aside class="editor-tree">
        <div class="tree-search">
          <UInput size="sm" placeholder="Find page…" icon="i-lucide-search" />
        </div>

        <div class="tree-list">
          <template v-for="(item, i) in pageTree" :key="i">
            <template v-if="typeof item === 'object' && 'children' in item">
              <!-- Folder group -->
              <div class="tree-folder" :class="{ open: item.open }">
                <UIcon name="i-lucide-chevron-right" class="size-3.5 tree-folder-chevron" />
                <UIcon name="i-lucide-folder" class="size-3.5" />
                <span class="tree-folder-name">{{ item.name }}</span>
                <span class="tree-folder-count">{{ item.count }}</span>
              </div>
              <!-- Children -->
              <template v-if="item.open && item.children">
                <button
                  v-for="child in item.children"
                  :key="child.name"
                  class="tree-page"
                  :class="{ active: child.active, indent: child.indent }"
                  @click="selectPage(child.name)"
                >
                  <UIcon v-if="child.draft" name="i-lucide-file-text" class="size-3.5" />
                  <UIcon v-else name="i-lucide-file-text" class="size-3.5" />
                  {{ child.name }}
                </button>
              </template>
            </template>
            <template v-else-if="typeof item === 'object'">
              <!-- Simple folder (no children) -->
              <div class="tree-folder">
                <UIcon name="i-lucide-folder" class="size-3.5" />
                <span class="tree-folder-name">{{ item.name }}</span>
                <span class="tree-folder-count">{{ item.count }}</span>
              </div>
            </template>
          </template>
        </div>

        <div class="tree-new">
          <UButton variant="ghost" size="sm" icon="i-lucide-plus" block class="justify-start">New page</UButton>
        </div>
      </aside>

      <!-- Center: Editor -->
      <main class="editor-center">
        <!-- Toolbar -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <button class="toolbar-btn">
              <span class="toolbar-paragraph">Paragraph</span>
              <UIcon name="i-lucide-chevron-down" class="size-3" />
            </button>
            <span class="toolbar-divider" />
            <button class="toolbar-btn active"><UIcon name="i-lucide-bold" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-italic" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-code" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-link" class="size-4" /></button>
            <span class="toolbar-divider" />
            <button class="toolbar-btn"><UIcon name="i-lucide-heading" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-quote" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-list" class="size-4" /></button>
            <button class="toolbar-btn"><UIcon name="i-lucide-image" class="size-4" /></button>
            <span class="toolbar-divider" />
            <button class="toolbar-btn">
              <UIcon name="i-lucide-component" class="size-4" />
              <span>Component</span>
            </button>
            <button class="toolbar-btn">
              <UIcon name="i-lucide-palette" class="size-4" />
              <span>Token</span>
            </button>
          </div>
          <div class="toolbar-right">
            <span class="toolbar-stats">{{ wordCount }} words · {{ readTime }} min</span>
          </div>
        </div>

        <!-- Editor surface with Milkdown -->
        <div class="editor-surface">
          <div class="editor-breadcrumb">
            <span>Docs</span>
            <UIcon name="i-lucide-chevron-right" class="size-3" />
            <span>Guidelines</span>
            <UIcon name="i-lucide-chevron-right" class="size-3" />
            <span>Writing for buttons</span>
          </div>

          <ClientOnly>
            <EditorMilkdownEditor v-model="content" />
            <template #fallback>
              <div class="editor-loading">
                <UIcon name="i-lucide-loader-2" class="animate-spin size-6" />
                <span>Loading editor…</span>
              </div>
            </template>
          </ClientOnly>
        </div>
      </main>

      <!-- Right: Metadata panel -->
      <aside class="editor-right">
        <div class="meta-section">
          <div class="meta-heading">Visibility</div>
          <div class="meta-field">
            <UInput size="sm" value="Team" disabled />
          </div>
        </div>

        <div class="meta-section">
          <div class="meta-heading">URL slug</div>
          <div class="meta-field">
            <UInput size="sm" :value="`/docs/${activePage}`" />
          </div>
        </div>

        <div class="meta-section">
          <div class="meta-heading">Tags</div>
          <div class="meta-tags">
            <span class="meta-tag">guidelines <UIcon name="i-lucide-x" class="size-3" /></span>
            <span class="meta-tag">ux-writing <UIcon name="i-lucide-x" class="size-3" /></span>
            <button class="meta-tag-add">+ Add</button>
          </div>
        </div>

        <div class="meta-section">
          <div class="meta-heading">Status</div>
          <div class="meta-status">
            <span class="meta-dot" style="background: var(--warning)" />
            <span class="meta-status-text">Draft</span>
            <span class="meta-version">v0.3</span>
          </div>
          <div class="meta-status-desc">Last published 2 weeks ago by Jay. 14 edits since.</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.docs-editor-page {
  margin: -28px;
  height: calc(100vh - 60px);
}

.editor-layout {
  display: grid;
  grid-template-columns: 260px 1fr 260px;
  height: 100%;
}

/* ── Tree ────────────────────────────────────────────────── */
.editor-tree {
  border-right: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
}

.tree-search {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.tree-list {
  padding: 8px;
}

.tree-folder {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
}

.tree-folder-chevron {
  color: var(--text-tertiary);
  transition: transform var(--duration-micro);
}
.tree-folder.open .tree-folder-chevron { transform: rotate(90deg); }

.tree-folder :deep(svg) { color: var(--text-tertiary); }

.tree-folder-name { flex: 1; }

.tree-folder-count {
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

.tree-page {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background var(--duration-micro);
}
.tree-page:hover { background: var(--surface-2); }
.tree-page.active { color: var(--primary); background: var(--primary-soft); font-weight: 600; }
.tree-page.indent { padding-left: 28px; }
.tree-page :deep(svg) { color: var(--text-tertiary); }

.tree-new {
  padding: 0 12px 12px;
}

/* ── Editor center ───────────────────────────────────────── */
.editor-center {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  min-width: 0;
}

.editor-toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.toolbar-btn:hover { background: var(--surface-2); }
.toolbar-btn.active { color: var(--text); background: var(--surface-2); }

.toolbar-paragraph {
  font-weight: 600;
  font-size: 13px;
  padding: 0 4px;
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
  margin: 0 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-stats {
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
  margin-right: 8px;
}

/* Editor surface */
.editor-surface {
  flex: 1;
  overflow-y: auto;
}

.editor-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
  padding: 20px 64px 12px;
}

.editor-textarea {
  display: block;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 0 64px 80px;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--f-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--text);
  resize: none;
  min-height: 400px;
}
.editor-textarea::placeholder {
  color: var(--text-tertiary);
}

.editor-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}

/* ── Right panel ─────────────────────────────────────────── */
.editor-right {
  border-left: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
}

.meta-section {
  padding: 18px;
  border-bottom: 1px solid var(--border);
}

.meta-heading {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.meta-field {
  margin-bottom: 0;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--surface-2);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}
.meta-tag :deep(svg) { color: var(--text-tertiary); cursor: pointer; }

.meta-tag-add {
  font-size: 12px;
  color: var(--primary);
  background: none;
  border: 1px dashed var(--border);
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.meta-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}

.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.meta-status-text {
  flex: 1;
  font-weight: 500;
  color: var(--text);
}

.meta-version {
  color: var(--text-tertiary);
}

.meta-status-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.55;
}
</style>
