<template>
  <aside class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50">
    <!-- Logo Area -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <div class="flex items-center gap-2 text-indigo-600">
        <i class="pi pi-box text-xl"></i>
        <span class="font-bold text-lg tracking-tight text-gray-900">OpenDS</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      <router-link 
        to="/admin" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path === '/admin' ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-home" :class="[$route.path === '/admin' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
        Overview
      </router-link>

      <div class="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Design System
      </div>

       <router-link
         to="/admin/tokens"
         class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
         active-class="bg-indigo-50 text-indigo-700"
         :class="[$route.path === '/admin/tokens' ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
       >
         <i class="pi pi-palette" :class="[$route.path === '/admin/tokens' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
         Token Editor
       </router-link>

       <router-link
         to="/admin/components"
         class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
         active-class="bg-indigo-50 text-indigo-700"
         :class="[$route.path === '/admin/components' ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
       >
         <i class="pi pi-box" :class="[$route.path === '/admin/components' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
         Component Manager
       </router-link>

       <router-link
         to="/admin/codegen"
         class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
         active-class="bg-indigo-50 text-indigo-700"
         :class="[$route.path === '/admin/codegen' ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
       >
         <i class="pi pi-code" :class="[$route.path === '/admin/codegen' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
         Code Generator
       </router-link>

      <router-link 
        to="/components" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path.startsWith('/components') ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-box" :class="[$route.path.startsWith('/components') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
        Components
      </router-link>
      
      <router-link 
        to="/docs" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path.startsWith('/docs') ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-book" :class="[$route.path.startsWith('/docs') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
        Documentation
      </router-link>
    </nav>

    <!-- Project Info / User -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
          AD
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-medium text-gray-900 truncate">Admin User</p>
          <p class="text-xs text-gray-500 truncate">admin@opends.local</p>
        </div>
      </div>
      <button @click="logout" class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <i class="pi pi-sign-out"></i>
        Sign Out
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/app/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
