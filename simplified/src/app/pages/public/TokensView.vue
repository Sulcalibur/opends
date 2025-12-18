<template>
  <div class="tokens-view">
    <div class="container">
      <h1>Design Tokens</h1>
      <p class="text-color-secondary mb-6">
        Design tokens are the visual design atoms of the design system.
      </p>
      
       <div class="mb-6">
        <TabView v-model:activeIndex="activeTab">
           <TabPanel header="Colors" value="colors">
            <div class="grid mt-4">
              <div 
                v-for="token in colorTokens" 
                :key="token.name"
                class="col-12 md:col-6 lg:col-4"
              >
                <Card class="token-card">
                  <template #content>
                    <div class="flex flex-column gap-3">
                      <div 
                        class="color-preview" 
                        :style="{ backgroundColor: token.value }"
                      ></div>
                      <div>
                        <div class="font-medium">{{ token.name }}</div>
                        <div class="text-sm text-color-secondary">{{ token.value }}</div>
                        <div v-if="token.description" class="text-sm mt-1">
                          {{ token.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </TabPanel>
          
           <TabPanel header="Typography" value="typography">
            <div class="grid mt-4">
              <div 
                v-for="token in typographyTokens" 
                :key="token.name"
                class="col-12 md:col-6"
              >
                <Card class="token-card">
                  <template #content>
                    <div class="flex flex-column gap-3">
                      <div :style="getTypographyStyle(token.value)">
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div>
                        <div class="font-medium">{{ token.name }}</div>
                        <div class="text-sm text-color-secondary">
                          {{ token.value.fontFamily }}, {{ token.value.fontSize }}, {{ token.value.fontWeight }}
                        </div>
                        <div v-if="token.description" class="text-sm mt-1">
                          {{ token.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </TabPanel>
          
           <TabPanel header="Spacing & Radius" value="spacing">
            <div class="grid mt-4">
              <div class="col-12 md:col-6">
                <h3 class="mb-4">Spacing</h3>
                <div class="flex flex-column gap-4">
                  <div 
                    v-for="token in spacingTokens" 
                    :key="token.name"
                    class="spacing-token"
                  >
                    <div class="flex align-items-center justify-content-between mb-2">
                      <span class="font-medium">{{ token.name }}</span>
                      <span class="text-sm text-color-secondary">{{ token.value }}</span>
                    </div>
                    <div class="spacing-visual" :style="{ height: token.value }">
                      <div class="spacing-label">{{ token.value }}</div>
                    </div>
                    <div v-if="token.description" class="text-sm text-color-secondary mt-1">
                      {{ token.description }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <h3 class="mb-4">Border Radius</h3>
                <div class="flex flex-column gap-4">
                  <div 
                    v-for="token in radiusTokens" 
                    :key="token.name"
                    class="radius-token"
                  >
                    <div class="flex align-items-center justify-content-between mb-2">
                      <span class="font-medium">{{ token.name }}</span>
                      <span class="text-sm text-color-secondary">{{ token.value }}</span>
                    </div>
                    <div 
                      class="radius-visual" 
                      :style="{ borderRadius: token.value }"
                    ></div>
                    <div v-if="token.description" class="text-sm text-color-secondary mt-1">
                      {{ token.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
      
      <Card class="mt-6">
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            <span>About Design Tokens</span>
          </div>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h4 class="mb-2">What are design tokens?</h4>
              <p class="text-color-secondary">
                Design tokens are the visual design atoms of the design system — 
                specifically, they are named entities that store visual design attributes. 
                They are used in place of hard-coded values to ensure consistency 
                and enable theming across platforms.
              </p>
            </div>
            <div class="col-12 md:col-6">
              <h4 class="mb-2">Usage</h4>
              <p class="text-color-secondary">
                Tokens should be referenced in CSS, design files, and code generation. 
                When a token value changes, it updates everywhere it's used, 
                maintaining visual consistency across your entire product.
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import designSystemStorage from '@/design-system/storage'

const activeTab = ref(0)

// Get tokens from storage
const tokens = designSystemStorage.getTokens()

// Filter tokens by type
const colorTokens = computed(() => 
  tokens.filter(t => t.type === 'color')
)

const typographyTokens = computed(() => 
  tokens.filter(t => t.type === 'typography')
)

const spacingTokens = computed(() => 
  tokens.filter(t => t.type === 'spacing')
)

const radiusTokens = computed(() => 
  tokens.filter(t => t.type === 'radius')
)

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
.tokens-view {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.token-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.token-card:hover {
  transform: translateY(-2px);
}

.color-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  border: 1px solid var(--surface-300);
}

.spacing-token {
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
  border: 1px solid var(--surface-200);
}

.spacing-visual {
  background: var(--primary-100);
  border-radius: 4px;
  position: relative;
  border: 1px solid var(--primary-200);
}

.spacing-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.radius-token {
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
  border: 1px solid var(--surface-200);
}

.radius-visual {
  width: 100%;
  height: 60px;
  background: var(--primary-100);
  border: 1px solid var(--primary-200);
}
</style>