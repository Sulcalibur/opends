<template>
  <div class="login-view">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="flex align-items-center justify-content-center gap-2">
            <i class="pi pi-lock text-primary"></i>
            <span>Admin Login</span>
          </div>
        </template>
        <template #content>
          <div class="login-form">
            <div class="field mb-4">
              <label for="password" class="block mb-2 font-medium">
                Admin Password
              </label>
              <Password 
                id="password"
                v-model="password" 
                :feedback="false" 
                toggle-mask
                class="w-full"
                input-class="w-full"
                placeholder="Enter admin password"
                @keyup.enter="handleLogin"
              />
              <small class="text-color-secondary mt-1 block">
                Set via VITE_ADMIN_PASSWORD environment variable
              </small>
            </div>

            <div class="flex align-items-center justify-content-between mb-4">
              <div class="flex align-items-center gap-2">
                <Checkbox 
                  id="remember" 
                  v-model="rememberMe" 
                  binary 
                />
                <label for="remember" class="text-sm">Remember me</label>
              </div>
              <a href="#" class="text-sm text-primary hover:underline" @click.prevent="showHelp">
                Need help?
              </a>
            </div>

            <Button 
              label="Login" 
              severity="primary" 
              class="w-full"
              :loading="loading"
              @click="handleLogin"
            />

            <div class="mt-4 text-center">
              <p class="text-sm text-color-secondary">
                Forgot your password? Check your environment variables.
              </p>
            </div>
          </div>
        </template>
      </Card>

      <div class="login-footer mt-4">
        <p class="text-sm text-color-secondary text-center">
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
    >
      <div class="flex flex-column gap-3">
        <div class="flex align-items-start gap-3">
          <i class="pi pi-info-circle text-primary mt-1"></i>
          <div>
            <p class="font-medium mb-2">Admin Password Setup</p>
            <p class="text-color-secondary mb-2">
              The admin password is configured via environment variable:
            </p>
            <code class="block p-2 bg-surface-100 border-round text-sm mb-3">
              VITE_ADMIN_PASSWORD=your-secure-password
            </code>
            <p class="text-color-secondary">
              In development, you can use any password. In production, use a strong, unique password.
            </p>
          </div>
        </div>

        <div class="flex align-items-start gap-3">
          <i class="pi pi-key text-green-500 mt-1"></i>
          <div>
            <p class="font-medium mb-2">Generating a Secure Password</p>
            <p class="text-color-secondary">
              You can generate a secure password hash using the following command:
            </p>
            <code class="block p-2 bg-surface-100 border-round text-sm mt-2">
              node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log)"
            </code>
          </div>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Close" 
          severity="secondary" 
          @click="showHelpDialog = false"
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--surface-0);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-form {
  padding: 0.5rem 0;
}

.login-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}
</style>