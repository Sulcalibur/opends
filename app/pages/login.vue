<script setup lang="ts">
definePageMeta({ layout: 'centered' })

const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})
const orgName = computed(() => settings.value.organization_name || 'Design System')

const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: { user: any; tokens: { accessToken: string; refreshToken: string } }
    }>('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    if (response.success && response.data?.tokens) {
      const auth = useAuthStore()
      auth.saveAuth(response.data.tokens.accessToken, response.data.tokens.refreshToken, response.data.user)
      await navigateTo('/admin')
    }
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({ title: `Sign in — ${orgName.value}` })
</script>

<template>
  <div class="login-screen">
    <!-- Left: form -->
    <div class="login-form-panel">
      <div class="login-header">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--primary)" />
          <path d="M10 11.5C10 9.567 11.567 8 13.5 8h5C20.433 8 22 9.567 22 11.5v9c0 1.933-1.567 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 10 20.5z" stroke="white" stroke-width="2.2"/>
          <circle cx="16" cy="16" r="1.7" fill="white"/>
        </svg>
        <span class="login-brand-name">OpenDS</span>
        <UBadge color="neutral" variant="soft" size="xs">v0.2 · self-hosted</UBadge>
      </div>

      <div class="login-form-body">
        <h1 class="login-title">Welcome back</h1>
        <p class="login-subtitle">Sign in to your {{ orgName }} workspace.</p>

        <!-- OAuth buttons -->
        <div class="login-oauth">
          <UButton variant="outline" size="xl" block>
            <template #leading>
              <UIcon name="i-lucide-github" class="size-4" />
            </template>
            Continue with GitHub
          </UButton>
          <UButton variant="outline" size="xl" block>
            <template #leading>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path fill="#4285F4" d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.9h4.2c-.2 1-.7 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8z"/>
                <path fill="#34A853" d="M8 16c2.2 0 4-.7 5.3-2l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H.9v2C2.2 14.1 4.9 16 8 16z"/>
                <path fill="#FBBC04" d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5v-2H.9C.3 5.7 0 6.8 0 8s.3 2.3.9 3.5l2.6-2z"/>
                <path fill="#EA4335" d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .9 10.2 0 8 0 4.9 0 2.2 1.9.9 4.5l2.6 2C4.2 4.6 5.9 3.2 8 3.2z"/>
              </svg>
            </template>
            Continue with Google
          </UButton>
        </div>

        <div class="login-divider">
          <span class="login-divider-line" />
          <span class="login-divider-text">or</span>
          <span class="login-divider-line" />
        </div>

        <!-- Email/password -->
        <form class="login-fields" @submit.prevent="handleLogin">
          <div class="field">
            <label class="field-label" for="email">Email</label>
            <UInput
              id="email"
              v-model="email"
              type="email"
              placeholder="you@team.co"
              size="xl"
              icon="i-lucide-mail"
              autocomplete="email"
            />
          </div>

          <div class="field">
            <div class="field-label-row">
              <label class="field-label" for="password">Password</label>
              <NuxtLink to="/forgot-password" class="field-extra">Forgot?</NuxtLink>
            </div>
            <UInput
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••••"
              size="xl"
              icon="i-lucide-lock"
              autocomplete="current-password"
            />
          </div>

          <label class="remember-row">
            <span class="remember-check" :class="{ checked: rememberMe }" @click="rememberMe = !rememberMe">
              <UIcon v-if="rememberMe" name="i-lucide-check" class="size-3" />
            </span>
            Keep me signed in for 30 days
          </label>

          <div v-if="error" class="login-error">
            <UIcon name="i-lucide-alert-circle" class="size-4" />
            {{ error }}
          </div>

          <UButton type="submit" size="xl" block :loading="loading" class="login-submit-btn">
            Sign in
          </UButton>
        </form>

        <div class="login-footer-text">
          New to {{ orgName }}?
          <NuxtLink to="/register">Request access →</NuxtLink>
        </div>
      </div>

      <div class="login-footer-meta">
        <span>&copy; 2026 {{ orgName }}</span>
        <span class="footer-meta-links">
          <span>Privacy</span><span>Terms</span><span>Status</span>
        </span>
      </div>
    </div>

    <!-- Right: brand panel -->
    <div class="login-brand-panel">
      <!-- Mock preview card -->
      <div class="brand-preview-card-wrap">
        <div class="brand-preview-card">
          <div class="brand-preview-chrome">
            <span class="chrome-dot" style="background: #FF6B4A" />
            <span class="chrome-dot" style="background: #FFD166" />
            <span class="chrome-dot" style="background: #3E4551" />
            <span class="chrome-url">lumen.opends.dev/components/button</span>
          </div>
          <div class="brand-preview-body">
            <div class="brand-preview-sidebar">
              <div class="sidebar-active-item">Button</div>
              <div>Checkbox</div><div>Input</div><div>Select</div>
            </div>
            <div class="brand-preview-content">
              <div class="brand-preview-title">Button</div>
              <div class="brand-preview-desc">Triggers an action or event.</div>
              <div class="brand-preview-demo">
                <span class="brand-preview-btn">Save changes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="brand-tag">
        <UBadge color="primary" variant="soft" size="xs" :ui="{ base: 'bg-[rgba(255,107,74,.18)] text-[#FFB8A3]' }">
          <UIcon name="i-lucide-sparkles" class="size-3" /> v0.2.0
        </UBadge>
      </div>

      <div class="brand-message">
        <div class="brand-headline">One source of truth for everything {{ orgName }} ships.</div>
        <div class="brand-description">
          OpenDS hosts your design system docs, tokens, and component reference — self-hosted, open-source, deployed in minutes.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  display: flex;
  min-height: 100vh;
}

/* ── Left form panel ────────────────────────────────────── */
.login-form-panel {
  flex: 0 0 540px;
  display: flex;
  flex-direction: column;
  padding: 40px 64px;
  background: var(--bg-elevated);
}

.login-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-brand-name {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: var(--text);
}

.login-form-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 380px;
}

.login-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin-bottom: 8px;
  color: var(--text);
}

.login-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.login-oauth {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
}

.login-divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.login-divider-text {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

/* Fields */
.login-fields {
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

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.field-extra {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  margin-top: 4px;
}

.remember-check {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-strong);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-micro);
}
.remember-check.checked {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.login-error {
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

.login-submit-btn {
  margin-top: 12px;
}

.login-footer-text {
  margin-top: 32px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}
.login-footer-text a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.login-footer-meta {
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
.login-brand-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,209,102,.25), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255,107,74,.20), transparent 50%),
    #1A1D21;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-preview-card-wrap {
  position: absolute;
  top: 80px;
  right: -120px;
  width: 720px;
  transform: rotate(-4deg);
}

.brand-preview-card {
  background: #252830;
  border: 1px solid #3E4551;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.brand-preview-chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #3E4551;
}

.chrome-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.chrome-url {
  margin-left: 12px;
  font-family: var(--f-mono);
  font-size: 11px;
  color: #9AA3B2;
}

.brand-preview-body {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  font-size: 12px;
}

.brand-preview-sidebar {
  color: #9AA3B2;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
}

.sidebar-active-item {
  color: #FF8A70;
  font-weight: 600;
}

.brand-preview-title {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 24px;
  color: #F0F1F5;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.brand-preview-desc {
  font-size: 11px;
  color: #9AA3B2;
  margin-bottom: 14px;
}

.brand-preview-demo {
  background: #1A1D21;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-preview-btn {
  background: #FF8A70;
  color: #1A1D21;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.brand-tag {
  z-index: 1;
}

.brand-message {
  z-index: 1;
}

.brand-headline {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: white;
  margin-bottom: 12px;
}

.brand-description {
  font-size: 14.5px;
  color: #9AA3B2;
  max-width: 420px;
  line-height: 1.55;
}

/* ── Tablet (≤834px) ────────────────────────────────────── */
@media (max-width: 834px) {
  .login-form-panel { flex: 0 0 440px; padding: 32px 40px; }
  .brand-preview-card-wrap { width: 480px; right: -80px; }
  .brand-headline { font-size: 28px; }
}

/* ── Mobile (≤640px) ────────────────────────────────────── */
@media (max-width: 640px) {
  .login-screen { flex-direction: column; }
  .login-form-panel { flex: none; padding: 28px 24px; min-height: 100vh; }
  .login-brand-panel { display: none; }
  .login-title { font-size: 28px; }
  .login-form-body { max-width: none; }
}
</style>
