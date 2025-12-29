<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <router-link to="/docs" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i class="pi pi-book text-white text-sm"></i>
          </div>
          <span class="font-bold text-gray-900">OpenDS Docs</span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          <li>
            <router-link
              to="/docs"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'docs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
            >
              <i class="pi pi-home mr-3"></i>
              Overview
            </router-link>
          </li>

          <!-- Documentation links temporarily disabled -->
          <li class="mt-6">
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Documentation
            </div>
          </li>

          <li>
            <span class="flex items-center px-3 py-2 text-sm text-gray-400">
              <i class="pi pi-box mr-3"></i>
              Components (Coming Soon)
            </span>
          </li>

          <li>
            <span class="flex items-center px-3 py-2 text-sm text-gray-400">
              <i class="pi pi-palette mr-3"></i>
              Design Tokens (Coming Soon)
            </span>
          </li>

          <!-- Admin section - only visible when authenticated -->
          <li v-if="authStore.isAuthenticated" class="mt-6">
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </div>
          </li>

          <li v-if="authStore.isAuthenticated">
            <router-link
              to="/admin"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
            >
              <i class="pi pi-cog mr-3"></i>
              Admin Dashboard
            </router-link>
          </li>

          <li v-if="authStore.isAuthenticated">
            <router-link
              to="/admin/components"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
            >
              <i class="pi pi-box mr-3"></i>
              Manage Components
            </router-link>
          </li>

          <li v-if="authStore.isAuthenticated">
            <router-link
              to="/admin/tokens"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
            >
              <i class="pi pi-palette mr-3"></i>
              Manage Tokens
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <div class="text-xs text-gray-500 text-center">
          OpenDS v0.2.0
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/app/stores/auth'

const authStore = useAuthStore()
</script>