<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string || 'button')

// Tabs
const activeTab = ref('Props')

// Variants — NuxtUI v4 button variant vocabulary (solid/outline/soft/subtle/ghost/link)
type VariantKey = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
const variants: VariantKey[] = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']
const activeVariant = ref<VariantKey>('solid')

// Prop editor state
const propType = ref('enum')
const allowedValues = ref(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'])
const propDefault = ref('solid')
const propRequired = ref(false)
const propDesc = ref('Visual emphasis level. Use primary for the single most important action on a page.')

function addValue() {
  allowedValues.value.push('')
}
function removeValue(index: number) {
  allowedValues.value.splice(index, 1)
}

// Code output
const codeOutput = computed(() => {
  const parts: string[] = ['<UButton']
  parts.push(`  variant="${activeVariant.value}"`)
  parts.push(`  size="md"`)
  parts.push(`  @click="handleClick"`)
  parts.push('>')
  parts.push('  Save changes')
  parts.push('</UButton>')
  return parts.join('\n')
})

useHead({ title: computed(() => `${slug.value} — Edit`) })
</script>

<template>
  <div class="editor-page">
    <!-- Tabs -->
    <div class="editor-tabs">
      <button
        v-for="tab in ['Overview', 'Variants', 'Props', 'Code', 'Guidelines', 'Changelog']"
        :key="tab"
        class="editor-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
      <div class="editor-tabs-right">
        <UBadge color="warning" variant="soft" size="xs">Unsaved changes</UBadge>
        <UButton size="xs" color="primary">Publish</UButton>
      </div>
    </div>

    <!-- Three-column editor layout -->
    <div class="editor-layout">
      <!-- Left: Variants & States -->
      <aside class="editor-left">
        <div class="editor-left-head">Variants</div>
        <div class="variant-list">
          <button
            v-for="v in variants"
            :key="v"
            class="variant-item"
            :class="{ active: activeVariant === v }"
            @click="activeVariant = v"
          >
            <span class="variant-dot" :class="v" />
            <span class="variant-name">{{ v }}</span>
          </button>
        </div>

        <div class="editor-left-head" style="margin-top: 20px">States</div>
        <div class="variant-list">
          <div v-for="s in ['Default','Hover','Active','Disabled','Loading']" :key="s" class="variant-item muted">
            <span class="variant-dot faded" />
            <span class="variant-name">{{ s }}</span>
          </div>
        </div>
      </aside>

      <!-- Center: Preview Canvas -->
      <main class="editor-center">
        <div class="canvas">
          <!-- Variant preview -->
          <div class="canvas-section">
            <div class="canvas-label">{{ activeVariant }}</div>
            <div class="canvas-row">
              <UButton :variant="activeVariant" size="md">Save changes</UButton>
              <UButton variant="outline" size="md">Cancel</UButton>
            </div>
          </div>

          <!-- Icon variant -->
          <div class="canvas-section">
            <div class="canvas-label">With icon</div>
            <div class="canvas-row">
              <UButton :variant="activeVariant" icon="i-lucide-check" size="md">Save changes</UButton>
              <UButton variant="outline" icon="i-lucide-x" size="md">Cancel</UButton>
            </div>
          </div>

          <!-- Sizes -->
          <div class="canvas-section">
            <div class="canvas-label">Sizes</div>
            <div class="canvas-row">
              <UButton :variant="activeVariant" size="sm">Small</UButton>
              <UButton :variant="activeVariant" size="md">Medium</UButton>
              <UButton :variant="activeVariant" size="lg">Large</UButton>
            </div>
          </div>

          <!-- Icon-only -->
          <div class="canvas-section">
            <div class="canvas-label">Icon-only</div>
            <div class="canvas-row">
              <UButton :variant="activeVariant" icon="i-lucide-plus" size="lg" />
              <UButton :variant="activeVariant" icon="i-lucide-star" size="lg" />
            </div>
          </div>

          <!-- Block -->
          <div class="canvas-section">
            <div class="canvas-label">Block</div>
            <UButton :variant="activeVariant" block size="md">Save changes</UButton>
          </div>
        </div>

        <!-- Code output -->
        <div class="canvas-code">
          <div class="canvas-code-header">
            <span>Vue · UButton</span>
            <UButton variant="ghost" size="xs" icon="i-lucide-copy">Copy</UButton>
          </div>
          <pre class="code-out"><code>{{ codeOutput }}</code></pre>
        </div>
      </main>

      <!-- Right: Prop Editor -->
      <aside class="editor-right">
        <div class="prop-editor-head">
          <div class="prop-editor-head-row">
            <span class="prop-editor-name">variant</span>
            <UBadge color="warning" variant="soft" size="xs">edited</UBadge>
          </div>
          <p class="prop-editor-sub">Affects visual emphasis. One of 6 enum values.</p>
        </div>

        <div class="prop-editor-body">
          <!-- Type -->
          <div class="prop-field">
            <label class="prop-label">Type</label>
            <div class="segmented">
              <button
                v-for="t in ['enum', 'string', 'bool']"
                :key="t"
                class="segmented-btn"
                :class="{ active: propType === t }"
                @click="propType = t"
              >{{ t }}</button>
            </div>
          </div>

          <!-- Allowed values -->
          <div v-if="propType === 'enum'" class="prop-field">
            <label class="prop-label">Allowed values</label>
            <div class="allowed-values-list">
              <div v-for="(v, i) in allowedValues" :key="i" class="allowed-value-row">
                <span class="allowed-value-text">{{ v }}</span>
                <button class="allowed-value-remove" @click="removeValue(i)">
                  <UIcon name="i-lucide-x" class="size-3" />
                </button>
              </div>
              <UButton variant="ghost" size="xs" icon="i-lucide-plus" @click="addValue">Add value</UButton>
            </div>
          </div>

          <!-- Default -->
          <div class="prop-field">
            <label class="prop-label">Default</label>
            <UInput v-model="propDefault" size="sm" />
          </div>

          <!-- Required -->
          <div class="prop-field">
            <label class="prop-label">Required</label>
            <div class="switch-row">
              <span class="switch-label">{{ propRequired ? 'true' : 'false' }}</span>
              <button class="toggle-switch" :class="{ on: propRequired }" @click="propRequired = !propRequired">
                <span class="toggle-knob" />
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="prop-field">
            <label class="prop-label">Description</label>
            <UTextarea v-model="propDesc" :rows="3" size="sm" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  margin: -28px;
  height: calc(100vh - 60px);
}

/* Tabs */
.editor-tabs {
  display: flex;
  gap: 0;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
  align-items: center;
}
.editor-tab {
  padding: 12px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: all var(--duration-micro);
}
.editor-tab.active {
  font-weight: 600;
  color: var(--text);
  border-bottom-color: var(--primary);
}
.editor-tabs-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Three-column layout */
.editor-layout {
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  height: calc(100vh - 60px - 41px);
}

/* Left: Variants */
.editor-left {
  border-right: 1px solid var(--border);
  padding: 14px 16px;
  overflow-y: auto;
  background: var(--bg);
}
.editor-left-head {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.variant-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.variant-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: background 0.12s;
  text-align: left;
}
.variant-item:hover { background: var(--surface-2); }
.variant-item.active { background: var(--primary-soft); color: var(--text); font-weight: 600; }
.variant-item.muted { cursor: default; opacity: 0.6; }
.variant-dot {
  width: 14px; height: 14px;
  border-radius: 4px;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
}
.variant-dot.primary { background: var(--primary); border-color: var(--primary); }
.variant-dot.secondary { background: var(--surface-2); border-color: var(--border-strong); }
.variant-dot.soft { background: var(--primary-soft); border-color: var(--primary); }
.variant-dot.ghost { background: transparent; border-color: var(--border-strong); }
.variant-dot.danger { background: var(--danger); border-color: var(--danger); }
.variant-dot.link { background: transparent; border-color: transparent; }
.variant-dot.faded { background: var(--surface-2); border-color: var(--border); }

/* Center: Canvas */
.editor-center {
  overflow-y: auto;
  background: var(--surface-2);
}
.canvas {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 560px;
}
.canvas-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.canvas-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
.canvas-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.canvas-code {
  border-top: 1px solid var(--border);
  background: var(--bg);
}
.canvas-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
}
.code-out {
  padding: 16px;
  margin: 0;
  font-family: var(--f-mono);
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text);
  overflow-x: auto;
}

/* Right: Prop Editor */
.editor-right {
  border-left: 1px solid var(--border);
  overflow-y: auto;
  background: var(--bg);
}
.prop-editor-head {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border);
}
.prop-editor-head-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.prop-editor-name {
  font-family: var(--f-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
}
.prop-editor-sub {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
.prop-editor-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.prop-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.prop-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Segmented control */
.segmented {
  display: inline-flex;
  gap: 3px;
  background: var(--surface-2);
  padding: 3px;
  border-radius: 6px;
}
.segmented-btn {
  padding: 4px 12px;
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
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-card);
}

/* Allowed values */
.allowed-values-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.allowed-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--surface-2);
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--f-mono);
}
.allowed-value-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 2px;
  display: flex;
}

/* Switch */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.switch-label {
  font-size: 13px;
  color: var(--text);
  font-family: var(--f-mono);
}
.toggle-switch {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-micro);
}
.toggle-switch.on { background: var(--primary); }
.toggle-knob {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: white;
  transition: transform var(--duration-micro);
}
.toggle-switch.on .toggle-knob { transform: translateX(14px); }

/* ── Tablet ── */
@media (max-width: 834px) {
  .editor-layout { grid-template-columns: 180px 1fr 280px; }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .editor-layout { grid-template-columns: 1fr; }
  .editor-left { display: none; }
  .editor-right { display: none; }
  .editor-tab { font-size: 12px; padding: 10px; }
}
</style>
