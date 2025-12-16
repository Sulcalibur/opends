<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Dashboard</h1>
      <p class="text-surface-600 dark:text-surface-400 mt-2">
        Welcome to your design system management dashboard
      </p>
    </div>

    <div class="dashboard-stats mt-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Design Files Card -->
        <Card class="shadow-sm hover:shadow-md transition-shadow duration-200">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-file text-primary-500 text-xl"></i>
              <span>Design Files</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-4xl font-bold text-surface-900 dark:text-surface-50">
                {{ stats.designFiles }}
              </div>
              <div class="text-surface-600 dark:text-surface-400 mt-2">
                Connected design files
              </div>
            </div>
          </template>
          <template #footer>
            <Button 
              label="Manage Files" 
              icon="pi pi-arrow-right" 
              severity="secondary"
              @click="$router.push('/design-files')"
              class="w-full"
            />
          </template>
        </Card>

        <!-- Components Card -->
        <Card class="shadow-sm hover:shadow-md transition-shadow duration-200">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-box text-primary-500 text-xl"></i>
              <span>Components</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-4xl font-bold text-surface-900 dark:text-surface-50">
                {{ stats.components }}
              </div>
              <div class="text-surface-600 dark:text-surface-400 mt-2">
                Design system components
              </div>
            </div>
          </template>
          <template #footer>
            <Button 
              label="Explore Components" 
              icon="pi pi-arrow-right" 
              severity="secondary"
              @click="$router.push('/components')"
              class="w-full"
            />
          </template>
        </Card>

        <!-- Design Tokens Card -->
        <Card class="shadow-sm hover:shadow-md transition-shadow duration-200">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-palette text-primary-500 text-xl"></i>
              <span>Design Tokens</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-4xl font-bold text-surface-900 dark:text-surface-50">
                {{ stats.designTokens }}
              </div>
              <div class="text-surface-600 dark:text-surface-400 mt-2">
                Color, spacing, typography tokens
              </div>
            </div>
          </template>
          <template #footer>
            <Button 
              label="Manage Tokens" 
              icon="pi pi-arrow-right" 
              severity="secondary"
              @click="$router.push('/tokens')"
              class="w-full"
            />
          </template>
        </Card>

        <!-- Recent Syncs Card -->
        <Card class="shadow-sm hover:shadow-md transition-shadow duration-200">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-sync text-primary-500 text-xl"></i>
              <span>Recent Syncs</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-4xl font-bold text-surface-900 dark:text-surface-50">
                {{ stats.recentSyncs }}
              </div>
              <div class="text-surface-600 dark:text-surface-400 mt-2">
                Last 24 hours
              </div>
            </div>
          </template>
          <template #footer>
            <div class="text-sm text-surface-500 dark:text-surface-400">
              Last sync: {{ lastSyncFormatted }}
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="dashboard-actions mt-8">
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-bolt text-primary-500"></i>
            <span>Quick Actions</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              label="Add Design File" 
              icon="pi pi-plus" 
              severity="primary"
              @click="$router.push('/design-files')"
              class="w-full"
            />
            <Button 
              label="Generate Code" 
              icon="pi pi-code" 
              severity="secondary"
              @click="$router.push('/codegen')"
              class="w-full"
            />
            <Button 
              label="View Documentation" 
              icon="pi pi-book" 
              severity="help"
              @click="openDocs"
              class="w-full"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div class="dashboard-activity mt-8">
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="pi pi-history text-primary-500"></i>
              <span>Recent Activity</span>
            </div>
            <Button 
              label="View All" 
              severity="secondary" 
              text
              size="small"
            />
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="text-center py-8">
            <ProgressSpinner />
          </div>
          <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-surface-500 dark:text-surface-400">
            <i class="pi pi-inbox text-4xl mb-4"></i>
            <p>No recent activity</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="activity-item flex items-center gap-4 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              <div class="activity-icon">
                <i :class="[activity.icon, activity.iconColor]" class="text-xl"></i>
              </div>
              <div class="activity-content flex-1">
                <div class="font-medium text-surface-900 dark:text-surface-50">
                  {{ activity.title }}
                </div>
                <div class="text-sm text-surface-600 dark:text-surface-400">
                  {{ activity.description }}
                </div>
              </div>
              <div class="activity-time text-sm text-surface-500 dark:text-surface-400">
                {{ activity.time }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { apiClient, type DashboardStats } from '../api/client'



const loading = ref(true)
const stats = ref<DashboardStats>({
  designFiles: 0,
  components: 0,
  designTokens: 0,
  recentSyncs: 0,
  lastSync: undefined
})

const recentActivity = ref<Array<{
  id: string
  icon: string
  iconColor: string
  title: string
  description: string
  time: string
}>>([])

const lastSyncFormatted = computed(() => {
  if (!stats.value.lastSync) {
    return 'Never'
  }
  
  const date = new Date(stats.value.lastSync)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
})

function openDocs() {
  window.open('https://opends.dev/docs', '_blank')
}

async function loadDashboardData() {
  try {
    loading.value = true
    
    // Load stats
    stats.value = await apiClient.getDashboardStats()
    
    // Load recent activity (mock data for now)
    recentActivity.value = [
      {
        id: '1',
        icon: 'pi pi-file-plus',
        iconColor: 'text-green-500',
        title: 'Design file added',
        description: 'Added "Button Components.penpot"',
        time: '2 hours ago'
      },
      {
        id: '2',
        icon: 'pi pi-sync',
        iconColor: 'text-blue-500',
        title: 'Sync completed',
        description: 'Synced 15 components from design file',
        time: '1 day ago'
      },
      {
        id: '3',
        icon: 'pi pi-code',
        iconColor: 'text-purple-500',
        title: 'Code generated',
        description: 'Generated React components for Button',
        time: '2 days ago'
      }
    ]
    
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-view {
  @apply p-6;
}

.dashboard-header {
  @apply mb-8;
}

.activity-item {
  @apply transition-all duration-200;
}

.activity-item:hover {
  @apply transform -translate-y-0.5;
}
</style>