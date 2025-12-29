<script setup lang="ts">
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50">
    <!-- Logo Area -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <NuxtLink to="/" class="flex items-center gap-2 text-indigo-600 no-underline">
        <i class="pi pi-box text-xl"></i>
        <span class="font-bold text-lg tracking-tight text-gray-900">OpenDS</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      <NuxtLink
        to="/docs"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        :class="[$route.path === '/docs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-book" :class="[$route.path === '/docs' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
        Documentation
      </NuxtLink>

      <NuxtLink
        to="/docs/components"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group"
        :class="[$route.path.startsWith('/docs/components') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
      >
        <i class="pi pi-box" :class="[$route.path.startsWith('/docs/components') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500']"></i>
        Components
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <NuxtLink to="/admin" class="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors">
        <i class="pi pi-lock"></i>
        <span>Admin Access</span>
      </NuxtLink>
    </div>
  </aside>
</template>
