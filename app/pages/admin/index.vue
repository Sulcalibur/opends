<template>
  <div class="dashboard">
    <AnimatedCard variant="elevated" class="welcome-card">
      <template #default>
        <div class="welcome-content">
          <div class="welcome-text">
            <h2 class="welcome-title">
              Welcome back, {{ authStore.user?.name }}! 👋
            </h2>
            <p class="welcome-subtitle">
              Here's what's happening with your design system today
            </p>
          </div>
          <div class="welcome-badge">
            <span class="badge-icon">👑</span>
            <span class="badge-text">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </template>
    </AnimatedCard>

    <div class="stats-grid">
      <AnimatedCard variant="elevated" hover="lift" class="stat-card stagger-1">
        <template #default>
          <div class="stat-content">
            <div class="stat-icon blue">
              <i class="pi pi-box"/>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.components }}</p>
              <p class="stat-label">Components</p>
            </div>
          </div>
        </template>
      </AnimatedCard>

      <AnimatedCard variant="elevated" hover="lift" class="stat-card stagger-2">
        <template #default>
          <div class="stat-content">
            <div class="stat-icon purple">
              <i class="pi pi-palette"/>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.tokens }}</p>
              <p class="stat-label">Design Tokens</p>
            </div>
          </div>
        </template>
      </AnimatedCard>

      <AnimatedCard variant="elevated" hover="lift" class="stat-card stagger-3">
        <template #default>
          <div class="stat-content">
            <div class="stat-icon green">
              <i class="pi pi-users"/>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.users }}</p>
              <p class="stat-label">Team Members</p>
            </div>
          </div>
        </template>
      </AnimatedCard>

      <AnimatedCard variant="elevated" hover="lift" class="stat-card stagger-4">
        <template #default>
          <div class="stat-content">
            <div class="stat-icon gold">
              <i class="pi pi-clock"/>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stats.recentUpdates }}</p>
              <p class="stat-label">Recent Updates</p>
            </div>
          </div>
        </template>
      </AnimatedCard>
    </div>

    <AnimatedCard
      variant="elevated"
      class="quick-actions-card fade-up stagger-1"
    >
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <i class="pi pi-bolt"/>
          </div>
          <div>
            <h3 class="card-title">Quick Actions</h3>
            <p class="card-subtitle">Common tasks to get started</p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="quick-actions-grid">
          <button
            class="action-btn hover-lift"
            @click="navigateTo('/admin/components')"
          >
            <div class="action-icon blue">
              <i class="pi pi-plus-circle"/>
            </div>
            <div class="action-info">
              <p class="action-title">Add Component</p>
              <p class="action-desc">Create a new UI component</p>
            </div>
          </button>

          <button
            class="action-btn hover-lift"
            @click="navigateTo('/admin/tokens')"
          >
            <div class="action-icon purple">
              <i class="pi pi-palette"/>
            </div>
            <div class="action-info">
              <p class="action-title">Manage Tokens</p>
              <p class="action-desc">Edit design tokens</p>
            </div>
          </button>

          <button
            class="action-btn hover-lift"
            @click="navigateTo('/admin/users')"
          >
            <div class="action-icon green">
              <i class="pi pi-user-plus"/>
            </div>
            <div class="action-info">
              <p class="action-title">Invite User</p>
              <p class="action-desc">Add team members</p>
            </div>
          </button>

          <button
            class="action-btn hover-lift"
            @click="navigateTo('/admin/settings')"
          >
            <div class="action-icon gold">
              <i class="pi pi-cog"/>
            </div>
            <div class="action-info">
              <p class="action-title">Settings</p>
              <p class="action-desc">Configure your system</p>
            </div>
          </button>
        </div>
      </template>
    </AnimatedCard>

    <AnimatedCard
      variant="elevated"
      class="getting-started-card fade-up stagger-2"
    >
      <template #header>
        <div class="card-header">
          <div class="header-icon rocket">
            <i class="pi pi-rocket"/>
          </div>
          <div>
            <h3 class="card-title">🚀 Getting Started</h3>
            <p class="card-subtitle">
              Complete these steps to set up your design system
            </p>
          </div>
        </div>
      </template>
      <template #default>
        <div class="checklist">
          <div class="checklist-item completed">
            <i class="pi pi-check-circle"/>
            <div class="checklist-content">
              <p class="checklist-title">Create your admin account</p>
              <p class="checklist-desc">You're all set!</p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"/>
            <div class="checklist-content">
              <p class="checklist-title">Add your first component</p>
              <p class="checklist-desc">Document your UI components</p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"/>
            <div class="checklist-content">
              <p class="checklist-title">Define design tokens</p>
              <p class="checklist-desc">
                Set up colors, typography, and spacing
              </p>
            </div>
          </div>

          <div class="checklist-item">
            <i class="pi pi-circle"/>
            <div class="checklist-content">
              <p class="checklist-title">Invite your team</p>
              <p class="checklist-desc">
                Collaborate with designers and developers
              </p>
            </div>
          </div>
        </div>
      </template>
    </AnimatedCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const authStore = useAuthStore();

const stats = ref({
  components: 0,
  tokens: 0,
  users: 1,
  recentUpdates: 0,
});

onMounted(() => {
  console.log("Dashboard mounted for user:", authStore.user?.email);
});
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-card {
  background: linear-gradient(
    135deg,
    var(--color-primary-500) 0%,
    var(--color-secondary-500) 100%
  );
  border: none;
  box-shadow: 0 20px 60px rgba(219, 60, 36, 0.3);
  animation: fade-up 0.8s var(--easing-out);
}

.welcome-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  color: white;
  position: relative;
  z-index: 1;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.welcome-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.badge-icon {
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  animation: scale-in 0.6s var(--easing-bounce);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  transition: all var(--transition-slow);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.gold {
  background: linear-gradient(135deg, #e7bd18 0%, #d4a017 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: var(--font-weight-extrabold);
  margin: 0;
  color: var(--color-text-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  color: var(--color-text-secondary);
  margin: 0.5rem 0 0 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quick-actions-card,
.getting-started-card {
  animation: fade-up 1s var(--easing-out) 0.3s both;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: all var(--transition-base);
}

.header-icon.rocket {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-header:hover .header-icon {
  transform: scale(1.1) rotate(-5deg);
}

.card-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--color-text-primary);
}

.card-subtitle {
  color: var(--color-text-secondary);
  margin: 0.25rem 0 0 0;
  font-size: var(--font-size-sm);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-200);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-slow);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.action-btn:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.action-btn:hover::before {
  opacity: 0.05;
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: all var(--transition-slow);
}

.action-btn:hover .action-icon {
  transform: scale(1.1) rotate(-5deg);
}

.action-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.action-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.action-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.action-icon.gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.action-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
  font-size: var(--font-size-lg);
}

.action-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
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
  padding: 1.5rem;
  background: var(--color-bg-200);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
  transition: all var(--transition-slow);
  position: relative;
  overflow: hidden;
}

.checklist-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.checklist-item:hover {
  transform: translateX(8px);
  border-color: var(--color-primary-300);
}

.checklist-item:hover::before {
  opacity: 0.03;
}

.checklist-item.completed {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.checklist-item.completed::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.checklist-item.completed:hover {
  border-color: #10b981;
}

.checklist-item i {
  font-size: 1.5rem;
  color: var(--color-text-300);
  margin-top: 0.125rem;
  flex-shrink: 0;
  transition: color var(--transition-base);
}

.checklist-item.completed i {
  color: #10b981;
}

.checklist-item:hover i {
  color: var(--color-primary-500);
}

.checklist-item.completed:hover i {
  color: #059669;
}

.checklist-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.checklist-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
  font-size: var(--font-size-lg);
}

.checklist-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.dark .welcome-card {
  background: linear-gradient(
    135deg,
    var(--color-primary-400) 0%,
    var(--color-secondary-400) 100%
  );
  box-shadow: 0 20px 60px rgba(234, 138, 123, 0.3);
}

.dark .stat-value {
  background: var(--dark-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .card-title {
  color: var(--dark-color-text-primary);
}

.dark .card-subtitle,
.dark .action-desc,
.dark .checklist-desc,
.dark .stat-label {
  color: var(--dark-color-text-secondary);
}

.dark .action-btn {
  background: var(--dark-color-bg-200);
  border-color: var(--dark-color-border);
}

.dark .action-btn:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-lg), var(--dark-shadow-glow-sm);
}

.dark .checklist-item {
  background: var(--dark-color-bg-200);
  border-color: var(--dark-color-border);
}

.dark .checklist-item.completed {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

.dark .checklist-item i {
  color: var(--dark-color-text-300);
}

.dark .checklist-item:hover i {
  color: var(--color-primary-400);
}

.dark .checklist-item.completed:hover i {
  color: #10b981;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.75rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .welcome-content {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-badge {
    align-self: center;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
