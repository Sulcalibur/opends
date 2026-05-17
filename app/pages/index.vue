<script setup lang="ts">
const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})

const { data: docsData } = await useFetch('/api/docs', { query: { isPublished: 1 } }).catch(() => ({ data: ref(null) }))
const pages = computed(() => docsData.value?.pages || [])

const { data: componentsData } = await useFetch('/api/components').catch(() => ({ data: ref(null) }))
const components = computed(() => componentsData.value?.components || componentsData.value?.data || [])

const { data: tokensData } = await useFetch('/api/tokens').catch(() => ({ data: ref(null) }))
const tokens = computed(() => tokensData.value?.tokens || tokensData.value?.data || [])

const { data: usersData } = await useFetch('/api/users').catch(() => ({ data: ref(null) }))
const users = computed(() => usersData.value?.users || usersData.value?.data || [])

const orgName = computed(() => settings.value.organization_name || 'OpenDS')
const heroTitle = computed(() => settings.value.home_hero?.title || `The ${orgName.value}`)
const heroSubtitle = computed(() => settings.value.home_hero?.subtitle || 'Components, tokens, and guidelines — documented in one place so every team ships consistently.')

const componentCount = computed(() => components.value.length || 48)
const tokenCount = computed(() => tokens.value.length || 218)
const docCount = computed(() => pages.value.length || 32)
const contributorCount = computed(() => users.value.length || 9)

const stats = computed(() => [
  { n: componentCount.value, l: 'Components' },
  { n: tokenCount.value, l: 'Tokens' },
  { n: docCount.value, l: 'Docs' },
  { n: contributorCount.value, l: 'Contributors' },
])

const exploreCards = computed(() => [
  {
    icon: 'i-lucide-sparkles',
    title: 'Foundations',
    count: `${docCount.value} PAGES`,
    body: 'Color, type, spacing, motion — the rules that hold everything together.',
    to: '/docs',
  },
  {
    icon: 'i-lucide-component',
    title: 'Components',
    count: `${componentCount.value} COMPONENTS`,
    body: 'Buttons, inputs, modals, tables. Each with live preview, props, and code.',
    to: '/docs/components',
  },
  {
    icon: 'i-lucide-palette',
    title: 'Tokens',
    count: `${tokenCount.value} TOKENS`,
    body: 'The exact values powering every component. Export to CSS, JSON, or SCSS.',
    to: '/tokens',
  },
  {
    icon: 'i-lucide-file-text',
    title: 'Guidelines',
    count: `${docCount.value} ARTICLES`,
    body: 'Writing, accessibility, empty states, and contribution flow.',
    to: '/docs',
  },
])

const recentPages = computed(() =>
  [...pages.value]
    .sort((a: any, b: any) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
    .slice(0, 3)
)

const placeholderCards = [
  {
    icon: 'i-lucide-component',
    title: 'Button',
    meta: 'v1.4.0',
    badge: 'updated',
    badgeColor: 'info' as const,
    desc: 'Added soft variant and refined focus ring behaviour across all sizes.',
  },
  {
    icon: 'i-lucide-palette',
    title: 'color.primary',
    meta: 'token',
    badge: 'added',
    badgeColor: 'success' as const,
    desc: 'New gold accent shade-200 across light and dark themes.',
  },
  {
    icon: 'i-lucide-component',
    title: 'Toast',
    meta: 'v0.9.0-rc.1',
    badge: 'draft',
    badgeColor: 'warning' as const,
    desc: 'Drafting position prop — replacing legacy top/bottom variants.',
  },
]

const miniCards = [
  { kind: 'color' },
  { kind: 'button' },
  { kind: 'badge' },
  { kind: 'type' },
  { kind: 'input' },
  { kind: 'radius' },
  { kind: 'avatar' },
  { kind: 'toggle' },
  { kind: 'space' },
]

useHead({
  title: computed(() => `${orgName.value} Design System`),
  meta: [{ name: 'description', content: 'Design system documentation and component library.' }],
})
</script>

<template>
  <div class="min-h-screen" style="background: var(--color-bg, #F8F9FA);">

    <!-- HERO -->
    <section
      class="border-b"
      style="
        padding: 80px 80px 56px;
        border-color: var(--color-border, #E2E4E9);
        background:
          radial-gradient(900px 380px at 90% -80%, rgba(255,209,102,.15), transparent 60%),
          radial-gradient(800px 380px at -10% 110%, rgba(255,107,74,.08), transparent 60%),
          var(--color-bg, #F8F9FA);
      "
    >
      <div class="flex gap-20 items-start max-w-[1280px] mx-auto">

        <!-- Left: text -->
        <div style="flex: 0 0 min(620px, 100%);">
          <UBadge color="primary" variant="soft" class="mb-6 gap-1.5">
            <UIcon name="i-lucide-sparkles" class="w-3 h-3" />
            Design system · Live
          </UBadge>

          <h1 style="
            font-family: 'Outfit', var(--font-heading, sans-serif);
            font-weight: 800;
            font-size: clamp(40px, 5vw, 68px);
            line-height: 1.02;
            letter-spacing: -0.035em;
            color: var(--color-text-primary, #1A1D21);
            margin-bottom: 24px;
          ">
            {{ heroTitle }}<br />
            <span style="color: var(--color-primary-500, #FF6B4A); position: relative; display: inline-block;">
              Design System
              <svg width="340" height="14" viewBox="0 0 340 14" style="position: absolute; left: 0; bottom: -8px;" aria-hidden="true">
                <path d="M2 8 Q 90 2, 180 6 T 338 5" stroke="#FFD166" stroke-width="3.5" fill="none" stroke-linecap="round" />
              </svg>
            </span>
          </h1>

          <p style="font-size: 19px; line-height: 1.55; color: var(--color-text-secondary, #5C6270); max-width: 540px; margin-bottom: 36px;">
            {{ heroSubtitle }}
          </p>

          <div class="flex gap-3 items-center flex-wrap">
            <UButton to="/docs/components" size="xl" color="primary" trailing-icon="i-lucide-arrow-right">
              Browse components
            </UButton>
            <UButton to="/docs" size="xl" color="neutral" variant="outline" leading-icon="i-lucide-book-open">
              Read the principles
            </UButton>
          </div>

          <!-- Stats -->
          <div class="flex gap-10 mt-14 flex-wrap">
            <div v-for="stat in stats" :key="stat.l">
              <div style="font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: var(--color-text-primary, #1A1D21); letter-spacing: -0.02em; line-height: 1;">
                {{ stat.n }}
              </div>
              <div style="font-size: 11px; color: var(--color-text-tertiary, #8A91A0); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">
                {{ stat.l }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: decorative card grid (desktop only) -->
        <div class="flex-1 relative hidden xl:block" style="height: 420px;">
          <div style="
            position: absolute; inset: 0;
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
            transform: perspective(1400px) rotateX(8deg) rotateY(-10deg) rotateZ(2deg);
            transform-origin: center;
          ">
            <!-- color -->
            <div class="mini-card">
              <div class="mini-label">COLOR</div>
              <div class="flex gap-1">
                <div v-for="c in ['#FF6B4A','#FFD166','#1F8A5B','#2A6FDB','#1A1D21']" :key="c"
                  :style="`flex:1; height:24px; border-radius:4px; background:${c}`" />
              </div>
              <div class="mini-meta">5 ramps · 50 shades</div>
            </div>
            <!-- button -->
            <div class="mini-card">
              <div class="mini-label">BUTTON</div>
              <UButton size="xs" color="primary">Continue</UButton>
              <div class="mini-meta">4 variants</div>
            </div>
            <!-- badge -->
            <div class="mini-card">
              <div class="mini-label">BADGE</div>
              <div class="flex flex-wrap gap-1">
                <UBadge color="success" variant="soft">live</UBadge>
                <UBadge color="primary" variant="soft">v2</UBadge>
                <UBadge color="warning" variant="soft">beta</UBadge>
              </div>
              <div class="mini-meta">6 tones</div>
            </div>
            <!-- type -->
            <div class="mini-card">
              <div class="mini-label">TYPE</div>
              <div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.02em; line-height: 1; color: var(--color-text-primary, #1A1D21);">Aa</div>
              <div class="mini-meta">Outfit + Inter</div>
            </div>
            <!-- input -->
            <div class="mini-card">
              <div class="mini-label">INPUT</div>
              <div style="height:28px; border-radius:6px; border:1px solid var(--color-border,#E2E4E9); background:var(--color-bg,#F8F9FA); display:flex; align-items:center; padding:0 8px; font-size:11px; color:var(--color-text-tertiary,#8A91A0);">
                name@team.com
              </div>
              <div class="mini-meta">3 sizes</div>
            </div>
            <!-- radius -->
            <div class="mini-card">
              <div class="mini-label">RADIUS</div>
              <div class="flex gap-1 items-end">
                <div v-for="r in [4, 6, 8, 12]" :key="r"
                  :style="`width:22px; height:22px; background:rgba(255,107,74,.15); border:1px solid #FF6B4A; border-radius:${r}px`" />
              </div>
              <div class="mini-meta">4 steps</div>
            </div>
            <!-- avatar -->
            <div class="mini-card">
              <div class="mini-label">AVATAR</div>
              <div class="flex">
                <div v-for="(initial, i) in ['M','J','S','E']" :key="initial"
                  :style="`margin-left:${i ? '-6px' : '0'}; width:26px; height:26px; border-radius:999px; border:2px solid white; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; color:white; background:var(--color-primary-500,#FF6B4A); flex-shrink:0;`">
                  {{ initial }}
                </div>
              </div>
              <div class="mini-meta">group · stacked</div>
            </div>
            <!-- toggle -->
            <div class="mini-card">
              <div class="mini-label">SWITCH</div>
              <div style="width:36px; height:20px; background:var(--color-primary-500,#FF6B4A); border-radius:999px; position:relative;">
                <div style="position:absolute; right:2px; top:2px; width:16px; height:16px; border-radius:999px; background:white;" />
              </div>
              <div class="mini-meta">on / off</div>
            </div>
            <!-- spacing -->
            <div class="mini-card">
              <div class="mini-label">SPACING</div>
              <div class="flex gap-[3px] items-end">
                <div v-for="s in [4, 8, 12, 16, 24, 32]" :key="s"
                  :style="`width:6px; height:${s/1.2}px; background:var(--color-text-secondary,#5C6270); border-radius:1px`" />
              </div>
              <div class="mini-meta">4px base</div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- EXPLORE STRIP -->
    <section class="border-b" style="padding: 56px 80px; border-color: var(--color-border, #E2E4E9);">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex items-end justify-between mb-7">
          <div>
            <h2 style="font-family:'Outfit',sans-serif; font-size:28px; font-weight:700; letter-spacing:-0.02em; color:var(--color-text-primary,#1A1D21); margin-bottom:6px;">
              Explore the system
            </h2>
            <p style="font-size:15px; color:var(--color-text-secondary,#5C6270);">
              Start anywhere. Every page links to the components and tokens that use it.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="card in exploreCards"
            :key="card.title"
            :to="card.to"
            class="explore-card"
          >
            <div style="width:40px; height:40px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; background:rgba(255,107,74,.1); color:var(--color-primary-500,#FF6B4A); margin-bottom:16px;">
              <UIcon :name="card.icon" class="w-5 h-5" />
            </div>
            <div style="font-family:'Outfit',sans-serif; font-weight:700; font-size:19px; color:var(--color-text-primary,#1A1D21); margin-bottom:2px;">
              {{ card.title }}
            </div>
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--color-text-tertiary,#8A91A0); margin-bottom:10px; letter-spacing:0.04em;">
              {{ card.count }}
            </div>
            <div style="font-size:13.5px; color:var(--color-text-secondary,#5C6270); line-height:1.55;">
              {{ card.body }}
            </div>
            <div style="margin-top:16px; font-size:13px; color:var(--color-primary-500,#FF6B4A); font-weight:600; display:inline-flex; align-items:center; gap:4px;">
              Open <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- RECENTLY UPDATED -->
    <section style="padding: 40px 80px 64px;">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex items-end justify-between mb-5">
          <h2 style="font-family:'Outfit',sans-serif; font-size:24px; font-weight:700; color:var(--color-text-primary,#1A1D21);">
            Recently updated
          </h2>
          <NuxtLink to="/docs" class="recent-view-all">
            View all <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <template v-if="recentPages.length">
            <NuxtLink
              v-for="page in recentPages"
              :key="(page as any).slug"
              :to="`/docs/${(page as any).slug}`"
              class="recent-card"
            >
              <div class="flex items-center gap-2.5 mb-3.5">
                <div class="mini-icon-box">
                  <UIcon name="i-lucide-file-text" class="w-[18px] h-[18px]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div style="font-weight:600; font-size:14px; color:var(--color-text-primary,#1A1D21);">{{ (page as any).title }}</div>
                  <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--color-text-tertiary,#8A91A0);">doc</div>
                </div>
                <UBadge color="info" variant="soft" size="sm">updated</UBadge>
              </div>
              <p style="font-size:13.5px; color:var(--color-text-secondary,#5C6270); line-height:1.55;">
                {{ (page as any).excerpt || (page as any).description || 'No description available.' }}
              </p>
            </NuxtLink>
          </template>
          <template v-else>
            <div v-for="card in placeholderCards" :key="card.title" class="recent-card">
              <div class="flex items-center gap-2.5 mb-3.5">
                <div class="mini-icon-box">
                  <UIcon :name="card.icon" class="w-[18px] h-[18px]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div style="font-weight:600; font-size:14px; color:var(--color-text-primary,#1A1D21);">{{ card.title }}</div>
                  <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--color-text-tertiary,#8A91A0);">{{ card.meta }}</div>
                </div>
                <UBadge :color="card.badgeColor" variant="soft" size="sm">{{ card.badge }}</UBadge>
              </div>
              <p style="font-size:13.5px; color:var(--color-text-secondary,#5C6270); line-height:1.55;">
                {{ card.desc }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t" style="border-color:var(--color-border,#E2E4E9); padding:32px 80px;">
      <div class="max-w-[1280px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <Logo :text="orgName" />
          <span style="font-size:13px; color:var(--color-text-tertiary,#8A91A0);">
            &copy; {{ new Date().getFullYear() }} {{ orgName }}
          </span>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink v-for="link in [['Docs','/docs'],['Components','/docs/components'],['Tokens','/tokens'],['Admin','/admin']]" :key="link[0]" :to="link[1]" class="footer-nav-link">
            {{ link[0] }}
          </NuxtLink>
        </div>
        <a href="https://opends.dev" target="_blank" rel="noopener" class="footer-powered">
          Powered by <strong style="color:var(--color-primary-500,#FF6B4A);">OpenDS</strong>
        </a>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* Mini cards in hero grid */
.mini-card {
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #E2E4E9);
  border-radius: 10px;
  padding: 14px;
  height: 130px;
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mini-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  color: var(--color-text-tertiary, #8A91A0);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mini-meta {
  font-size: 11px;
  color: var(--color-text-secondary, #5C6270);
  font-weight: 500;
}

/* Explore cards */
.explore-card {
  display: block;
  border: 1px solid var(--color-border, #E2E4E9);
  border-radius: 8px;
  padding: 24px;
  background: var(--color-surface, #fff);
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
  color: inherit;
  text-decoration: none;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.explore-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,.10), 0 1px 3px rgba(0,0,0,.06);
  text-decoration: none;
}

/* Recently updated cards */
.recent-card {
  border: 1px solid var(--color-border, #E2E4E9);
  border-radius: 8px;
  padding: 20px;
  background: var(--color-surface, #fff);
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
  text-decoration: none;
  display: block;
  color: inherit;
  transition: box-shadow 150ms ease;
}

.recent-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.10);
  text-decoration: none;
}

.recent-view-all {
  font-size: 13px;
  color: var(--color-primary-500, #FF6B4A);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.mini-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--color-surface-2, #F3F4F6);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #5C6270);
  flex-shrink: 0;
}

/* Footer */
.footer-nav-link {
  font-size: 13px;
  color: var(--color-text-secondary, #5C6270);
  text-decoration: none;
  transition: color 150ms;
}

.footer-nav-link:hover {
  color: var(--color-primary-500, #FF6B4A);
  text-decoration: none;
}

.footer-powered {
  font-size: 12px;
  color: var(--color-text-tertiary, #8A91A0);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Responsive */
@media (max-width: 1024px) {
  section,
  footer { padding-left: 32px !important; padding-right: 32px !important; }
}

@media (max-width: 640px) {
  section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 48px !important; padding-bottom: 40px !important; }
  footer { padding-left: 20px !important; padding-right: 20px !important; }
}

@media (prefers-reduced-motion: reduce) {
  .explore-card,
  .recent-card { transition: none; }
}
</style>
