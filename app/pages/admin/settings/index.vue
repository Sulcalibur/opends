<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})

const orgName = ref(settings.value.organization_name || 'Design System')
const allowRegistration = ref(settings.value.allow_registration ?? true)
const saved = ref(false)

const auth = useAuthStore()

async function saveSettings() {
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      body: { organization_name: orgName.value, allow_registration: allowRegistration.value },
    })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  } catch { /* handle error */ }
}

useHead({ title: 'Settings — Admin' })
</script>

<template>
  <div class="settings-page">
    <h1 class="settings-title">Settings</h1>
    <p class="settings-subtitle">Manage your workspace configuration.</p>

    <div class="settings-card">
      <div class="settings-section">
        <div class="settings-heading">General</div>
        <div class="settings-field">
          <label class="settings-label">Organization name</label>
          <UInput v-model="orgName" size="md" placeholder="Your team name" />
        </div>
        <div class="settings-field">
          <label class="settings-label">Allow registration</label>
          <div class="settings-toggle-row">
            <span class="settings-toggle-desc">{{ allowRegistration ? 'Anyone can sign up' : 'Invite-only' }}</span>
            <button class="toggle" :class="{ on: allowRegistration }" @click="allowRegistration = !allowRegistration">
              <span class="toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-heading">API Keys</div>
        <p class="settings-field-desc">Manage keys for the Penpot plugin and MCP server access.</p>
        <UButton variant="outline" size="sm" to="/admin/api-keys">Manage API keys</UButton>
      </div>

      <div class="settings-section">
        <div class="settings-heading">Danger zone</div>
        <p class="settings-field-desc">These actions cannot be undone.</p>
        <UButton color="error" variant="outline" size="sm">Reset workspace</UButton>
      </div>

      <div class="settings-actions">
        <UButton @click="saveSettings" :class="{ 'opacity-50': saved }">
          {{ saved ? 'Saved' : 'Save changes' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { max-width: 680px; }

.settings-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.settings-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.settings-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
}

.settings-section {
  padding: 24px;
  border-bottom: 1px solid var(--border);
}
.settings-section:last-of-type { border-bottom: none; }

.settings-heading {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
}

.settings-field {
  margin-bottom: 16px;
}
.settings-field:last-child { margin-bottom: 0; }

.settings-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.settings-field-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.settings-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-toggle-desc {
  font-size: 13px;
  color: var(--text);
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-micro);
}
.toggle.on { background: var(--primary); }
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
.toggle.on .toggle-knob { transform: translateX(16px); }

/* ── Mobile ── */
@media (max-width: 640px) {
  .settings-page { max-width: 100%; }
  .settings-section { padding: 18px; }
}

.settings-actions {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}
</style>
