<template>
  <div class="auth-page">
    <div class="background-decor">
      <div class="circle circle-1"/>
      <div class="circle circle-2"/>
      <div class="circle circle-3"/>
    </div>

    <div class="auth-container">
      <div class="auth-card glass-card">
        <div class="card-header">
          <div class="logo-wrapper">
            <div class="logo">{{ orgInitial }}</div>
          </div>
        </div>
        <div class="card-content">
          <h1 id="auth-title" class="auth-title">Welcome back!</h1>
          <p class="auth-subtitle">Sign in to continue</p>

          <form class="auth-form" aria-labelledby="auth-title" @submit.prevent="handleLogin">
            <div class="form-group">
              <FloatingInput
                id="email"
                v-model="email"
                type="email"
                label="Email Address"
                placeholder="name@company.com"
                icon="pi-envelope"
                :error="emailError"
                required
              />
            </div>

            <div class="form-group">
              <div class="password-field-wrapper">
                <FloatingInput
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  placeholder="Enter password"
                  icon="pi-lock"
                  :error="passwordError"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" aria-hidden="true"/>
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="auth-error" role="alert">
              <i class="pi pi-times-circle" aria-hidden="true"/>
              <span>{{ authStore.error }}</span>
            </div>

            <PremiumButton
              type="submit"
              variant="primary"
              size="lg"
              class="auth-button"
              :loading="authStore.loading"
            >
              <template #icon>
                <i class="pi pi-sign-in" aria-hidden="true"/>
              </template>
              Sign In
            </PremiumButton>

            <div class="form-footer">
              <div class="form-links">
                <NuxtLink to="/register" class="form-link">Create account</NuxtLink>
                <a href="#" class="form-link">Forgot password?</a>
              </div>
            </div>

            <div class="social-login">
              <p class="social-title">Or continue with</p>
              <div class="social-buttons">
                <button type="button" class="social-button google" aria-label="Sign in with Google">
                  <i class="pi pi-google" aria-hidden="true"/>
                </button>
                <button type="button" class="social-button github" aria-label="Sign in with GitHub">
                  <i class="pi pi-github" aria-hidden="true"/>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <p>{{ orgName }} v0.2.0 • Powered by Nessie Design Engine</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'centered',
  middleware: 'guest'
})

const { data: settingsData } = await useFetch('/api/settings/public')
const settings = computed(() => settingsData.value?.settings || {})

const orgName = computed(() => settings.value.organization_name || 'OpenDS')
const orgInitial = computed(() => orgName.value.substring(0, 2).toUpperCase())

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

async function handleLogin() {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-50) 0%, var(--color-bg-200) 100%);
  padding: 2rem;
  font-family: var(--font-family-body);
  position: relative;
  overflow: hidden;
}

.background-decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary-500);
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: var(--color-secondary-500);
  top: 50%;
  left: -50px;
  animation: float 25s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: var(--color-primary-400);
  bottom: -50px;
  right: 20%;
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-30px) translateX(20px); }
  66% { transform: translateY(20px) translateX(-20px); }
}

.auth-container {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 10;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  animation: fade-up 0.8s var(--easing-out);
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-secondary-400) 100%);
  opacity: 0;
  animation: shimmer 0.6s var(--easing-out);
}

.glass-card:hover::before {
  opacity: 0.15;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-extrabold);
  font-size: 2rem;
  box-shadow: 0 8px 24px -6px rgba(219, 60, 36, 0.25);
  animation: scale-in 0.5s var(--easing-bounce);
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.card-content {
  animation: fade-in 0.6s var(--easing-out) 0.3s both;
}

.auth-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.auth-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.password-field-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--color-text-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.toggle-password:hover {
  color: var(--color-primary-500);
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  animation: slide-down 0.3s var(--easing-out);
}

.auth-error i {
  color: var(--color-error-500);
  font-size: 1.25rem;
}

.auth-error span {
  font-size: 0.9375rem;
  color: var(--color-error-600);
}

.auth-button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1.25rem 2rem !important;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-light);
}

.form-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.form-link {
  color: var(--color-primary-500);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: 1rem;
  transition: color var(--transition-base);
}

.form-link:hover {
  color: var(--color-primary-400);
  text-decoration: underline;
}

.social-login {
  text-align: center;
  margin-top: 2rem;
}

.social-title {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: white;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.social-button:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
}

.auth-footer p {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.dark .auth-page {
  background: linear-gradient(135deg, var(--dark-color-bg-900) 0%, var(--dark-color-bg-800) 100%);
}

.dark .circle-1 {
  background: var(--color-primary-400);
}

.dark .circle-2 {
  background: var(--color-secondary-400);
}

.dark .circle-3 {
  background: var(--color-primary-300);
}

.dark .glass-card {
  background: rgba(21, 22, 30, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .logo {
  background: linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-secondary-400) 100%);
  box-shadow: 0 8px 24px -6px rgba(234, 138, 123, 0.3);
}

.dark .auth-title,
.dark .auth-error span {
  color: var(--dark-color-text-primary);
}

.dark .auth-subtitle,
.dark .social-title {
  color: var(--dark-color-text-secondary);
}

.dark .social-button {
  background: var(--dark-color-bg-100);
  border-color: var(--dark-color-border-200);
  color: var(--dark-color-text-primary);
}

.dark .social-button:hover {
  border-color: var(--color-primary-400);
  box-shadow: 0 4px 12px rgba(234, 138, 123, 0.2);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
