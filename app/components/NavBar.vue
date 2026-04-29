<script setup lang="ts">
import { computed, ref } from "vue";
import { useSearchShortcut } from "../composables/useKeyboardShortcut";

const router = useRouter();
const { data: settingsData } = await useFetch("/api/settings/public").catch(
  () => ({ data: ref(null) }),
);
const settings = computed(() => settingsData.value?.settings || {});

const orgName = computed(() => settings.value?.organization_name || "OpenDS");

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
  <nav
    class="sticky top-0 z-50 bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300"
  >
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="no-underline transition-transform duration-300 hover:scale-105"
      >
        <Logo :text="orgName" />
      </NuxtLink>

      <div class="hidden md:flex items-center gap-2">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="relative px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 overflow-hidden"
        >
          <span class="relative z-10">{{ link.name }}</span>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Button -->
        <button
          data-test="search-button"
          class="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="isSearchOpen = true"
        >
          <UIcon name="i-lucide-search" class="w-4 h-4" />
          <span class="hidden lg:inline">Search</span>
          <kbd
            class="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans"
          >
            ⌘K
          </kbd>
        </button>

        <UiThemeToggle />

        <div class="flex items-center gap-3">
          <BaseButton to="/admin" variant="secondary" size="compact">
            Dashboard
          </BaseButton>
          <BaseButton to="/login" variant="primary" size="compact">
            Sign In
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Search Modal -->
    <LayoutSearchModal v-model="isSearchOpen" />
  </nav>
</template>

<style scoped>
.router-link-active {
  color: var(--color-primary-600);
  background: rgba(232, 90, 58, 0.08);
}

.dark .router-link-active {
  color: var(--color-primary-400);
  background: rgba(232, 90, 58, 0.15);
}
</style>
