<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-card">
      <div class="welcome-content">
        <h2 class="welcome-title">Welcome back, {{ authStore.user?.name }}! 👋</h2>
        <p class="welcome-subtitle">Here's what's happening with your design system today</p>
      </div>
      <div class="welcome-badge">
        <span class="badge-icon">👑</span>
        <span class="badge-text">{{ authStore.user?.role }}</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
              <i class="pi pi-box"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.components }}</p>
              <p class="stat-label">Components</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
              <i class="pi pi-palette"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.tokens }}</p>
              <p class="stat-label">Design Tokens</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <i class="pi pi-users"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.users }}</p>
              <p class="stat-label">Team Members</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
              <i class="pi pi-clock"></i>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.recentUpdates }}</p>
              <p class="stat-label">Recent Updates</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card class="quick-actions-card">
      <template #title>
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
          <p class="card-subtitle">Common tasks to get started</p>
        </div>
      </template>
      <template #content>
        <div class="quick-actions-grid">
          <button class="action-btn" @click="navigateTo('/admin/components')">
            <div class="action-icon">
              <i class="pi pi-plus-circle"></i>
            </div>
            <div class="action-info">
              <p class="action-title">Add Component</p>
              <p class="action-desc">Create a new UI component</p>
            </div>
          </button>

          <button class="action-btn" @click="navigateTo('/admin/tokens')">
            <div class="action-icon">
              <i class="pi pi-palette"></i>
            </div>
            <div class="action-info">
              <p class="action-title">Manage Tokens</p>
              <p class="action-desc">Edit design tokens</p>
            </div>
          </button>

          <button class="action-btn" @click="navigateTo('/admin/users')">
            <div class="action-icon">
              <i class="pi pi-user-plus"></i>
            </div>
            <div class="action-info">
              <p class="action-title">Invite User</p>
              <p class="action-desc">Add team members</p>
            </div>
          </button>

          <button class="action-btn" @click="navigateTo('/admin/settings')">
            <div class="action-icon">
              <i class="pi pi-cog"></i>
            </div>
            <div class="action-info">
              <p class="action-title">Settings</p>
              <p class="action-desc">Configure your system</p>
            </div>
          </button>
        </div>
      </template>
    </Card>

    <!-- Getting Started -->
    <Card class="getting-started-card">
      <template #title>
        <div class="card-header">
          <h3 class="card-title">🚀 Getting Started</h3>
          <p class="card-subtitle">Complete these steps to set up your design system</p>
        </div>
      </template>
      <template #content>
        <div class="checklist">
          <div class="checklist-item completed">
            <i class="pi pi-check-circle"></i>
            <div class="checklist-content">
              <p class="checklist-title">Create your admin account</p>
              <p class="checklist-desc">You're all set!</p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"></i>
            <div class="checklist-content">
              <p class="checklist-title">Add your first component</p>
              <p class="checklist-desc">Document your UI components</p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"></i>
            <div class="checklist-content">
              <p class="checklist-title">Define design tokens</p>
              <p class="checklist-desc">Set up colors, typography, and spacing</p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"></i>
            <div class="checklist-content">
              <p class="checklist-title">Invite your team</p>
              <p class="checklist-desc">Collaborate with designers and developers</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const authStore = useAuthStore()

const stats = ref({
  components: 0,
  tokens: 0,
  users: 1,
  recentUpdates: 0
})

onMounted(() => {
  // TODO: Fetch real stats from API
  console.log('Dashboard mounted for user:', authStore.user?.email)
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2.5rem;
  border-radius: 1.5rem;
  color: white;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  text-transform: capitalize;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.stat-label {
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

/* Quick Actions */
.quick-actions-card {
  margin-bottom: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.card-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.action-title {
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.action-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Getting Started */
.getting-started-card {
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: background 0.2s;
}

.checklist-item.completed {
  background: #f0fdf4;
}

.checklist-item.completed i {
  color: #10b981;
}

.checklist-item i {
  font-size: 1.5rem;
  color: #cbd5e1;
  margin-top: 0.125rem;
}

.checklist-title {
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.checklist-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

:deep(.p-card-title) {
  padding: 1.5rem 1.5rem 0 1.5rem;
}
</style>
