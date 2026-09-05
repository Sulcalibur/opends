<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const users = ref([
  { name: 'Mira Quinn', email: 'mira@lumen.co', role: 'Admin', status: 'active', joined: 'Jan 2026' },
  { name: 'Jay Patel', email: 'jay@lumen.co', role: 'Editor', status: 'active', joined: 'Feb 2026' },
  { name: 'Sun Park', email: 'sun@lumen.co', role: 'Editor', status: 'active', joined: 'Mar 2026' },
  { name: 'Eli Wright', email: 'eli@lumen.co', role: 'Viewer', status: 'active', joined: 'Apr 2026' },
  { name: 'Taylor Kim', email: 'taylor@acme.co', role: 'Editor', status: 'invited', joined: '—' },
])

type BadgeTone = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
const roleColors: Record<string, BadgeTone> = { Admin: 'primary', Editor: 'info', Viewer: 'neutral' }

const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/users')
    const apiUsers = (data.value as any)?.users || (data.value as any)?.data || []
    if (apiUsers.length > 0) {
      users.value = apiUsers.map((u: any) => ({
        name: u.name || u.email?.split('@')[0] || 'User',
        email: u.email,
        role: u.role || 'Viewer',
        status: u.is_active ? 'active' : 'inactive',
        joined: u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—',
      }))
    }
  } catch { /* keep fallback data */ }
  loading.value = false
})

useHead({ title: 'Users & Roles — Admin' })
</script>

<template>
  <div class="users-page">
    <div class="users-header">
      <div>
        <h1 class="users-title">Users & Roles</h1>
        <p class="users-subtitle">{{ users.length }} members in this workspace.</p>
      </div>
      <UButton size="sm" icon="i-lucide-mail">Invite member</UButton>
    </div>

    <div class="users-table">
      <div class="users-table-head">
        <span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Joined</span>
      </div>
      <div v-for="user in users" :key="user.email" class="users-table-row">
        <div class="user-cell-name">
          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
          <span>{{ user.name }}</span>
        </div>
        <span class="user-cell-email">{{ user.email }}</span>
        <span>
          <UBadge :color="roleColors[user.role]" variant="soft" size="xs">{{ user.role }}</UBadge>
        </span>
        <span>
          <span class="user-status-dot" :class="user.status" />
          {{ user.status }}
        </span>
        <span class="user-cell-meta">{{ user.joined }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-page { max-width: 1000px; }

.users-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.users-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.users-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.users-table {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
  background: var(--surface);
}

.users-table-head {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  padding: 12px 20px;
  background: var(--surface-2);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.users-table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  padding: 14px 20px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 13.5px;
}
.users-table-row:last-child { border-bottom: none; }
.users-table-row:hover { background: var(--surface-2); }

.user-cell-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
}

.user-cell-email { color: var(--text-secondary); }
.user-cell-meta { color: var(--text-tertiary); font-size: 12px; }

.user-status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  margin-right: 6px;
  vertical-align: middle;
}
.user-status-dot.active { background: var(--success); }
.user-status-dot.invited { background: var(--warning); }

/* ── Tablet ── */
@media (max-width: 834px) {
  .users-table-head, .users-table-row {
    grid-template-columns: 2fr 2fr 1fr 1fr;
  }
  .users-table-head span:last-child,
  .users-table-row .user-cell-meta { display: none; }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .users-table-head, .users-table-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  .users-table-head span:nth-child(4),
  .users-table-row span:nth-child(4) { display: none; }
  .user-cell-email { font-size: 11px; }
}
</style>
