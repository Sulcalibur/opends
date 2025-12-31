<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          OpenDS
        </h1>
        <p class="text-gray-600 text-lg">Create your account</p>
      </div>

      <!-- Register Card -->
      <Card class="auth-card">
        <template #content>
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <InputText
                id="name"
                v-model="name"
                placeholder="John Doe"
                class="w-full"
                :class="{ 'p-invalid': nameError }"
                autocomplete="name"
              />
              <small v-if="nameError" class="p-error">{{ nameError }}</small>
            </div>

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
                toggle-mask
                :feedback="true"
                strong-regex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                class="w-full"
                input-class="w-full"
                placeholder="Create a secure password"
                :class="{ 'p-invalid': passwordError }"
              />
              <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
              <small v-else class="text-gray-500">
                Min 8 characters, uppercase, lowercase, and number required
              </small>
            </div>

            <!-- Error Message -->
            <Message v-if="authStore.error" severity="error" :closable="false">
              {{ authStore.error }}
            </Message>

            <!-- Info Message for First User -->
            <div v-if="isFirstUser === null" class="first-user-notice">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-info-circle text-blue-600"></i>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 mb-1">First User Setup</p>
                  <p class="text-sm text-gray-600">The first registered user will become the administrator with full access to the system.</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              label="Create Account"
              class="w-full"
              :loading="authStore.loading"
              size="large"
            />

            <!-- Login Link -->
            <div class="text-center text-sm">
              <span class="text-gray-600">Already have an account?</span>
              <NuxtLink to="/login" class="text-primary-600 font-semibold hover:underline ml-1">
                Sign in
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
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'centered',
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const isFirstUser = ref<boolean | null>(null)

onMounted(async () => {
  // Check if this will be the first user
  try {
    const response = await $fetch('/api/auth/status')
    isFirstUser.value = (response as any)?.isFirstUser || false
  } catch {
    isFirstUser.value = null
  }
})

async function handleRegister() {
  // Reset errors
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''

  // Validate
  if (!name.value) {
    nameError.value = 'Name is required'
    return
  }
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }
  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return
  }

  // Register
  const success = await authStore.register(email.value, password.value, name.value)

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
  background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
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

:deep(.p-password) {
  width: 100%;
}

.first-user-notice {
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
}
</style>
