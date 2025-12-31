<script setup lang="ts">
import { computed } from 'vue'

const router = useRouter()
const { data: settingsData } = await useFetch('/api/settings/public')
const settings = computed(() => settingsData.value?.settings || {})

const orgName = computed(() => settings.value.organization_name || 'OpenDS')
const orgInitial = computed(() => orgName.value.substring(0, 2).toUpperCase())

const links = [
  { name: 'Docs', path: '/docs' },
  { name: 'Components', path: '/docs/components' },
  { name: 'Tokens', path: '/tokens' }
]

function handleLogout() {
  router.push('/login')
}
</script>

<template>
  <nav class="navbar bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="no-underline">
        <Logo :text="orgName" />
      </NuxtLink>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors py-2 border-b-2 border-transparent hover:border-slate-900"
          active-class="text-slate-900 border-slate-900"
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin">
            <Button 
              label="Dashboard" 
              severity="secondary" 
              size="small" 
              class="font-bold theme-border-radius" 
            />
          </NuxtLink>
          <Button icon="pi pi-sign-out" text rounded severity="secondary" size="small" @click="handleLogout" />
        </div>
        <div>
          <NuxtLink to="/login">
            <Button 
              label="Sign In" 
              size="small" 
              class="font-bold px-6 theme-btn-primary" 
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
}

.theme-btn-primary {
  background: var(--primary-color, #4f46e5);
  border: none;
  color: white;
  border-radius: var(--border-radius, 9999px);
}

.theme-btn-primary:hover {
  background: var(--primary-color-hover, #4338ca);
}

.theme-border-radius {
  border-radius: var(--border-radius, 0.5rem) !important;
}
</style>
