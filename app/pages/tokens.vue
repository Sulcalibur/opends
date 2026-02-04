<template>
  <div class="tokens-page">
    <div class="container mx-auto max-w-7xl px-6 py-12">
      <div class="page-header fade-up">
        <h1 class="page-title">Design Tokens</h1>
        <p class="page-subtitle">
          Design tokens are the visual design atoms of the design system. They
          store design decisions like colors, typography, and spacing.
        </p>
      </div>

      <EmptyState
        v-if="tokens.length === 0"
        icon="pi-palette"
        title="No Tokens Yet"
        description="Get started by creating your first design token in the admin panel."
        action-link="/admin/tokens"
        action-text="Create Your First Token"
        class="fade-up stagger-1"
      />

      <div v-else class="tokens-content">
        <AnimatedCard variant="elevated" class="stats-card fade-up stagger-1">
          <template #header>
            <div class="card-header-title">
              <i class="pi pi-chart-bar"/>
              Token Overview
            </div>
          </template>
          <template #default>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ tokens.length }}</div>
                <div class="stat-label">Total Tokens</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ colorTokens.length }}</div>
                <div class="stat-label">Colors</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ typographyTokens.length }}</div>
                <div class="stat-label">Typography</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ spacingTokens.length }}</div>
                <div class="stat-label">Spacing</div>
              </div>
            </div>
            <Button
              icon="pi pi-download"
              label="Export JSON"
              class="p-button-outlined"
              @click="downloadTokens"
            />
          </template>
        </AnimatedCard>

        <TabView class="tabs-container fade-up stagger-2">
          <TabPanel header="Colors">
            <div v-if="colorTokens.length === 0" class="empty-tab">
              <i class="pi pi-palette"/>
              <p>No color tokens defined yet.</p>
            </div>
            <div v-else class="colors-grid">
              <div
                v-for="(token, index) in colorTokens"
                :key="token.name"
                class="color-card hover-lift"
                :class="`stagger-${(index % 3) + 1}`"
              >
                <div
                  class="color-swatch"
                  :style="{ backgroundColor: token.value }"
                />
                <div class="color-info">
                  <div class="color-name" :title="token.name">
                    {{ token.name }}
                  </div>
                  <div class="color-value">{{ token.value }}</div>
                </div>
                <button
                  class="copy-btn"
                  title="Copy value"
                  @click="copyToClipboard(token.value)"
                >
                  <i class="pi pi-copy"/>
                </button>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Typography">
            <div v-if="typographyTokens.length === 0" class="empty-tab">
              <i class="pi pi-font"/>
              <p>No typography tokens defined yet.</p>
            </div>
            <div v-else class="typography-list">
              <div
                v-for="(token, index) in typographyTokens"
                :key="token.name"
                class="typography-card hover-lift"
                :class="`stagger-${(index % 3) + 1}`"
              >
                <div class="typo-details">
                  <div class="typo-name">{{ token.name }}</div>
                  <div class="typo-meta">
                    <span class="typo-tag"
                      >Family: {{ token.value.fontFamily }}</span
                    >
                    <span class="typo-tag"
                      >Size: {{ token.value.fontSize }}</span
                    >
                    <span class="typo-tag"
                      >Weight: {{ token.value.fontWeight }}</span
                    >
                    <span class="typo-tag"
                      >Line: {{ token.value.lineHeight }}</span
                    >
                  </div>
                </div>
                <div
                  class="typo-preview"
                  :style="getTypographyStyle(token.value)"
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Spacing">
            <div v-if="spacingTokens.length === 0" class="empty-tab">
              <i class="pi pi-arrows-alt"/>
              <p>No spacing tokens defined yet.</p>
            </div>
            <div v-else class="spacing-list">
              <div
                v-for="(token, index) in spacingTokens"
                :key="token.name"
                class="spacing-item hover-lift"
                :class="`stagger-${(index % 3) + 1}`"
              >
                <div class="spacing-label">
                  <span class="spacing-name">{{ token.name }}</span>
                  <span class="spacing-value">{{ token.value }}</span>
                </div>
                <div class="spacing-bar">
                  <div
                    class="spacing-fill"
                    :style="{
                      width: token.value,
                      background: 'var(--gradient-primary)',
                    }"
                  />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import designSystemStorage from "../../src/design-system/storage";

const tokens = designSystemStorage.getTokens();

const colorTokens = computed(() => tokens.filter((t) => t.type === "color"));
const typographyTokens = computed(() =>
  tokens.filter((t) => t.type === "typography"),
);
const spacingTokens = computed(() =>
  tokens.filter((t) => t.type === "spacing"),
);

function getTypographyStyle(value: any) {
  return {
    fontFamily: value.fontFamily,
    fontSize: value.fontSize,
    fontWeight: value.fontWeight,
    lineHeight: value.lineHeight,
  };
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

function downloadTokens() {
  const exportData: any = {
    $themes: [],
    $metadata: {
      tokenSetOrder: ["OpenDS Tokens"],
      activeThemes: [],
      activeSets: ["OpenDS Tokens"],
    },
  };

  const tokenSets: any = {
    "OpenDS Tokens": {},
  };

  tokens.forEach((token) => {
    let cleanName = token.name
      .replace(/\//g, ".")
      .replace(/\s+/g, ".")
      .replace(/[^a-zA-Z0-9.]/g, "")
      .replace(/\.+/g, ".")
      .replace(/^\.+|\.+$/g, "");

    if (cleanName.startsWith("$")) {
      cleanName = cleanName.substring(1);
    }

    if (!cleanName) {
      cleanName = `token_${Math.random().toString(36).substr(2, 9)}`;
    }

    tokenSets["OpenDS Tokens"][cleanName] = {
      $value: token.value,
      $type: token.type,
      $description: token.description || "",
    };
  });

  const finalExport = {
    ...tokenSets,
    ...exportData,
  };

  const dataStr = JSON.stringify(finalExport, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = `opends-tokens-${new Date().toISOString().split("T")[0]}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

useHead({
  title: "Design Tokens",
  meta: [
    {
      name: "description",
      content: "Browse design tokens for OpenDS Design System",
    },
  ],
});
</script>

<style scoped>
.tokens-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3.5rem;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.tokens-content {
  max-width: 1000px;
  margin: 0 auto;
}

.stats-card {
  margin-bottom: 2rem;
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 3rem;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tabs-container {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.empty-tab {
  padding: 4rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-tab i {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-tab p {
  font-size: 1.125rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.color-card {
  position: relative;
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-slow);
}

.color-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.color-swatch {
  width: 100%;
  height: 120px;
  background: var(--color-bg-200);
  transition: all var(--transition-slow);
}

.color-card:hover .color-swatch {
  height: 140px;
}

.color-info {
  padding: 1.25rem;
}

.color-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-value {
  font-size: var(--font-size-xs);
  font-family: monospace;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(-4px);
  transition: all var(--transition-base);
}

.color-card:hover .copy-btn {
  opacity: 1;
  transform: translateY(0);
}

.copy-btn:hover {
  background: white;
  color: var(--color-primary-500);
}

.typography-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.typography-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2rem;
  transition: all var(--transition-slow);
}

.typography-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.typo-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.typo-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.typo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.typo-tag {
  font-size: var(--font-size-xs);
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-200);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: monospace;
}

.typo-preview {
  padding: 1.5rem;
  background: var(--color-bg-200);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: inherit;
  line-height: inherit;
}

.spacing-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  max-width: 600px;
  margin: 0 auto;
}

.spacing-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all var(--transition-slow);
}

.spacing-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-lg);
  transform: translateX(8px);
}

.spacing-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spacing-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-family: monospace;
}

.spacing-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-family: monospace;
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-200);
  border-radius: var(--radius-md);
}

.spacing-bar {
  height: 32px;
  background: var(--color-bg-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.spacing-fill {
  height: 100%;
  border-radius: var(--radius-lg);
  transition: width var(--transition-slow);
}

.dark .tokens-page {
  background: var(--dark-color-bg);
}

.dark .page-title,
.dark .typo-name,
.dark .spacing-name,
.dark .color-name,
.dark .card-header-title {
  color: var(--dark-color-text-primary);
}

.dark .page-subtitle,
.dark .stat-label,
.dark .color-value,
.dark .typo-tag,
.dark .spacing-value,
.dark .empty-tab {
  color: var(--dark-color-text-secondary);
}

.dark .color-card,
.dark .typography-card,
.dark .spacing-item {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
}

.dark .color-card:hover,
.dark .typography-card:hover,
.dark .spacing-item:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-lg), var(--dark-shadow-glow-sm);
}

.dark .typo-preview,
.dark .spacing-bar {
  background: var(--dark-color-bg-200);
}

.dark .typo-tag,
.dark .spacing-value {
  background: var(--dark-color-bg-100);
}

.dark .tabs-container {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
}

.dark .copy-btn {
  background: var(--dark-color-bg-100);
  color: var(--dark-color-text-primary);
}

.dark .copy-btn:hover {
  background: var(--dark-color-bg-200);
  color: var(--color-primary-400);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .colors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
