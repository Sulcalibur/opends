<template>
  <aside class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50">
    <!-- Logo Area -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <router-link to="/" class="flex items-center gap-2 text-indigo-600 no-underline">
        <i class="pi pi-box text-xl"/>
        <span class="font-bold text-lg tracking-tight text-gray-900">OpenDS</span>
      </router-link>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      <div class="pt-2 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Guide
      </div>
      
      <router-link 
        to="/docs" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path === '/docs' ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-book" :class="[$route.path === '/docs' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"/>
        Documentation
      </router-link>

      <div class="pt-6 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Foundation
      </div>

      <router-link 
        to="/tokens" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path.startsWith('/tokens') ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-palette" :class="[$route.path.startsWith('/tokens') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"/>
        Design Tokens
      </router-link>

      <div class="pt-6 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Library
      </div>

      <router-link 
        to="/components" 
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        active-class="bg-indigo-50 text-indigo-700"
        :class="[$route.path.startsWith('/components') ? '' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-box" :class="[$route.path.startsWith('/components') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"/>
        Components
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <router-link to="/admin" class="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors">
        <i class="pi pi-lock"/>
        <span>Admin Access</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Simple sidebar for public viewer
</script>
