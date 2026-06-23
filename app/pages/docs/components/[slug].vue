<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

interface ComponentData {
  id: string
  name: string
  display_name: string
  description: string
  category: string
  status: string
  version: string
  source_path: string
  tags: string[]
  spec: {
    variants: { name: string; label: string; description: string }[]
    props: { name: string; type: string; default: string; description: string }[]
    a11y: { check: string; result: string; detail: string; pass: boolean }[]
  }
}

// Fetch component from API
const { data, pending, error: fetchError } = await useFetch<{
  success: boolean
  data: { component: ComponentData }
}>(`/api/components/by-slug/${slug.value}`).catch(() => ({ data: ref(null), pending: ref(false), error: ref(null) }))

const component = computed(() => data.value?.data?.component || null)

// Fallback data for when API isn't fully populated
const fallback: ComponentData = {
  id: 'btn-1',
  name: 'Button',
  display_name: 'Button',
  description: 'Triggers an action or event. The button is OpenDS\' most overloaded primitive — every variant maps to a specific role in the action hierarchy.',
  category: 'Inputs',
  status: 'Approved',
  version: 'v1.4.0',
  source_path: 'app/components/UButton.vue',
  tags: ['inputs', 'action', 'a11y-aa'],
  spec: {
    variants: [
      { name: 'Primary', label: 'primary', description: 'The single most important action on a page.' },
      { name: 'Secondary', label: 'secondary', description: 'Lower-emphasis action paired with primary.' },
      { name: 'Soft', label: 'soft', description: 'Tinted action for repeat actions in toolbars.' },
      { name: 'Ghost', label: 'ghost', description: 'Minimal weight, no chrome.' },
      { name: 'Danger', label: 'danger', description: 'Destructive or irreversible action.' },
      { name: 'Link', label: 'link', description: 'Inline navigation action.' },
    ],
    props: [
      { name: 'label', type: 'string', default: '—', description: 'Visible text. Required if not icon-only.' },
      { name: 'variant', type: '"primary" | "secondary" | "soft" | "ghost" | "danger" | "link"', default: '"primary"', description: 'Visual emphasis level.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Affects height, padding, font size.' },
      { name: 'icon', type: 'string | Component', default: '—', description: 'Lucide name or icon component.' },
      { name: 'trailing-icon', type: 'string | Component', default: '—', description: 'Icon on the right side.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner, disables interaction.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Fully disables and removes from tab order.' },
      { name: 'block', type: 'boolean', default: 'false', description: 'Fills available width.' },
    ],
    a11y: [
      { check: 'Focus visible', result: 'Pass', detail: '3px Sweet Salmon ring at 30% opacity on :focus-visible', pass: true },
      { check: 'Color contrast', result: 'Pass', detail: 'AAA · 14.2:1', pass: true },
      { check: 'Screen reader', result: 'Pass', detail: 'role="button" + aria-label when icon-only', pass: true },
      { check: 'Keyboard', result: 'Pass', detail: 'Enter | Space activator', pass: true },
      { check: 'Touch target', result: 'Pass', detail: 'Min 44×44px', pass: true },
      { check: 'Motion safe', result: 'Pass', detail: '150ms fade, respects prefers-reduced-motion', pass: true },
    ],
  },
}

const display = computed(() => component.value || fallback)
const statusTone = computed(() => display.value.status === 'Approved' ? 'success' : 'warning')

const activeVariant = ref('primary')
const activeSize = ref('lg')
const showIcon = ref(false)
const isLoading = ref(false)

const variantOptions = computed(() => display.value.spec.variants.map(v => v.label || v.name.toLowerCase()))
const sizeOptions = ['sm', 'md', 'lg']

useHead({ title: `${display.value.display_name || display.value.name} — OpenDS` })
</script>

<template>
  <div class="component-detail-page" v-if="display">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs">
      <NuxtLink to="/docs/components">Components</NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      <span>{{ display.category }}</span>
      <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      <span class="breadcrumb-current">{{ display.display_name || display.name }}</span>
    </nav>

    <!-- Title row -->
    <div class="title-row">
      <h1 class="component-title">{{ display.display_name || display.name }}</h1>
      <UBadge :color="statusTone" variant="soft" size="sm">
        <template #leading><span class="status-dot" /></template>
        {{ display.status }}
      </UBadge>
      <UBadge color="neutral" variant="soft" size="sm" class="font-mono text-xs">{{ display.version }}</UBadge>
    </div>

    <p class="component-description">{{ display.description }}</p>

    <!-- Tags row -->
    <div class="tags-row">
      <UBadge v-for="tag in display.tags" :key="tag" color="neutral" variant="soft" size="xs">
        <UIcon name="i-lucide-tag" class="size-2.5" /> {{ tag }}
      </UBadge>
      <span class="tags-divider" />
      <span class="source-path">
        Source: <code>{{ display.source_path }}</code>
      </span>
    </div>

    <!-- ═══ LIVE PREVIEW SANDBOX ═══ -->
    <section class="sandbox-section">
      <h2 id="sandbox" class="section-heading">Live preview</h2>
      <div class="sandbox">
        <div class="sandbox-canvas" :data-variant="`${activeVariant}-${activeSize}`">
          <UButton
            :variant="activeVariant as any"
            :size="activeSize as any"
            :loading="isLoading"
            :icon="showIcon ? 'i-lucide-sparkles' : undefined"
          >
            Generate suggestions
          </UButton>
        </div>
        <div class="sandbox-controls">
          <div class="control">
            <span class="control-label">variant</span>
            <div class="segmented">
              <button
                v-for="opt in variantOptions"
                :key="opt"
                class="segmented-btn"
                :class="{ active: activeVariant === opt }"
                @click="activeVariant = opt"
              >{{ opt }}</button>
            </div>
          </div>
          <div class="control">
            <span class="control-label">size</span>
            <div class="segmented">
              <button
                v-for="opt in sizeOptions"
                :key="opt"
                class="segmented-btn"
                :class="{ active: activeSize === opt }"
                @click="activeSize = opt"
              >{{ opt }}</button>
            </div>
          </div>
          <div class="control">
            <span class="control-label">icon</span>
            <UToggle v-model="showIcon" />
          </div>
          <div class="control">
            <span class="control-label">loading</span>
            <UToggle v-model="isLoading" />
          </div>
        </div>
        <div class="sandbox-code">
          <div class="code-block">
            <span class="code-tag">&lt;UButton</span>
            <template v-if="showIcon"><br/>  <span class="code-attr">icon</span>=<span class="code-str">"i-lucide-sparkles"</span></template>
            <br/>  <span class="code-attr">size</span>=<span class="code-str">"{{ activeSize }}"</span>
            <br/>  <span class="code-attr">variant</span>=<span class="code-str">"{{ activeVariant }}"</span>
            <template v-if="isLoading"><br/>  <span class="code-attr">loading</span></template>
            <br/><span class="code-tag">&gt;</span>
            <br/>  Generate suggestions
            <br/><span class="code-tag">&lt;/UButton&gt;</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ VARIANTS GRID ═══ -->
    <section class="variants-section">
      <h2 id="variants" class="section-heading">Variants</h2>
      <p class="section-subtitle">{{ display.spec.variants.length }} variants cover the action hierarchy from primary CTA down to inline link. Use one per area.</p>
      <div class="variants-grid">
        <div
          v-for="variant in display.spec.variants"
          :key="variant.name"
          class="variant-card"
        >
          <div class="variant-card-header">{{ variant.name }}</div>
          <div class="variant-card-preview">
            <UButton :variant="(variant.label || variant.name.toLowerCase()) as any" size="sm">
              {{ variant.name === 'Danger' ? 'Delete item' : variant.name === 'Link' ? 'Learn more' : variant.name === 'Ghost' ? 'Skip' : variant.name === 'Soft' ? 'Filter' : variant.name === 'Secondary' ? 'Cancel' : 'Save changes' }}
            </UButton>
          </div>
          <p class="variant-card-desc">{{ variant.description }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ PROPS TABLE ═══ -->
    <section>
      <h2 id="props" class="section-heading" style="margin-bottom: 12px">Props</h2>
      <div class="props-table">
        <div class="props-head">
          <span>Name</span><span>Type</span><span>Default</span><span>Description</span>
        </div>
        <div v-for="(prop, i) in display.spec.props" :key="prop.name" class="props-row" :class="{ last: i === display.spec.props.length - 1 }">
          <span class="props-name">{{ prop.name }}</span>
          <span class="props-type">{{ prop.type }}</span>
          <span class="props-default">{{ prop.default }}</span>
          <span class="props-desc">{{ prop.description }}</span>
        </div>
      </div>
    </section>

    <!-- ═══ ACCESSIBILITY ═══ -->
    <section>
      <h2 id="a11y" class="section-heading" style="margin-bottom: 12px">Accessibility</h2>
      <div class="a11y-grid">
        <div v-for="item in display.spec.a11y" :key="item.check" class="a11y-card">
          <span class="a11y-badge" :class="{ pass: item.pass, fail: !item.pass }">
            <UIcon :name="item.pass ? 'i-lucide-check' : 'i-lucide-x'" class="size-3.5" />
          </span>
          <div>
            <div class="a11y-title">{{ item.check }}</div>
            <div class="a11y-detail">{{ item.result }} · {{ item.detail }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading state -->
  <div v-else-if="pending" class="loading-state">
    <UIcon name="i-lucide-loader-2" class="animate-spin size-8" />
    <span>Loading component…</span>
  </div>

  <!-- Error state -->
  <div v-else class="error-state">
    <UIcon name="i-lucide-alert-triangle" class="size-8" />
    <h2>Component not found</h2>
    <p>The component "{{ slug }}" doesn't exist or has been removed.</p>
    <UButton to="/docs/components">Browse components</UButton>
  </div>
</template>

<style scoped>
.component-detail-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 0 80px;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-tertiary);
  margin-bottom: 20px;
  font-weight: 500;
}
.breadcrumbs a { color: var(--text-secondary); text-decoration: none; }
.breadcrumbs a:hover { color: var(--primary); }
.breadcrumb-current { color: var(--text-secondary); }

/* Title */
.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.component-title {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--success);
  display: inline-block;
}

.component-description {
  font-size: 17px;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 720px;
  margin-bottom: 16px;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}
.tags-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
  margin: 0 6px;
}
.source-path {
  font-size: 12.5px;
  color: var(--text-tertiary);
}
.source-path code {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--f-mono);
}

/* Section headings */
.section-heading {
  font-size: 26px;
  font-weight: 700;
  margin-top: 56px;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.section-subtitle {
  font-size: 14.5px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.55;
  max-width: 720px;
}

/* ═══ SANDBOX ═══ */
.sandbox-section { margin-top: 32px; }
.sandbox-section .section-heading { margin-top: 0; }

.sandbox {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
  background: var(--surface);
}
.sandbox-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 140px;
}
.sandbox-controls {
  padding: 18px;
  background: var(--surface-2);
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.sandbox-code {
  border-top: 1px solid var(--border);
  background: var(--bg);
  padding: 20px;
}

/* Code block */
.code-block {
  font-family: var(--f-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text);
}
.code-tag { color: var(--text-tertiary); }
.code-attr { color: var(--info); }
.code-str  { color: var(--success); }

/* Control */
.control {
  display: flex;
  align-items: center;
  gap: 10px;
}
.control-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  font-family: var(--f-mono);
  width: 52px;
  flex-shrink: 0;
}

/* Segmented */
.segmented {
  display: flex;
  gap: 3px;
  background: var(--surface);
  padding: 3px;
  border-radius: 6px;
  border: 1px solid var(--border);
}
.segmented-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--duration-micro);
}
.segmented-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-card);
}

/* ═══ VARIANTS ═══ */
.variants-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
}
.variant-card {
  padding: 20px 18px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.variant-card:nth-child(3n) { border-right: none; }
.variant-card:nth-child(n+4) { border-bottom: none; }
.variant-card-header {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}
.variant-card-preview {
  margin-bottom: 12px;
  min-height: 32px;
  display: flex;
  align-items: center;
}
.variant-card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* ═══ PROPS TABLE ═══ */
.props-table {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
}
.props-head {
  display: grid;
  grid-template-columns: 140px 1fr 100px 1.3fr;
  padding: 12px 20px;
  background: var(--surface-2);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}
.props-row {
  display: grid;
  grid-template-columns: 140px 1fr 100px 1.3fr;
  padding: 14px 20px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.props-row.last { border-bottom: none; }
.props-name { font-family: var(--f-mono); font-weight: 600; color: var(--text); }
.props-type { font-family: var(--f-mono); color: var(--info); font-size: 12px; }
.props-default { font-family: var(--f-mono); color: var(--text-secondary); }
.props-desc { color: var(--text-secondary); }

/* ═══ ACCESSIBILITY ═══ */
.a11y-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.a11y-card {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--surface);
}
.a11y-badge {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.a11y-badge.pass { background: var(--success-soft); color: var(--success); }
.a11y-badge.fail { background: var(--danger-soft); color: var(--danger); }
.a11y-title { font-weight: 600; font-size: 14px; margin-bottom: 3px; }
.a11y-detail { font-size: 12.5px; color: var(--text-secondary); line-height: 1.55; }

/* States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 24px;
  text-align: center;
  color: var(--text-secondary);
}

/* ── Tablet ── */
@media (max-width: 834px) {
  .variants-grid { grid-template-columns: repeat(2, 1fr); }
  .variant-card:nth-child(2n) { border-right: none; }
  .variant-card:nth-child(3n) { border-right: 1px solid var(--border); }
  .variant-card:nth-child(n+3) { border-bottom: 1px solid var(--border); }
  .a11y-grid { grid-template-columns: repeat(2, 1fr); }
  .props-head, .props-row {
    grid-template-columns: 120px 1fr 80px 1fr;
  }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .component-title { font-size: 32px; }
  .component-description { font-size: 15px; }
  .variants-grid { grid-template-columns: 1fr; }
  .variant-card { border-right: none; }
  .variant-card:nth-child(3n) { border-right: none; }
  .variant-card:nth-child(n+2) { border-bottom: 1px solid var(--border); }
  .a11y-grid { grid-template-columns: 1fr; }
  .props-head, .props-row {
    grid-template-columns: 100px 1fr 70px 1fr;
    font-size: 11px;
  }
  .sandbox-controls { flex-direction: column; }
  .section-heading { font-size: 22px; margin-top: 40px; }
}
</style>
