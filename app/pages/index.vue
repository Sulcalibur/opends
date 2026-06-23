<script setup lang="ts">
const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})

const { data: componentsData } = await useFetch('/api/components').catch(() => ({ data: ref(null) }))
const components = computed(() => componentsData.value?.components || componentsData.value?.data || [])

const { data: tokensData } = await useFetch('/api/tokens').catch(() => ({ data: ref(null) }))
const tokens = computed(() => tokensData.value?.tokens || tokensData.value?.data || [])

const { data: docsData } = await useFetch('/api/docs', { query: { isPublished: 1 } }).catch(() => ({ data: ref(null) }))
const pages = computed(() => docsData.value?.pages || [])

const { data: usersData } = await useFetch('/api/users').catch(() => ({ data: ref(null) }))
const users = computed(() => usersData.value?.users || usersData.value?.data || [])

const orgName = computed(() => settings.value.organization_name || 'Design System')
const heroTitle = computed(() => {
  const custom = settings.value.home_hero?.title
  return custom || `The ${orgName.value}`
})

const heroSubtitle = computed(() =>
  settings.value.home_hero?.subtitle ||
  `${components.value.length || 48} components, ${tokens.value.length || 218} tokens, one source of truth. Everything we ship — documented in one place.`
)

const componentCount = computed(() => components.value.length || 48)
const tokenCount = computed(() => tokens.value.length || 218)
const docCount = computed(() => pages.value.length || 32)
const contributorCount = computed(() => users.value.length || 9)

const stats = computed(() => [
  { n: componentCount.value, l: 'Components' },
  { n: tokenCount.value, l: 'Tokens' },
  { n: docCount.value, l: 'Guidelines' },
  { n: contributorCount.value, l: 'Contributors' },
])

const exploreCards = [
  { icon: 'i-lucide-sparkles', title: 'Foundations', count: `${docCount.value} pages`, body: 'Color, type, spacing, motion — the rules that hold everything together.', to: '/docs' },
  { icon: 'i-lucide-component', title: 'Components', count: `${componentCount.value} components`, body: 'Buttons, inputs, modals, tables. Each with live preview, props, and code.', to: '/docs/components' },
  { icon: 'i-lucide-palette', title: 'Tokens', count: `${tokenCount.value} tokens`, body: 'The exact values powering every component. Export to CSS, JSON, or SCSS.', to: '/tokens' },
  { icon: 'i-lucide-file-text', title: 'Guidelines', count: `${docCount.value} articles`, body: 'Writing, accessibility, empty states, and contribution flow.', to: '/docs' },
]

const recentUpdates = [
  { icon: 'i-lucide-component', title: 'Button', meta: 'v1.4.0', badge: 'updated', badgeColor: 'info' as const, desc: 'Added soft variant and refined focus ring behaviour across all sizes.' },
  { icon: 'i-lucide-palette', title: 'color.primary', meta: 'token', badge: 'added', badgeColor: 'success' as const, desc: 'New gold accent shade-200 across light and dark themes.' },
  { icon: 'i-lucide-component', title: 'Toast', meta: 'v0.9.0-rc.1', badge: 'draft', badgeColor: 'warning' as const, desc: 'Drafting position prop — replacing legacy top/bottom variants.' },
]

useHead({
  title: computed(() => `${orgName.value} Design System`),
  meta: [{ name: 'description', content: heroSubtitle.value }],
})
</script>

<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <!-- Left column -->
        <div class="hero-left">
          <UBadge color="primary" variant="soft" size="sm" class="hero-badge">
            <UIcon name="i-lucide-sparkles" class="size-3" />
            v2.4 released &middot; 3 days ago
          </UBadge>

          <h1 class="hero-title">
            {{ heroTitle }}<br />
            <span class="hero-accent">
              Design System
              <svg class="hero-underline" width="380" height="14" viewBox="0 0 380 14" aria-hidden="true">
                <path d="M2 8 Q 100 2, 200 6 T 378 5" stroke="var(--secondary)" stroke-width="4" fill="none" stroke-linecap="round" />
              </svg>
            </span>
          </h1>

          <p class="hero-subtitle">{{ heroSubtitle }}</p>

          <div class="hero-actions">
            <UButton to="/docs/components" size="xl" color="primary" trailing-icon="i-lucide-arrow-right">
              Browse components
            </UButton>
            <UButton to="/docs" size="xl" color="neutral" variant="outline">
              <template #leading>
                <UIcon name="i-lucide-book-open" class="size-4" />
              </template>
              Read the principles
            </UButton>
          </div>

          <div class="hero-stats">
            <div v-for="stat in stats" :key="stat.l" class="hero-stat">
              <div class="hero-stat-n">{{ stat.n }}</div>
              <div class="hero-stat-l">{{ stat.l }}</div>
            </div>
          </div>
        </div>

        <!-- Right: decorative card grid -->
        <div class="hero-right">
          <div class="hero-cards">
            <div class="mini-card">
              <div class="mini-label">COLOR</div>
              <div class="mini-swatches">
                <span v-for="c in ['#FF6B4A','#FFD166','#1F8A5B','#2A6FDB','#1A1D21']" :key="c" class="mini-swatch" :style="{ background: c }" />
              </div>
              <div class="mini-caption">5 ramps · 50 shades</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">BUTTON</div>
              <UBadge color="primary" variant="solid" size="xs">Continue</UBadge>
              <div class="mini-caption">4 variants</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">BADGE</div>
              <div class="flex flex-wrap gap-1">
                <UBadge color="success" variant="soft" size="xs">live</UBadge>
                <UBadge color="primary" variant="soft" size="xs">v2</UBadge>
                <UBadge color="warning" variant="soft" size="xs">beta</UBadge>
              </div>
              <div class="mini-caption">6 tones</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">TYPE</div>
              <div class="mini-type-sample">Aa</div>
              <div class="mini-caption">Outfit + Inter</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">INPUT</div>
              <div class="mini-input-mock">name@team.com</div>
              <div class="mini-caption">3 sizes</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">RADIUS</div>
              <div class="mini-radius-row">
                <span v-for="r in [4,6,8,12]" :key="r" class="mini-radius" :style="{ borderRadius: r + 'px' }" />
              </div>
              <div class="mini-caption">4 steps</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">AVATAR</div>
              <div class="mini-avatar-row">
                <span v-for="(n,i) in ['M','J','S','E']" :key="n" class="mini-avatar" :style="{ marginLeft: i ? '-6px' : '0' }">{{ n }}</span>
              </div>
              <div class="mini-caption">group · stacked</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">SWITCH</div>
              <div class="mini-toggle"><span class="mini-toggle-knob" /></div>
              <div class="mini-caption">on / off</div>
            </div>
            <div class="mini-card">
              <div class="mini-label">SPACING</div>
              <div class="mini-space-row">
                <span v-for="s in [4,8,12,16,24,32]" :key="s" class="mini-space-bar" :style="{ height: s / 1.2 + 'px' }" />
              </div>
              <div class="mini-caption">6 scale</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPLORE -->
    <section class="explore">
      <h2 class="section-heading">Explore the system</h2>
      <div class="explore-grid">
        <NuxtLink
          v-for="card in exploreCards"
          :key="card.title"
          :to="card.to"
          class="explore-card"
        >
          <div class="explore-card-icon">
            <UIcon :name="card.icon" class="size-5" />
          </div>
          <div class="explore-card-content">
            <div class="explore-card-header">
              <span class="explore-card-title">{{ card.title }}</span>
              <span class="explore-card-count">{{ card.count }}</span>
            </div>
            <p class="explore-card-body">{{ card.body }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- RECENT UPDATES -->
    <section class="recent">
      <div class="recent-header">
        <h2 class="section-heading">Recent updates</h2>
        <NuxtLink to="/docs/changelog" class="recent-view-all">
          View all <UIcon name="i-lucide-arrow-right" class="size-3.5" />
        </NuxtLink>
      </div>
      <div class="recent-grid">
        <div v-for="item in recentUpdates" :key="item.title" class="recent-card">
          <div class="recent-card-icon">
            <UIcon :name="item.icon" class="size-4" />
          </div>
          <div class="recent-card-content">
            <div class="recent-card-header">
              <span class="recent-card-title">{{ item.title }}</span>
              <span class="recent-card-meta">{{ item.meta }}</span>
              <UBadge :color="item.badgeColor" variant="soft" size="xs">{{ item.badge }}</UBadge>
            </div>
            <p class="recent-card-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ────────────────────────────────────────────────── */
.hero {
  padding: 80px 80px 56px;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(900px 380px at 90% -80%, rgba(255,209,102,.18), transparent 60%),
    radial-gradient(800px 380px at -10% 110%, rgba(255,107,74,.10), transparent 60%),
    var(--bg);
}

.hero-inner {
  display: flex;
  gap: 80px;
  align-items: flex-start;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-left {
  flex: 0 0 660px;
}

.hero-badge {
  margin-bottom: 24px;
}

.hero-title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: clamp(40px, 5vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--text);
  margin-bottom: 24px;
}

.hero-accent {
  color: var(--primary);
  position: relative;
  display: inline-block;
}

.hero-underline {
  position: absolute;
  left: 0;
  bottom: -8px;
}

.hero-subtitle {
  font-size: 19px;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 560px;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.hero-stats {
  margin-top: 56px;
  display: flex;
  gap: 40px;
}

.hero-stat-n {
  font-family: var(--f-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1;
}

.hero-stat-l {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

/* ── Hero decorative card grid ──────────────────────────── */
.hero-right {
  flex: 1;
  position: relative;
  height: 420px;
}

.hero-cards {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  transform: perspective(1400px) rotateX(8deg) rotateY(-10deg) rotateZ(2deg);
  transform-origin: center;
}

.mini-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  height: 130px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mini-label {
  font-family: var(--f-mono);
  font-size: 9.5px;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mini-caption {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
}

.mini-swatches {
  display: flex;
  gap: 4px;
}

.mini-swatch {
  flex: 1;
  height: 24px;
  border-radius: 4px;
}

.mini-type-sample {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 26px;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--text);
}

.mini-input-mock {
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.mini-radius-row {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.mini-radius {
  width: 22px;
  height: 22px;
  background: var(--primary-soft);
  border: 1px solid var(--primary);
}

.mini-avatar-row {
  display: flex;
}

.mini-avatar {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: var(--primary);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  border: 2px solid var(--surface);
}

.mini-toggle {
  width: 36px;
  height: 20px;
  background: var(--primary);
  border-radius: 999px;
  position: relative;
}

.mini-toggle-knob {
  position: absolute;
  right: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: white;
}

.mini-space-row {
  display: flex;
  gap: 3px;
  align-items: flex-end;
}

.mini-space-bar {
  width: 6px;
  background: var(--text-secondary);
  border-radius: 1px;
}

/* ── Explore ─────────────────────────────────────────────── */
.explore {
  padding: 80px;
  max-width: 1280px;
  margin: 0 auto;
}

.section-heading {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 32px;
}

.explore-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.explore-card {
  display: flex;
  gap: 18px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transition: border-color var(--duration-micro), box-shadow var(--duration-micro);
}
.explore-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-elevated);
}

.explore-card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--r-btn);
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.explore-card-content {
  flex: 1;
  min-width: 0;
}

.explore-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.explore-card-title {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}

.explore-card-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.explore-card-body {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
}

/* ── Recent ──────────────────────────────────────────────── */
.recent {
  padding: 0 80px 80px;
  max-width: 1280px;
  margin: 0 auto;
}

.recent-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
}

.recent-view-all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
}

.recent-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  box-shadow: var(--shadow-card);
}

.recent-card-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--r-btn);
  background: var(--surface-2);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.recent-card-content {
  flex: 1;
  min-width: 0;
}

.recent-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.recent-card-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.recent-card-meta {
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.recent-card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .hero { padding: 48px 40px 40px; }
  .hero-inner { gap: 40px; }
  .hero-left { flex: 0 0 100%; }
  .hero-right { display: none; }
  .hero-title { font-size: clamp(32px, 5vw, 48px); }
  .hero-subtitle { font-size: 17px; }
  .hero-stats { margin-top: 36px; gap: 32px; }
  .explore { padding: 48px 40px; }
  .explore-grid { grid-template-columns: 1fr; gap: 14px; }
  .recent { padding: 0 40px 48px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 32px 20px 32px; }
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: 15px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .hero-actions > * { width: 100%; }
  .hero-stats { gap: 20px; flex-wrap: wrap; }
  .hero-stat-n { font-size: 24px; }
  .section-heading { font-size: 22px; }
  .explore { padding: 32px 20px; }
  .recent { padding: 0 20px 32px; }
  .recent-card { padding: 14px 16px; }
}
</style>
