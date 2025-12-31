<template>
  <div class="auth-page">
    <div class="background-decor">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="auth-container">
      <!-- Logo/Header -->
      <div class="text-center mb-10">
        <div class="ds-logo-wrapper mb-4">
          <div class="ds-logo">
            {{ orgInitial }}
          </div>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2 mt-4">
          {{ orgName }}
        </h1>
        <p class="text-slate-500">Welcome back! Please sign in.</p>
      </div>

      <!-- Login Card -->
      <Card class="auth-card glass">
        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div class="field">
              <label for="email" class="auth-label">Email Address</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope" />
                <InputText
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="name@company.com"
                  class="w-full auth-input"
                  :class="{ 'p-invalid': emailError }"
                />
              </span>
              <small v-if="emailError" class="p-error block mt-1">{{ emailError }}</small>
            </div>

            <!-- Password -->
            <div class="field">
              <div class="flex justify-between items-center mb-1">
                <label for="password" class="auth-label">Password</label>
                <a href="#" class="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-lock" />
                <Password
                  id="password"
                  v-model="password"
                  :feedback="false"
                  toggle-mask
                  class="w-full"
                  input-class="w-full auth-input"
                  placeholder="Enter password"
                  :class="{ 'p-invalid': passwordError }"
                />
              </span>
              <small v-if="passwordError" class="p-error block mt-1">{{ passwordError }}</small>
            </div>

            <!-- Error Message -->
            <Message v-if="authStore.error" severity="error" :closable="false" class="mt-4">
              {{ authStore.error }}
            </Message>

            <!-- Submit Button -->
            <Button
              type="submit"
              label="Sign In"
              class="w-full premium-auth-btn"
              :loading="authStore.loading"
            />

            <!-- Register Link -->
            <div class="text-center text-sm pt-2">
              <span class="text-slate-500">New around here?</span>
              <NuxtLink to="/register" class="text-blue-600 font-bold hover:underline ml-1">
                Create account
              </NuxtLink>
            </div>
          </form>
        </template>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-12 text-xs text-slate-400">
        <p>{{ orgName }} v0.2.0 • Powered by Nessie Design Engine</p>
      </div>
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
}

.background-decor {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.1);
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(236, 72, 153, 0.1);
  bottom: -50px;
  right: -50px;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 10;
}

.ds-logo-wrapper {
  display: flex;
  justify-content: center;
}

.ds-logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
}

.auth-card {
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
}

.auth-card.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}

.auth-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
  display: block;
}

.auth-input {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  transition: all 0.2s;
}

.auth-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.premium-auth-btn {
  background: #0f172a;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-auth-btn:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
}

:deep(.p-card-content) {
  padding: 2.5rem;
}

:deep(.p-input-icon-left > i) {
  color: #94a3b8;
}

:deep(.p-input-icon-left > .auth-input) {
  padding-left: 2.75rem;
}
</style>