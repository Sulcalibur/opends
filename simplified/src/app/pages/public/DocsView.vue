<template>
  <div class="min-h-screen bg-gray-50">
    <main class="p-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12 border-b border-gray-200 pb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Documentation</h1>
          <p class="text-xl text-gray-600 leading-relaxed">
            Welcome to the OpenDS documentation. Here you'll find guides, API references, and everything you need to build with our system.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <router-link to="/docs/components" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer group block">
            <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <i class="pi pi-box text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Components</h3>
            <p class="text-gray-500 text-sm mb-4">Browse our library of reusable, accessible UI components with interactive playgrounds.</p>
            <span class="text-indigo-600 font-medium text-sm group-hover:underline">Explore Components &rarr;</span>
          </router-link>

          <router-link to="/docs/tokens" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-pink-300 transition-colors cursor-pointer group block">
            <div class="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mb-4 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
               <i class="pi pi-palette text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Design Tokens</h3>
            <p class="text-gray-500 text-sm mb-4">Explore colors, typography, spacing, and other core design decisions.</p>
             <span class="text-pink-600 font-medium text-sm group-hover:underline">View Tokens &rarr;</span>
          </router-link>

          <router-link to="/admin" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-300 transition-colors cursor-pointer group block">
            <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
               <i class="pi pi-cog text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Administration</h3>
            <p class="text-gray-500 text-sm mb-4">Manage components, tokens, and documentation settings.</p>
             <span class="text-green-600 font-medium text-sm group-hover:underline">Open Admin &rarr;</span>
          </router-link>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Guides</h2>
        <div class="space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-1">Getting Started</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Learn how to install the design system package, set up your theme provider, and start using components in your application.
              </p>
            </div>
            <Button label="Read" outlined size="small" />
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-1">Contribution Guide</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Guidelines for designing new components, naming tokens, and proposing changes to the system.
              </p>
            </div>
            <Button label="Read" outlined size="small" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
</script>