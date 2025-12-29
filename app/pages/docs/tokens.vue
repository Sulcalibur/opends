<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DocsSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Design Tokens</h1>
          <p class="text-gray-600">Core design decisions including colors, typography, spacing, and other foundational elements.</p>
        </div>

        <!-- Token Categories -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <i class="pi pi-palette text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Colors</h3>
            <p class="text-gray-500 text-sm">Primary, secondary, and semantic color tokens.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600">
              <i class="pi pi-font text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Typography</h3>
            <p class="text-gray-500 text-sm">Font families, sizes, weights, and line heights.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-purple-600">
              <i class="pi pi-arrows-h text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Spacing</h3>
            <p class="text-gray-500 text-sm">Consistent spacing scales and measurements.</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <ProgressSpinner />
          <p class="mt-4 text-gray-600">Loading design tokens...</p>
        </div>

        <!-- Tokens Display -->
        <div v-else class="space-y-8">
          <!-- Color Tokens -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Color Tokens</h2>

            <div v-if="colorTokens.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div
                v-for="token in colorTokens"
                :key="token.key"
                class="text-center"
              >
                <div
                  class="w-16 h-16 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                  :style="{ backgroundColor: token.value }"
                ></div>
                <div class="text-xs font-mono text-gray-600">{{ token.key }}</div>
                <div class="text-xs text-gray-500">{{ token.value }}</div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              No color tokens found. <NuxtLink to="/admin/tokens" class="text-indigo-600 hover:underline">Add some in the admin panel</NuxtLink>.
            </div>
          </div>

          <!-- Typography Tokens -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Typography Tokens</h2>

            <div v-if="typographyTokens.length > 0" class="space-y-4">
              <div
                v-for="token in typographyTokens"
                :key="token.key"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-center mb-2">
                  <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ token.key }}</code>
                  <Badge :value="token.category" severity="info" />
                </div>
                <div :style="getTypographyStyle(token)" class="mb-2">
                  The quick brown fox jumps over the lazy dog
                </div>
                <div class="text-sm text-gray-600">
                  {{ token.value }}
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              No typography tokens found.
            </div>
          </div>

          <!-- Spacing Tokens -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Spacing Tokens</h2>

            <div v-if="spacingTokens.length > 0" class="space-y-4">
              <div
                v-for="token in spacingTokens"
                :key="token.key"
                class="flex items-center gap-4"
              >
                <code class="text-sm bg-gray-100 px-2 py-1 rounded min-w-[100px]">{{ token.key }}</code>
                <div
                  class="bg-indigo-100 border border-indigo-200 rounded"
                  :style="{ width: token.value, height: '24px' }"
                ></div>
                <span class="text-sm text-gray-600">{{ token.value }}</span>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              No spacing tokens found.
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DocsSidebar from '../../components/DocsSidebar.vue'

interface Token {
  key: string
  value: string
  category?: string
  type?: string
  description?: string
}

const tokens = ref<Token[]>([])
const loading = ref(true)

const colorTokens = computed(() =>
  tokens.value.filter(token => token.category === 'color' || token.key.includes('color'))
)

const typographyTokens = computed(() =>
  tokens.value.filter(token => token.category === 'typography' || ['font', 'text', 'line'].some(k => token.key.includes(k)))
)

const spacingTokens = computed(() =>
  tokens.value.filter(token => token.category === 'spacing' || token.key.includes('space'))
)

onMounted(async () => {
  await loadTokens()
})

async function loadTokens() {
  try {
    // Try API first
    try {
      const response = await fetch('/api/tokens')
      if (response.ok) {
        const data = await response.json()
        tokens.value = data.tokens || []
        return
      }
    } catch (apiError) {
      console.log('API not available, using mock data')
    }

    // Comprehensive mock data for testing
    tokens.value = [
      // Colors
      { key: '--color-primary', value: '#3b82f6', category: 'color', description: 'Primary brand color' },
      { key: '--color-primary-hover', value: '#2563eb', category: 'color', description: 'Primary hover state' },
      { key: '--color-secondary', value: '#6b7280', category: 'color', description: 'Secondary color' },
      { key: '--color-success', value: '#10b981', category: 'color', description: 'Success state color' },
      { key: '--color-warning', value: '#f59e0b', category: 'color', description: 'Warning state color' },
      { key: '--color-danger', value: '#ef4444', category: 'color', description: 'Error/danger color' },

      // Typography
      { key: '--font-family', value: 'Inter, system-ui, sans-serif', category: 'typography', description: 'Primary font family' },
      { key: '--font-size-xs', value: '0.75rem', category: 'typography', description: 'Extra small text' },
      { key: '--font-size-sm', value: '0.875rem', category: 'typography', description: 'Small text' },
      { key: '--font-size-base', value: '1rem', category: 'typography', description: 'Base text size' },
      { key: '--font-size-lg', value: '1.125rem', category: 'typography', description: 'Large text' },
      { key: '--font-size-xl', value: '1.25rem', category: 'typography', description: 'Extra large text' },
      { key: '--font-weight-normal', value: '400', category: 'typography', description: 'Normal font weight' },
      { key: '--font-weight-medium', value: '500', category: 'typography', description: 'Medium font weight' },
      { key: '--font-weight-semibold', value: '600', category: 'typography', description: 'Semibold font weight' },
      { key: '--font-weight-bold', value: '700', category: 'typography', description: 'Bold font weight' },
      { key: '--line-height-tight', value: '1.25', category: 'typography', description: 'Tight line height' },
      { key: '--line-height-normal', value: '1.5', category: 'typography', description: 'Normal line height' },
      { key: '--line-height-relaxed', value: '1.75', category: 'typography', description: 'Relaxed line height' },

      // Spacing
      { key: '--space-1', value: '0.25rem', category: 'spacing', description: 'Extra small space (4px)' },
      { key: '--space-2', value: '0.5rem', category: 'spacing', description: 'Small space (8px)' },
      { key: '--space-3', value: '0.75rem', category: 'spacing', description: 'Medium small space (12px)' },
      { key: '--space-4', value: '1rem', category: 'spacing', description: 'Medium space (16px)' },
      { key: '--space-6', value: '1.5rem', category: 'spacing', description: 'Large space (24px)' },
      { key: '--space-8', value: '2rem', category: 'spacing', description: 'Extra large space (32px)' },
      { key: '--space-12', value: '3rem', category: 'spacing', description: '2XL space (48px)' },
      { key: '--space-16', value: '4rem', category: 'spacing', description: '3XL space (64px)' },

      // Borders
      { key: '--border-radius-sm', value: '0.25rem', category: 'border', description: 'Small border radius' },
      { key: '--border-radius-md', value: '0.375rem', category: 'border', description: 'Medium border radius' },
      { key: '--border-radius-lg', value: '0.5rem', category: 'border', description: 'Large border radius' },
      { key: '--border-radius-xl', value: '0.75rem', category: 'border', description: 'Extra large border radius' },

      // Shadows
      { key: '--shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', category: 'shadow', description: 'Small shadow' },
      { key: '--shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', category: 'shadow', description: 'Medium shadow' },
      { key: '--shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', category: 'shadow', description: 'Large shadow' },
      { key: '--shadow-xl', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', category: 'shadow', description: 'Extra large shadow' }
    ]

  } catch (error) {
    console.error('Failed to load tokens:', error)
    // Minimal fallback data
    tokens.value = [
      { key: '--color-primary', value: '#3b82f6', category: 'color' },
      { key: '--font-family', value: 'Inter, sans-serif', category: 'typography' }
    ]
  } finally {
    loading.value = false
  }
}

function getTypographyStyle(token: Token) {
  if (token.key.includes('font-family')) {
    return { fontFamily: token.value }
  } else if (token.key.includes('font-size')) {
    return { fontSize: token.value }
  } else if (token.key.includes('font-weight')) {
    return { fontWeight: token.value }
  } else if (token.key.includes('line-height')) {
    return { lineHeight: token.value }
  }
  return {}
}
</script>