<template>
  <div class="login-view">
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
      <Card class="w-full max-w-md">
        <template #title>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Welcome to OpenDS
            </h1>
            <p class="text-surface-600 dark:text-surface-400 mt-2">
              Sign in to your account
            </p>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="field">
              <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Email
              </label>
              <InputText 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="you@example.com"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="password" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Password
              </label>
              <Password 
                id="password" 
                v-model="password" 
                :feedback="false" 
                toggleMask
                placeholder="••••••••"
                class="w-full"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Checkbox v-model="rememberMe" inputId="remember" binary />
                <label for="remember" class="ml-2 text-sm text-surface-600 dark:text-surface-400">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Forgot password?
              </a>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="space-y-4">
            <Button 
              label="Sign In" 
              severity="primary" 
              class="w-full"
              :loading="authStore.loading"
              @click="handleLogin"
            />
            
            <div class="text-center">
              <p class="text-sm text-surface-600 dark:text-surface-400">
                Don't have an account? 
                <a 
                  href="#" 
                  class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                  @click.prevent="showRegister = true"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Registration Dialog -->
    <Dialog 
      v-model:visible="showRegister" 
      modal 
      header="Create Account"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div class="field">
          <label for="register-name" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Full Name
          </label>
          <InputText 
            id="register-name" 
            v-model="registerName" 
            placeholder="John Doe"
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label for="register-email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Email
          </label>
          <InputText 
            id="register-email" 
            v-model="registerEmail" 
            type="email" 
            placeholder="you@example.com"
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label for="register-password" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Password
          </label>
          <Password 
            id="register-password" 
            v-model="registerPassword" 
            :feedback="true" 
            toggleMask
            placeholder="••••••••"
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label for="register-confirm" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Confirm Password
          </label>
          <Password 
            id="register-confirm" 
            v-model="registerConfirm" 
            :feedback="false" 
            toggleMask
            placeholder="••••••••"
            class="w-full"
          />
        </div>
        
        <div class="flex items-center">
          <Checkbox v-model="acceptTerms" inputId="terms" binary />
          <label for="terms" class="ml-2 text-sm text-surface-600 dark:text-surface-400">
            I agree to the 
            <a href="#" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Terms of Service
            </a>
            and 
            <a href="#" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>
      
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="showRegister = false"
          />
          <Button 
            label="Create Account" 
            severity="primary" 
            :disabled="!acceptTerms || registerPassword !== registerConfirm"
            @click="handleRegister"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const showRegister = ref(false)
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerConfirm = ref('')
const acceptTerms = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    return
  }
  
  try {
    await authStore.login(email.value, password.value)
    
    // Redirect to dashboard
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}

async function handleRegister() {
  if (!registerName.value || !registerEmail.value || !registerPassword.value) {
    return
  }
  
  if (registerPassword.value !== registerConfirm.value) {
    return
  }
  
  try {
    await authStore.register(
      registerEmail.value,
      registerPassword.value,
      registerName.value
    )
    
    // Close dialog and redirect
    showRegister.value = false
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped>
.login-view {
  @apply min-h-screen;
}
</style>