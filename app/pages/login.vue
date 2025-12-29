<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          OpenDS
        </h1>
        <p class="text-gray-600 text-lg">Sign in to your account</p>
      </div>

      <!-- Login Card -->
      <Card class="auth-card">
        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                placeholder="admin@example.com"
                class="w-full"
                :class="{ 'p-invalid': emailError }"
                autocomplete="email"
              />
              <small v-if="emailError" class="p-error">{{ emailError }}</small>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <Password
                id="password"
                v-model="password"
                :feedback="false"
                toggle-mask
                class="w-full"
                input-class="w-full"
                placeholder="Enter your password"
                :class="{ 'p-invalid': passwordError }"
              />
              <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
            </div>

            <!-- Error Message -->
            <Message v-if="authStore.error" severity="error" :closable="false">
              {{ authStore.error }}
            </Message>

            <!-- Submit Button -->
            <Button
              type="submit"
              label="Sign In"
              class="w-full"
              :loading="authStore.loading"
              size="large"
            />

            <!-- Register Link -->
            <div class="text-center text-sm">
              <span class="text-gray-600">Don't have an account?</span>
              <NuxtLink to="/register" class="text-primary-600 font-semibold hover:underline ml-1">
                Create one
              </NuxtLink>
            </div>
          </form>
        </template>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-gray-500">
        <p>OpenDS v0.2.0 • Self-hosted design system tool</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'centered',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

async function handleLogin() {
  // Reset errors
  emailError.value = ''
  passwordError.value = ''

  // Validate
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

  // Login
  const success = await authStore.login(email.value, password.value)

  if (success) {
    // Redirect to dashboard
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
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:deep(.p-card-content) {
  padding: 2rem;
}
</style>