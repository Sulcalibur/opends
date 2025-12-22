<template>
  <div class="login-view">
    <div class="login-container">
      <div class="text-center mb-8">
        <h1 class="text-white text-5xl mb-2">Welcome Back</h1>
        <p class="text-white opacity-80 text-xl">Sign in to manage your design system</p>
      </div>

      <Card class="login-card shadow-2xl border-none">
        <template #content>
          <div class="login-form p-4">
            <div class="mb-8 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                <i class="pi pi-lock text-primary text-3xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-slate-900">Admin Access</h2>
            </div>

            <div class="field mb-6">
              <label for="password" class="block mb-2 font-semibold text-slate-700">
                Password
              </label>
              <Password 
                id="password"
                v-model="password" 
                :feedback="false" 
                toggle-mask
                class="w-full"
                input-class="w-full p-inputtext-lg"
                placeholder="Enter your admin password"
                @keyup.enter="handleLogin"
              />
            </div>

            <div class="flex align-items-center justify-between mb-8">
              <div class="flex align-items-center gap-2">
                <Checkbox 
                  id="remember" 
                  v-model="rememberMe" 
                  binary 
                />
                <label for="remember" class="text-slate-600 cursor-pointer select-none">Remember me</label>
              </div>
              <a href="#" class="font-semibold hover:underline" @click.prevent="showHelp">
                Need help?
              </a>
            </div>

            <Button 
              label="Sign In" 
              severity="primary" 
              class="w-full p-button-lg font-bold"
              :loading="loading"
              @click="handleLogin"
            />
          </div>
        </template>
      </Card>

      <div class="login-footer mt-8">
        <p class="text-white opacity-60 text-center text-sm font-medium">
          OpenDS v{{ version }} • Simple, self-hosted design system tool
        </p>
      </div>
    </div>

    <!-- Help Dialog -->
    <Dialog 
      v-model:visible="showHelpDialog" 
      modal 
      header="Login Help"
      :style="{ width: '500px' }"
      class="p-dialog-modern"
    >
      <div class="flex flex-column gap-6 py-2">
        <div class="flex gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 flex-shrink-0">
            <i class="pi pi-info-circle text-primary text-xl"></i>
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
            <i class="pi pi-key text-green-600 text-xl"></i>
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
        <Button 
          label="Close" 
          severity="secondary" 
          @click="showHelpDialog = false"
          text
          class="font-bold"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/app/stores/auth'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'

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
      severity: 'warn',
      summary: 'Password Required',
      detail: 'Please enter the admin password',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const success = await authStore.login(password.value)
    
    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: 'Welcome to OpenDS Admin',
        life: 3000
      })
      
      // Redirect to admin dashboard
      router.push('/admin')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid password. Please try again.',
        life: 3000
      })
      password.value = ''
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.add({
      severity: 'error',
      summary: 'Login Error',
      detail: 'An error occurred during login. Please try again.',
      life: 3000
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 480px; /* Slightly wider for modern feel */
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px; /* Larger radius */
  backdrop-filter: blur(10px);
}

:deep(.p-password-input) {
  width: 100%;
  padding: 1rem; /* Larger inputs */
  border-radius: 0.75rem;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-card-body) {
  padding: 2rem; /* More whitespace */
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}
</style>