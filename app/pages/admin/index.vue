<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()

// Stats
const stats = ref([
  { label: 'Components', value: 48, delta: '+3', deltaTone: 'success', sub: 'this week', icon: 'i-lucide-component' },
  { label: 'Tokens', value: 218, delta: '+12', deltaTone: 'success', sub: 'this week', icon: 'i-lucide-palette' },
  { label: 'Published pages', value: 32, delta: '2 drafts', deltaTone: 'warning', sub: 'pending review', icon: 'i-lucide-file-text' },
  { label: 'Active contributors', value: 9, delta: '3 online', deltaTone: 'info', sub: 'now', icon: 'i-lucide-users' },
])

const activityFilter = ref('All')

interface Activity {
  who: string
  what: string
  target: string
  kind: 'component' | 'token' | 'docs' | 'user'
  time: string
  detail: string
  status: string
}

const activities: Activity[] = [
  { who: 'Jay Patel', what: 'updated', target: 'Button', kind: 'component', time: '12m ago', detail: 'Added variant="soft", refined focus ring', status: 'approved' },
  { who: 'Sun Park', what: 'created', target: 'color.gold.200', kind: 'token', time: '44m ago', detail: 'New shade for warning tints', status: 'draft' },
  { who: 'Eli Wright', what: 'published', target: 'Writing for buttons', kind: 'docs', time: '2h ago', detail: '6 min read · 4 do/don\'t examples', status: 'approved' },
  { who: 'Mira Quinn', what: 'deprecated', target: 'OldDropdown', kind: 'component', time: 'Yesterday', detail: 'Migration guide attached → use Select instead', status: 'deprecated' },
  { who: 'Jay Patel', what: 'invited', target: 'taylor@acme.co', kind: 'user', time: 'Yesterday', detail: 'Role: Editor', status: '' },
]

const kindIcons: Record<string, string> = {
  component: 'i-lucide-component',
  token: 'i-lucide-palette',
  docs: 'i-lucide-file-text',
  user: 'i-lucide-user',
}

const statusTone: Record<string, 'success' | 'warning' | 'neutral'> = {
  approved: 'success',
  draft: 'warning',
  deprecated: 'neutral',
}

const barItems = [
  ['Button', 1342, 1, 'approved'],
  ['Input', 982, 0.73, 'approved'],
  ['Card', 712, 0.53, 'approved'],
  ['Badge', 504, 0.38, 'approved'],
  ['Modal', 401, 0.30, 'approved'],
  ['Avatar', 318, 0.24, 'approved'],
  ['Toast', 188, 0.14, 'draft'],
]

const reviewItems = [
  { name: 'Toast', v: '0.9.0-rc.1', who: 'Jay Patel', days: 2, kind: 'component' as const },
  { name: 'Drawer', v: '1.1.0', who: 'Eli Wright', days: 1, kind: 'component' as const },
  { name: 'color.danger.100', v: '—', who: 'Sun Park', days: 0, kind: 'token' as const },
]

const quickActions = [
  { icon: 'i-lucide-component', title: 'New component', to: '/admin/components/new' },
  { icon: 'i-lucide-palette', title: 'New token', to: '/admin/tokens/new' },
  { icon: 'i-lucide-file-text', title: 'New doc page', to: '/admin/docs/new' },
  { icon: 'i-lucide-upload', title: 'Import tokens', to: '/admin/tokens/import' },
  { icon: 'i-lucide-mail', title: 'Invite teammate', to: '/admin/users/invite' },
  { icon: 'i-lucide-download', title: 'Backup export', to: '/admin/settings/export' },
]

onMounted(async () => {
  // Fetch live stats from API
  try {
    const [compRes, tokenRes, docRes, userRes] = await Promise.all([
      $fetch('/api/components').catch(() => null),
      $fetch('/api/tokens').catch(() => null),
      $fetch('/api/docs', { query: { isPublished: 1 } }).catch(() => null),
      $fetch('/api/users').catch(() => null),
    ])

    if (compRes) stats.value[0].value = (compRes as any).components?.length || (compRes as any).data?.length || 48
    if (tokenRes) stats.value[1].value = (tokenRes as any).tokens?.length || (tokenRes as any).data?.length || 218
    if (docRes) stats.value[2].value = (docRes as any).pages?.length || 32
    if (userRes) stats.value[3].value = (userRes as any).users?.length || (userRes as any).data?.length || 9
  } catch { /* use defaults */ }
})

useHead({ title: 'Dashboard — Admin' })
</script>

<template>
  <div class="dashboard">
    <!-- Stat cards -->
    <div class="stat-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-icon"><UIcon :name="stat.icon" class="size-4" /></span>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-bottom">
          <UBadge :color="stat.deltaTone" variant="soft" size="xs">{{ stat.delta }}</UBadge>
          <span class="stat-sub">{{ stat.sub }}</span>
        </div>
      </div>
    </div>

    <!-- Two-column -->
    <div class="dashboard-grid-2">
      <!-- Recent activity -->
      <div class="card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="card-title">Recent activity</div>
            <div class="card-sub">Last 7 days · 26 changes</div>
          </div>
          <div class="segmented">
            <button
              v-for="opt in ['All','Components','Tokens','Docs']"
              :key="opt"
              class="segmented-btn"
              :class="{ active: activityFilter === opt }"
              @click="activityFilter = opt"
            >{{ opt }}</button>
          </div>
        </div>

        <div v-for="a in activities" :key="a.target + a.who" class="activity-row">
          <div class="activity-avatar">{{ a.who.charAt(0) }}</div>
          <div class="activity-body">
            <div class="activity-line">
              <span class="activity-who">{{ a.who }}</span>
              <span class="activity-what"> {{ a.what }} </span>
              <span class="activity-target" :class="{ mono: a.kind === 'token' }">
                <UIcon :name="kindIcons[a.kind]" class="size-3.5" />
                {{ a.target }}
              </span>
            </div>
            <div class="activity-detail">{{ a.detail }}</div>
          </div>
          <UBadge v-if="a.status" :color="statusTone[a.status]" variant="soft" size="xs">
            {{ a.status }}
          </UBadge>
          <span class="activity-time">{{ a.time }}</span>
        </div>

        <div class="card-footer">
          <span>Showing 5 of 26</span>
          <NuxtLink to="/admin/activity" class="card-footer-link">View activity log →</NuxtLink>
        </div>
      </div>

      <!-- Component adoption -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Component adoption</div>
            <div class="card-sub">Pageviews · last 30 days</div>
          </div>
        </div>
        <div class="card-body">
          <div v-for="[name, count, ratio, status] in barItems" :key="name" class="bar-row">
            <div class="bar-label">
              <span class="bar-name">{{ name }}</span>
              <UBadge v-if="status === 'draft'" color="warning" variant="soft" size="xs">draft</UBadge>
              <span class="bar-count">{{ (count as number).toLocaleString() }}</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :class="{ draft: status === 'draft' }"
                :style="{ width: `${(ratio as number) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="dashboard-grid-2">
      <!-- Needs review -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Needs review</div>
          </div>
          <UBadge color="warning" variant="soft" size="xs">3</UBadge>
        </div>
        <div v-for="item in reviewItems" :key="item.name" class="review-row">
          <span class="review-icon">
            <UIcon :name="item.kind === 'token' ? 'i-lucide-palette' : 'i-lucide-component'" class="size-[18px]" />
          </span>
          <div class="review-info">
            <div class="review-name" :class="{ mono: item.kind === 'token' }">{{ item.name }}</div>
            <div class="review-meta">{{ item.v }} · by {{ item.who }} · {{ item.days === 0 ? 'today' : `${item.days}d ago` }}</div>
          </div>
          <div class="review-actions">
            <UButton variant="ghost" size="sm">Skip</UButton>
            <UButton size="sm">Review</UButton>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="card quick-actions-card">
        <div class="card-header">
          <div class="card-title">Quick actions</div>
        </div>
        <div class="quick-actions-grid">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
            class="quick-action"
          >
            <span class="quick-action-icon">
              <UIcon :name="action.icon" class="size-[18px]" />
            </span>
            <span class="quick-action-title">{{ action.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
}

/* Stat cards */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 32px;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--text);
  margin-bottom: 8px;
}

.stat-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.stat-sub {
  color: var(--text-tertiary);
}

/* Grid */
.dashboard-grid-2 {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
}
.dashboard-grid-2:last-child {
  grid-template-columns: 1fr 1fr;
}

/* Card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header-left {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
}

.card-sub {
  font-size: 12.5px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-footer-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

/* Segmented */
.segmented {
  display: flex;
  background: var(--surface-2);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

.segmented-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--duration-micro);
}
.segmented-btn.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-card);
}

/* Activity */
.activity-row {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.activity-row:last-child { border-bottom: none; }

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.activity-body {
  flex: 1;
  min-width: 0;
}

.activity-line {
  font-size: 13.5px;
  line-height: 1.4;
}

.activity-who { font-weight: 600; color: var(--text); }
.activity-what { color: var(--text-secondary); }

.activity-target {
  font-weight: 600;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: baseline;
}
.activity-target.mono { font-family: var(--f-mono); }

.activity-detail {
  font-size: 12.5px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.activity-time {
  font-size: 12px;
  color: var(--text-tertiary);
  min-width: 70px;
  text-align: right;
}

/* Bar chart */
.bar-row {
  margin-bottom: 10px;
}
.bar-row:last-child { margin-bottom: 0; }

.bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 13px;
  gap: 6px;
}

.bar-name { font-weight: 600; color: var(--text); }

.bar-count {
  font-family: var(--f-mono);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  margin-left: auto;
}

.bar-track {
  height: 6px;
  background: var(--surface-2);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
}
.bar-fill.draft { background: var(--warning); }

/* Review */
.review-row {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.review-row:last-child { border-bottom: none; }

.review-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.review-info {
  flex: 1;
}

.review-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
}
.review-name.mono { font-family: var(--f-mono); }

.review-meta {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.review-actions {
  display: flex;
  gap: 6px;
}

/* Quick actions */
.quick-actions-card .card-header {
  border-bottom: none;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--border);
}

.quick-action {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transition: background var(--duration-micro);
}
.quick-action:nth-child(2n) { border-right: none; }
.quick-action:nth-child(n+5) { border-bottom: none; }
.quick-action:hover { background: var(--surface-2); }

.quick-action-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-soft);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.quick-action-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid-2 { grid-template-columns: 1fr; }
  .dashboard-grid-2:last-child { grid-template-columns: 1fr; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr; }
  .stat-value { font-size: 28px; }
  .activity-time { display: none; }
  .quick-actions-grid { grid-template-columns: 1fr; }
  .quick-action { border-right: none; }
}
</style>
