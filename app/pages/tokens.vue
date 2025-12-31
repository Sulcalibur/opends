<template>
  <div class="tokens-page">
    <div class="container mx-auto max-w-7xl px-6 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">Design Tokens</h1>
        <p class="text-xl text-slate-600 max-w-3xl">
          Design tokens are the visual design atoms of the design system. They store design decisions like colors, typography, and spacing.
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="tokens.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-palette text-3xl text-slate-400"></i>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">No Tokens Yet</h3>
          <p class="text-slate-600 mb-6">
            Get started by creating your first design token in the admin panel.
          </p>
          <NuxtLink to="/admin/tokens" class="theme-btn-primary inline-flex items-center">
            <i class="pi pi-plus mr-2"></i>
            Create Your First Token
          </NuxtLink>
        </div>
      </div>

      <!-- Token Content -->
      <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <!-- Stats Bar -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div class="flex gap-6">
            <div>
              <div class="text-sm text-slate-500">Total Tokens</div>
              <div class="text-2xl font-bold text-slate-900">{{ tokens.length }}</div>
            </div>
            <div>
              <div class="text-sm text-slate-500">Colors</div>
              <div class="text-2xl font-bold text-slate-900">{{ colorTokens.length }}</div>
            </div>
            <div>
              <div class="text-sm text-slate-500">Typography</div>
              <div class="text-2xl font-bold text-slate-900">{{ typographyTokens.length }}</div>
            </div>
            <div>
              <div class="text-sm text-slate-500">Spacing</div>
              <div class="text-2xl font-bold text-slate-900">{{ spacingTokens.length }}</div>
            </div>
          </div>
          <Button
            @click="downloadTokens"
            icon="pi pi-download"
            label="Export JSON"
            class="p-button-outlined"
          />
        </div>

        <!-- Tabs -->
        <TabView>
          <!-- Colors Tab -->
          <TabPanel header="Colors">
            <div v-if="colorTokens.length === 0" class="p-12 text-center">
              <p class="text-slate-500">No color tokens defined yet.</p>
            </div>
            <div v-else class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="token in colorTokens" 
                :key="token.name"
                class="group relative"
              >
                <div class="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div 
                    class="w-full h-20 rounded-lg shadow-inner mb-3" 
                    :style="{ backgroundColor: token.value }"
                  ></div>
                  <div class="font-semibold text-sm text-slate-900 mb-1" :title="token.name">{{ token.name }}</div>
                  <div class="text-xs font-mono text-slate-500 uppercase">{{ token.value }}</div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <!-- Typography Tab -->
          <TabPanel header="Typography">
            <div v-if="typographyTokens.length === 0" class="p-12 text-center">
              <p class="text-slate-500">No typography tokens defined yet.</p>
            </div>
            <div v-else class="p-6 space-y-6">
              <div v-for="token in typographyTokens" :key="token.name" class="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div class="text-sm font-bold text-slate-900 mb-2">{{ token.name }}</div>
                    <div class="text-xs text-slate-500 space-y-1 font-mono">
                      <div>Family: {{ token.value.fontFamily }}</div>
                      <div>Size: {{ token.value.fontSize }}</div>
                      <div>Weight: {{ token.value.fontWeight }}</div>
                      <div>Line: {{ token.value.lineHeight }}</div>
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <div :style="getTypographyStyle(token.value)" class="text-slate-900">
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          
          <!-- Spacing Tab -->
          <TabPanel header="Spacing">
            <div v-if="spacingTokens.length === 0" class="p-12 text-center">
              <p class="text-slate-500">No spacing tokens defined yet.</p>
            </div>
            <div v-else class="p-6">
              <div class="space-y-4 max-w-3xl mx-auto">
                <div 
                  v-for="token in spacingTokens" 
                  :key="token.name"
                  class="flex items-center gap-4"
                >
                  <div class="w-32 text-sm font-mono text-slate-500 text-right">{{ token.name }}</div>
                  <div class="flex-1 flex items-center gap-3">
                    <div class="h-8 rounded" :style="{ width: token.value, backgroundColor: 'var(--primary-color)' }"></div>
                    <span class="text-sm font-mono text-slate-700">{{ token.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import designSystemStorage from '../../src/design-system/storage'

const tokens = designSystemStorage.getTokens()

const colorTokens = computed(() => tokens.filter(t => t.type === 'color'))
const typographyTokens = computed(() => tokens.filter(t => t.type === 'typography'))
const spacingTokens = computed(() => tokens.filter(t => t.type === 'spacing'))

function getTypographyStyle(value: any) {
  return {
    fontFamily: value.fontFamily,
    fontSize: value.fontSize,
    fontWeight: value.fontWeight,
    lineHeight: value.lineHeight
  }
}

function downloadTokens() {
  const exportData: any = {
    "$themes": [],
    "$metadata": {
      "tokenSetOrder": ["OpenDS Tokens"],
      "activeThemes": [],
      "activeSets": ["OpenDS Tokens"]
    }
  }

  const tokenSets: any = {
    "OpenDS Tokens": {}
  }

  tokens.forEach(token => {
    let cleanName = token.name
      .replace(/\//g, '.')
      .replace(/\s+/g, '.')
      .replace(/[^a-zA-Z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.+|\.+$/g, '')

    if (cleanName.startsWith('$')) {
      cleanName = cleanName.substring(1)
    }

    if (!cleanName) {
      cleanName = `token_${Math.random().toString(36).substr(2, 9)}`
    }

    tokenSets["OpenDS Tokens"][cleanName] = {
      "$value": token.value,
      "$type": token.type,
      "$description": token.description || ""
    }
  })

  const finalExport = {
    ...tokenSets,
    ...exportData
  }

  const dataStr = JSON.stringify(finalExport, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = `opends-tokens-${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

useHead({
  title: 'Design Tokens',
  meta: [
    { name: 'description', content: 'Browse design tokens for OpenDS Design System' }
  ]
})
</script>

<style scoped>
.tokens-page {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>