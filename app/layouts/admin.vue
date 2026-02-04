<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="admin-main">
      <header class="admin-header backdrop-blur">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <button
              class="mobile-menu-toggle lg:hidden"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <i class="pi pi-bars"/>
            </button>
          </div>
          <div class="header-right">
            <button
              class="theme-toggle hover-lift"
              title="Toggle theme"
              @click="
                $colorMode.preference =
                  $colorMode.value === 'dark' ? 'light' : 'dark'
              "
            >
              <i
                :class="`pi ${$colorMode.value === 'dark' ? 'pi-sun' : 'pi-moon'}`"
              />
            </button>
            <button class="header-action hover-lift" title="Notifications">
              <i class="pi pi-bell"/>
              <span class="badge">3</span>
            </button>
            <button class="header-action hover-lift" title="Help">
              <i class="pi pi-question-circle"/>
            </button>
          </div>
        </div>
      </header>

      <div class="page-content">
        <slot />
      </div>
    </main>

    <Teleport to="body">
      <Transition name="slide">
        <div
          v-if="isMobileMenuOpen"
          class="mobile-overlay"
          @click="isMobileMenuOpen = false"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const route = useRoute();

const isMobileMenuOpen = ref(false);

const pageTitle = computed(() => {
  const path = route.path;
  if (path === "/admin") return "Dashboard";
  if (path.includes("components")) return "Components";
  if (path.includes("tokens")) return "Design Tokens";
  if (path.includes("/admin/docs")) return "Documentation";
  if (path.includes("users")) return "Users";
  if (path.includes("settings")) return "Settings";
  if (path.includes("api-keys")) return "API Keys";
  if (path.includes("codegen")) return "Code Generator";
  return "Admin";
});

onMounted(() => {
  if (typeof window !== "undefined") {
    document.body.classList.add("admin-page");
  }
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-50);
  transition: background var(--transition-slow);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  margin-left: 280px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.is-collapsed) + .admin-main {
  margin-left: 80px;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all var(--transition-base);
}

.mobile-menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.mobile-menu-toggle:hover {
  border-color: var(--color-primary-300);
  background: var(--color-bg-200);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: var(--color-bg-200);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.theme-toggle:hover {
  border-color: var(--color-primary-300);
  background: var(--color-bg-300);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-toggle i {
  font-size: 1.25rem;
  transition: transform var(--transition-base);
}

.theme-toggle:hover i {
  transform: rotate(20deg);
}

.header-action {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: var(--color-bg-200);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.header-action:hover {
  border-color: var(--color-primary-300);
  background: var(--color-bg-300);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.header-action i {
  font-size: 1.125rem;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-error-500);
  color: white;
  font-size: 0.625rem;
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  animation: fade-in 0.5s var(--easing-out);
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 35;
  transition: opacity 0.3s;
}

.dark .admin-layout {
  background: var(--dark-color-bg-900);
}

.dark .admin-header {
  background: rgba(21, 22, 30, 0.9);
  border-bottom-color: var(--dark-color-border);
}

.dark .page-title {
  background: var(--dark-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .mobile-menu-toggle,
.dark .theme-toggle,
.dark .header-action {
  background: var(--dark-color-bg-200);
  border-color: var(--dark-color-border);
  color: var(--dark-color-text-primary);
}

.dark .mobile-menu-toggle:hover,
.dark .theme-toggle:hover,
.dark .header-action:hover {
  background: var(--dark-color-bg-100);
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-md), var(--dark-shadow-glow-sm);
}

.dark .badge {
  background: var(--color-error-400);
  border-color: var(--dark-color-bg-900);
}

.dark .page-content {
  background: var(--dark-color-bg);
}

@media (max-width: 1024px) {
  .admin-main {
    margin-left: 80px;
  }

  :deep(.is-collapsed) + .admin-main {
    margin-left: 80px;
  }
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }

  :deep(.is-collapsed) + .admin-main {
    margin-left: 0;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .header-content {
    padding: 1rem 1.5rem;
  }

  .page-content {
    padding: 1.5rem;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
