<script setup lang="ts">
import { computed } from 'vue'

const { data: settingsData, refresh: refreshSettings } = await useFetch('/api/settings/public', {
  key: 'public-settings'
})
const settings = computed(() => settingsData.value?.settings || {})

// Fetch all published documentation
const { data: docs } = await useFetch('/api/docs', {
  query: { isPublished: 1 }
})

const pages = computed(() => docs.value?.data || [])

// Group pages by category
const pagesByCategory = computed(() => {
  const grouped: Record<string, any[]> = {}
  
  pages.value.forEach((page: any) => {
    const category = page.category || 'general'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(page)
  })
  
  // Sort pages within each category by sortOrder (mock) or title
  Object.keys(grouped).forEach(cat => {
    grouped[cat].sort((a, b) => a.title.localeCompare(b.title))
  })
  
  return grouped
})

const categories = computed(() => Object.keys(pagesByCategory.value).sort())

useHead({
  title: computed(() => `${settings.value.organization_name || 'OpenDS'} Design System`),
  meta: [
    { name: 'description', content: 'Design system documentation and guidelines.' }
  ]
})
</script>

<template>
  <div class="ds-home">
    <!-- Phase Banner -->
    <div class="ds-phase-banner container mx-auto max-w-7xl px-6" v-if="settings.general?.phase && settings.general.phase !== 'None'">
      <span class="ds-phase-tag">{{ settings.general.phase }}</span>
      <p class="text-sm">This is a new service – your <a href="#">feedback</a> will help us to improve it.</p>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto max-w-7xl px-6 py-12">
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          {{ settings.home_hero?.title || (settings.organization_name ? settings.organization_name + ' Design System' : 'OpenDS Design System') }}
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl">
          {{ settings.home_hero?.subtitle || 'Use this design system to build consistent, accessible, and high-quality digital services.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Quick Links -->
        <div class="col-span-full mb-8">
           <h2 class="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">Get Started</h2>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NuxtLink to="/docs/components" class="ds-card">
                <div class="ds-card-icon blue">
                  <i class="pi pi-th-large"></i>
                </div>
                <h3 class="ds-card-title">Components</h3>
                <p class="ds-card-text">Browse the component library.</p>
              </NuxtLink>
              <NuxtLink to="/tokens" class="ds-card">
                <div class="ds-card-icon indigo">
                  <i class="pi pi-palette"></i>
                </div>
                <h3 class="ds-card-title">Design Tokens</h3>
                <p class="ds-card-text">Colors, spacing, and typography.</p>
              </NuxtLink>
              <NuxtLink to="/admin" class="ds-card">
                 <div class="ds-card-icon slate">
                  <i class="pi pi-cog"></i>
                </div>
                <h3 class="ds-card-title">Admin</h3>
                <p class="ds-card-text">Manage settings and content.</p>
              </NuxtLink>
           </div>
        </div>

        <!-- Documentation Sections -->
        <div v-for="category in categories" :key="category" class="col-span-full">
           <h2 class="text-2xl font-bold text-slate-900 mb-6 border-b pb-2 capitalize">{{ category }}</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NuxtLink v-for="page in pagesByCategory[category]" :key="page.slug" :to="`/docs/${page.slug}`" class="doc-card">
                 <h3 class="font-bold text-lg mb-2 group-hover:underline decoration-2 underline-offset-2">{{ page.title }}</h3>
                 <p class="text-slate-600 text-sm line-clamp-2">{{ page.excerpt || 'No description available.' }}</p>
              </NuxtLink>
           </div>
        </div>
      </div>
    </main>
    
    <footer class="border-t mt-20 py-12 bg-slate-50">
        <div class="container mx-auto max-w-7xl px-6 text-center text-slate-500 text-sm">
            &copy; {{ new Date().getFullYear() }} {{ settings.organization_name || 'OpenDS' }}. All rights reserved.
        </div>
    </footer>
  </div>
</template>

<style scoped>
.ds-home {
  min-height: 100vh;
  background-color: white;
}

.ds-home h1 {
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.ds-home p {
  line-height: 1.6;
}

.ds-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px; /* Variable radius support could be added here */
  text-decoration: none;
  transition: all 0.2s;
  background: white;
}

.ds-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ds-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.ds-card-icon.blue { background-color: #eff6ff; color: #3b82f6; }
.ds-card-icon.indigo { background-color: #eef2ff; color: #6366f1; }
.ds-card-icon.slate { background-color: #f1f5f9; color: #64748b; }

.ds-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.ds-card-text {
  color: #64748b;
  font-size: 0.875rem;
}

.doc-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  text-decoration: none;
  transition: border-color 0.2s;
}

.doc-card:hover {
  border-color: var(--primary-color);
  border-left-width: 4px;
}

.doc-card h3 {
    color: var(--primary-color);
}
</style>
