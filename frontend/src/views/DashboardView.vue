<template>
  <div class="dashboard-view p-4">
    <div class="dashboard-header mb-6">
      <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
      <p class="text-color-secondary">
        Welcome to your design system management dashboard
      </p>
    </div>

    <div class="dashboard-stats mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Design Files Card -->
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-file text-primary"></i>
              <span>Design Files</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">
                {{ stats.designFiles }}
              </div>
              <div class="text-color-secondary">
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
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-box text-primary"></i>
              <span>Components</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">
                {{ stats.components }}
              </div>
              <div class="text-color-secondary">
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
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-palette text-primary"></i>
              <span>Design Tokens</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">
                {{ stats.designTokens }}
              </div>
              <div class="text-color-secondary">
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
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-sync text-primary"></i>
              <span>Recent Syncs</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">
                {{ stats.recentSyncs }}
              </div>
              <div class="text-color-secondary">
                Last 24 hours
              </div>
            </div>
          </template>
          <template #footer>
            <div class="text-sm text-color-secondary">
              Last sync: {{ lastSyncFormatted }}
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="dashboard-actions mb-6">
      <Card>
        <template #title>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-bolt text-primary"></i>
            <span>Quick Actions</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-column md:flex-row gap-3">
            <Button 
              label="Add Design File" 
              icon="pi pi-plus" 
              severity="primary"
              @click="$router.push('/design-files')"
              class="flex-1"
            />
            <Button 
              label="Generate Code" 
              icon="pi pi-code" 
              severity="secondary"
              @click="$router.push('/codegen')"
              class="flex-1"
            />
            <Button 
              label="View Documentation" 
              icon="pi pi-book" 
              severity="help"
              @click="openDocs"
              class="flex-1"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div class="dashboard-activity">
      <Card>
        <template #title>
          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-history text-primary"></i>
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
          <div v-if="loading" class="text-center py-4">
            <ProgressSpinner />
          </div>
          <div v-else-if="recentActivity.length === 0" class="text-center py-4 text-color-secondary">
            <i class="pi pi-inbox text-3xl mb-3"></i>
            <p>No recent activity</p>
          </div>
          <div v-else class="flex flex-column gap-3">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="activity-item flex align-items-center gap-3 p-3 border-round surface-border border-1 hover:surface-hover transition-all transition-duration-200"
            >
              <div class="activity-icon">
                <i :class="[activity.icon, activity.iconColor]" class="text-xl"></i>
              </div>
              <div class="activity-content flex-1">
                <div class="font-medium">
                  {{ activity.title }}
                </div>
                <div class="text-sm text-color-secondary">
                  {{ activity.description }}
                </div>
              </div>
              <div class="activity-time text-sm text-color-secondary">
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