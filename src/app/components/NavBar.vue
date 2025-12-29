<template>
  <nav class="navbar bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 no-underline group">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <span class="text-xl font-bold text-white">DS</span>
        </div>
        <span class="text-xl font-bold text-slate-900 tracking-tight">OpenDS</span>
      </router-link>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-8">
        <router-link 
          v-for="link in links" 
          :key="link.path" 
          :to="link.path"
          class="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors py-2 border-b-2 border-transparent hover:border-slate-900"
          active-class="text-slate-900 border-slate-900"
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
           <router-link to="/admin">
            <Button label="Dashboard" severity="secondary" size="small" class="font-bold" />
           </router-link>
           <Button icon="pi pi-sign-out" text rounded severity="secondary" size="small" @click="handleLogout" />
        </div>
        <div v-else>
          <router-link to="/login">
            <Button label="Sign In" severity="primary" size="small" class="font-bold px-6" rounded />
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/app/stores/auth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const authStore = useAuthStore()
const router = useRouter()

const links = [
  { name: 'Docs', path: '/docs' },
  { name: 'Components', path: '/components' },
  { name: 'Tokens', path: '/tokens' }
]

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  /* Ensure it sits on top */
  position: sticky;
  top: 0;
}
</style>
