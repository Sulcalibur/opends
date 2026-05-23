<template>
  <div class="login-view">
    <div class="login-container">
      <div class="text-center mb-8">
        <h1 class="text-gray-900 text-5xl mb-2">Welcome Back</h1>
        <p class="text-gray-700 text-xl">Sign in to manage your design system</p>
      </div>

      <div class="login-card bg-white rounded-2xl shadow-2xl p-8">
        <div class="mb-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
            <UIcon name="i-lucide-lock" class="text-primary text-3xl" />
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Admin Access</h2>
        </div>

        <div class="field mb-6">
          <label for="password" class="block mb-2 font-semibold text-slate-700">
            Password
          </label>
          <UInput
            id="password"
            v-model="password"
            type="password"
            class="w-full"
            size="lg"
            placeholder="Enter your admin password"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <UCheckbox
              id="remember"
              v-model="rememberMe"
            />
            <label for="remember" class="text-slate-600 cursor-pointer select-none">Remember me</label>
          </div>
          <a href="#" class="font-semibold hover:underline" @click.prevent="showHelp">
            Need help?
          </a>
        </div>

        <UButton
          class="w-full font-bold"
          size="lg"
          :loading="loading"
          @click="handleLogin"
        >
          Sign In
        </UButton>
      </div>

      <div class="login-footer mt-8">
        <p class="text-gray-600 text-center text-sm font-medium">
          OpenDS v{{ version }} • Simple, self-hosted design system tool
        </p>
      </div>
    </div>

    <!-- Help Dialog -->
    <UModal v-model="showHelpDialog" title="Login Help">
      <div class="flex flex-col gap-6 py-2">
        <div class="flex gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 flex-shrink-0">
            <UIcon name="i-lucide-info" class="text-primary text-xl" />
          </div>
          <div>
            <p class="font-bold text-lg mb-2 text-slate-900">Admin Password Setup</p>
            <p class="text-slate-600 mb-3 leading-relaxed">
              The admin password is configured via environment variable:
            </p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
              VITE_ADMIN_PASSWORD=your-secure-password
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 flex-shrink-0">
            <UIcon name="i-lucide-key" class="text-green-600 text-xl" />
          </div>
          <div>
            <p class="font-bold text-lg mb-2 text-slate-900">Generating a Hash</p>
            <p class="text-slate-600 mb-3 leading-relaxed">
              Generate a secure password hash using Node.js:
            </p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 overflow-x-auto">
              node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password', 10).then(console.log)"
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <UButton
          variant="ghost"
          class="font-bold"
          @click="showHelpDialog = false"
        >
          Close
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '#imports'
import { useAuthStore } from '@/app/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const showHelpDialog = ref(false)
const version = '0.1.0'

async function handleLogin() {
  if (!password.value.trim()) {
    toast.add({
      title: 'Password Required',
      description: 'Please enter the admin password',
      color: 'warning'
    })
    return
  }

  loading.value = true

  try {
    const success = await authStore.login(password.value)

    if (success) {
      toast.add({
        title: 'Login Successful',
        description: 'Welcome to OpenDS Admin',
        color: 'success'
      })

      // Redirect to admin dashboard
      router.push('/admin')
    } else {
      toast.add({
        title: 'Login Failed',
        description: 'Invalid password. Please try again.',
        color: 'error'
      })
      password.value = ''
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.add({
      title: 'Login Error',
      description: 'An error occurred during login. Please try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function showHelp() {
  showHelpDialog.value = true
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 480px;
}
</style>
