<template>
  <nav class="navbar bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 no-underline group">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <span class="text-xl font-bold text-white">{{ orgInitial }}</span>
        </div>
        <span class="text-xl font-bold text-slate-900 tracking-tight">{{ orgName }}</span>
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
            <UButton color="neutral" variant="outline" size="sm" class="font-bold">Dashboard</UButton>
          </router-link>
          <UButton icon="i-lucide-log-out" variant="ghost" color="neutral" size="sm" @click="handleLogout" />
        </div>
        <div v-else>
          <router-link to="/login">
            <UButton size="sm" class="font-bold px-6">Sign In</UButton>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/app/stores/auth'
import { useRouter } from 'vue-router'
import { useFetch } from '#imports'

const authStore = useAuthStore()
const router = useRouter()

const { data: settingsData } = await useFetch("/api/settings/public").catch(() => ({ data: ref(null) }));
const settings = computed(() => settingsData.value?.settings || {});

const orgName = computed(() => settings.value?.organization_name || "OpenDS");
const orgInitial = computed(() => (orgName.value || "O").substring(0, 2).toUpperCase());

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
  position: sticky;
  top: 0;
}
</style>
