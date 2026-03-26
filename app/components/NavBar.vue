<script setup lang="ts">
import { computed, ref } from "vue";
import { useSearchShortcut } from "../composables/useKeyboardShortcut";
import SearchDropdown from "./search/SearchDropdown.vue";

const router = useRouter();
const { data: settingsData } = await useFetch("/api/settings/public").catch(
  () => ({ data: ref(null) }),
);
const settings = computed(() => settingsData.value?.settings || {});
const colorMode = useColorMode();

const orgName = computed(() => settings.value?.organization_name || "OpenDS");
const orgInitial = computed(() => orgName.value.substring(0, 2).toUpperCase());

const links = [
  { name: "Docs", path: "/docs" },
  { name: "Components", path: "/docs/components" },
  { name: "Tokens", path: "/tokens" },
];

// Search state
const isSearchOpen = ref(false);

// Register Cmd+K shortcut
useSearchShortcut(() => {
  isSearchOpen.value = true;
});

function handleLogout() {
  router.push("/login");
}
</script>

<template>
  <nav class="navbar backdrop-blur">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <NuxtLink to="/" class="no-underline logo-link">
        <Logo :text="orgName" />
      </NuxtLink>

      <div class="hidden md:flex items-center gap-2 nav-links">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link hover-lift"
        >
          <span class="link-text">{{ link.name }}</span>
          <span class="link-indicator" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Button -->
        <button
          data-test="search-button"
          class="search-trigger hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="isSearchOpen = true"
        >
          <i class="pi pi-search" />
          <span class="hidden lg:inline">Search</span>
          <kbd
            class="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
          >
            ⌘K
          </kbd>
        </button>

        <button
          class="theme-toggle hover-lift"
          title="Toggle theme"
          @click="
            colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
          "
        >
          <i
            :class="`pi ${colorMode.value === 'dark' ? 'pi-sun' : 'pi-moon'}`"
          />
        </button>

        <div class="flex items-center gap-3">
          <NuxtLink to="/admin">
            <PremiumButton variant="secondary" size="sm">
              Dashboard
            </PremiumButton>
          </NuxtLink>
          <NuxtLink to="/login">
            <PremiumButton variant="primary" size="sm"> Sign In </PremiumButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Search Dropdown -->
    <SearchDropdown v-model="isSearchOpen" />
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.logo-link {
  transition: transform var(--transition-base);
}

.logo-link:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  position: relative;
  padding: 0.75rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  overflow: hidden;
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-200);
}

.nav-link.router-link-active {
  color: var(--color-primary-500);
  background: rgba(219, 60, 36, 0.08);
}

.link-text {
  position: relative;
  z-index: 1;
}

.link-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.nav-link:hover .link-indicator,
.nav-link.router-link-active .link-indicator {
  width: 60%;
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

.theme-toggle:active {
  transform: translateY(0);
}

.theme-toggle i {
  font-size: 1.25rem;
  transition: transform var(--transition-base);
}

.theme-toggle:hover i {
  transform: rotate(20deg);
}

.dark .navbar {
  background: rgba(21, 22, 30, 0.85);
  border-bottom-color: var(--dark-color-border);
}

.dark .nav-link {
  color: var(--dark-color-text-secondary);
}

.dark .nav-link:hover {
  color: var(--dark-color-text-primary);
  background: var(--dark-color-bg-200);
}

.dark .nav-link.router-link-active {
  color: var(--color-primary-400);
  background: rgba(234, 138, 123, 0.15);
}

.dark .theme-toggle {
  background: var(--dark-color-bg-200);
  border-color: var(--dark-color-border);
  color: var(--dark-color-text-primary);
}

.dark .theme-toggle:hover {
  border-color: var(--color-primary-400);
  background: var(--dark-color-bg-100);
  box-shadow: var(--shadow-md), var(--dark-shadow-glow-sm);
}

@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
  }

  .navbar > div {
    padding: 0 1rem;
  }
}

.search-trigger {
  transition: all 0.2s ease;
}

.search-trigger:hover {
  color: var(--color-text-primary);
}
</style>
