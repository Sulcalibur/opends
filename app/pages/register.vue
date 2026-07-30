<script setup lang="ts">
definePageMeta({ layout: 'centered' })

const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})
const orgName = computed(() => settings.value.organization_name || 'Design System')

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  error.value = ''

  try {
    const auth = useAuthStore()
    const success = await auth.register(email.value, password.value, name.value)

    if (success) {
      await navigateTo('/login?registered=true')
    } else {
      error.value = auth.error || 'Registration failed.'
    }
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({ title: `Create account — ${orgName.value}` })
</script>

<template>
  <div class="register-screen">
    <!-- Left: form -->
    <div class="register-form-panel">
      <div class="register-header">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--primary)" />
          <path d="M10 11.5C10 9.567 11.567 8 13.5 8h5C20.433 8 22 9.567 22 11.5v9c0 1.933-1.567 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 10 20.5z" stroke="white" stroke-width="2.2"/>
          <circle cx="16" cy="16" r="1.7" fill="white"/>
        </svg>
        <span class="register-brand-name">OpenDS</span>
        <UBadge color="neutral" variant="soft" size="xs">v0.2 · self-hosted</UBadge>
      </div>

      <div class="register-form-body">
        <h1 class="register-title">Create your account</h1>
        <p class="register-subtitle">Join the {{ orgName }} design system.</p>

        <form class="register-fields" @submit.prevent="handleRegister">
          <div class="field">
            <label class="field-label" for="name">Full name</label>
            <UInput id="name" v-model="name" placeholder="Mira Quinn" size="xl" icon="i-lucide-user" autocomplete="name" />
          </div>

          <div class="field">
            <label class="field-label" for="email">Email</label>
            <UInput id="email" v-model="email" type="email" placeholder="you@team.co" size="xl" icon="i-lucide-mail" autocomplete="email" />
          </div>

          <div class="field">
            <label class="field-label" for="password">Password</label>
            <UInput id="password" v-model="password" type="password" placeholder="At least 8 characters" size="xl" icon="i-lucide-lock" autocomplete="new-password" />
          </div>

          <div class="field">
            <label class="field-label" for="confirm">Confirm password</label>
            <UInput id="confirm" v-model="confirmPassword" type="password" placeholder="Re-enter your password" size="xl" icon="i-lucide-lock" autocomplete="new-password" />
          </div>

          <div v-if="error" class="register-error">
            <UIcon name="i-lucide-alert-circle" class="size-4" />
            {{ error }}
          </div>

          <UButton type="submit" size="xl" block :loading="loading" class="register-submit-btn">
            Create account
          </UButton>
        </form>

        <div class="register-footer-text">
          Already have an account?
          <NuxtLink to="/login">Sign in →</NuxtLink>
        </div>
      </div>

      <div class="register-footer-meta">
        <span>&copy; 2026 {{ orgName }}</span>
        <span class="footer-meta-links">
          <span>Privacy</span><span>Terms</span>
        </span>
      </div>
    </div>

    <!-- Right: brand panel -->
    <div class="register-brand-panel">
      <div class="brand-tag">
        <UBadge color="primary" variant="soft" size="xs" :ui="{ base: 'bg-[rgba(255,107,74,.18)] text-[#FFB8A3]' }">
          <UIcon name="i-lucide-sparkles" class="size-3" /> v0.2.0
        </UBadge>
      </div>
      <div class="brand-message">
        <div class="brand-headline">Your team's single source of truth starts here.</div>
        <div class="brand-description">
          Document components, manage tokens, and share guidelines — all in one self-hosted place.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-screen {
  display: flex;
  min-height: 100vh;
}

/* ── Left form ───────────────────────────────────────────── */
.register-form-panel {
  flex: 0 0 540px;
  display: flex;
  flex-direction: column;
  padding: 40px 64px;
  background: var(--bg-elevated);
}

.register-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.register-brand-name {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.register-form-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 380px;
}

.register-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin-bottom: 8px;
  color: var(--text);
}

.register-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.register-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.register-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--danger-soft);
  color: var(--danger);
  border-radius: var(--r-input);
  font-size: 13px;
  font-weight: 500;
}

.register-submit-btn {
  margin-top: 8px;
}

.register-footer-text {
  margin-top: 32px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}
.register-footer-text a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.register-footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-tertiary);
}

.footer-meta-links {
  display: inline-flex;
  gap: 12px;
}

/* ── Right brand panel ──────────────────────────────────── */
.register-brand-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,107,74,.25), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255,209,102,.20), transparent 50%),
    #1A1D21;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-tag { z-index: 1; }

.brand-message { z-index: 1; }

.brand-headline {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: white;
  margin-bottom: 12px;
  max-width: 480px;
}

.brand-description {
  font-size: 14.5px;
  color: #9AA3B2;
  max-width: 420px;
  line-height: 1.55;
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .register-screen { flex-direction: column; }
  .register-form-panel { flex: none; padding: 28px 24px; min-height: 100vh; }
  .register-brand-panel { display: none; }
  .register-title { font-size: 28px; }
  .register-form-body { max-width: none; }
}
</style>
