<template>
  <div class="min-h-screen bg-gray-50 flex">
    <ViewerSidebar />

    <main class="flex-1 ml-64 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Design Tokens</h1>
          <p class="text-gray-600">The core visual atoms of the system.</p>
        </div>
        
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <TabView class="p-tabview-clean">
            <!-- Colors -->
            <TabPanel header="Colors" value="colors">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  v-for="token in colorTokens" 
                  :key="token.name"
                  class="group"
                >
                  <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                    <div 
                      class="w-10 h-10 rounded-full shadow-inner border border-black/5" 
                      :style="{ backgroundColor: token.value }"
                    ></div>
                    <div class="overflow-hidden">
                      <div class="font-bold text-sm text-gray-900 truncate" :title="token.name">{{ token.name }}</div>
                      <div class="text-xs font-mono text-gray-500 uppercase">{{ token.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <!-- Typography -->
            <TabPanel header="Typography" value="typography">
              <div class="p-6 space-y-8">
                <div v-for="token in typographyTokens" :key="token.name" class="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div class="flex flex-col md:flex-row gap-6">
                     <div class="w-48 pt-1">
                       <span class="text-sm font-bold text-gray-900">{{ token.name }}</span>
                       <div class="text-xs text-gray-500 mt-1 space-y-0.5 font-mono">
                         <div>{{ token.value.fontFamily }}</div>
                         <div>{{ token.value.fontSize }} / {{ token.value.lineHeight }}</div>
                         <div>{{ token.value.fontWeight }}</div>
                       </div>
                     </div>
                     <div class="flex-1">
                       <div :style="getTypographyStyle(token.value)" class="text-gray-900">
                         The quick brown fox jumps over the lazy dog.
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <!-- Spacing -->
            <TabPanel header="Spacing" value="spacing">
              <div class="p-6">
                <div class="space-y-4 max-w-2xl">
                  <div 
                    v-for="token in spacingTokens" 
                    :key="token.name"
                    class="flex items-center gap-4"
                  >
                    <div class="w-24 text-sm font-mono text-gray-500 text-right">{{ token.name }}</div>
                    <div class="flex-1 flex items-center gap-3">
                      <div class="h-6 bg-indigo-500 rounded" :style="{ width: token.value }"></div>
                      <span class="text-xs font-mono text-indigo-700">{{ token.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import designSystemStorage from '@/design-system/storage'
import ViewerSidebar from '@/app/components/ViewerSidebar.vue'

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
</script>

<style scoped>
:deep(.p-tabview-clean .p-tabview-nav) {
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

:deep(.p-tabview-clean .p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid transparent;
}

:deep(.p-tabview-clean .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

:deep(.p-tabview-clean .p-tabview-panels) {
  padding: 0;
}
</style>