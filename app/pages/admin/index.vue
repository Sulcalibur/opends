<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const api = useApi();

interface QuickAction {
  label: string;
  icon: string;
  description: string;
  to: string;
}

interface ActivityItem {
  action: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Components",
    icon: "i-lucide-package",
    description: "Manage UI components",
    to: "/admin/components",
  },
  {
    label: "Design Tokens",
    icon: "i-lucide-palette",
    description: "Colors, spacing, typography",
    to: "/admin/tokens",
  },
  {
    label: "Documentation",
    icon: "i-lucide-file-text",
    description: "Edit docs content",
    to: "/admin/docs",
  },
  {
    label: "Users",
    icon: "i-lucide-users",
    description: "Team management",
    to: "/admin/users",
  },
];

const stats = ref({
  components: 0,
  tokens: 0,
  docs: 0,
  users: 0,
});

const activities = ref<ActivityItem[]>([]);

const recentSearches = ref<string[]>([]);
const newSearch = ref("");

function addSearch() {
  if (!newSearch.value.trim()) return;
  recentSearches.value.unshift(newSearch.value.trim());
  if (recentSearches.value.length > 5) {
    recentSearches.value.pop();
  }
  newSearch.value = "";
}

function removeSearch(index: number) {
  recentSearches.value.splice(index, 1);
}

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

function loadStats() {
  // Placeholder: replace with real API calls
  stats.value = {
    components: 12,
    tokens: 48,
    docs: 6,
    users: 3,
  };
}

function loadActivities() {
  activities.value = [
    {
      action: "Added Button component",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      icon: "i-lucide-package",
      iconColor: "text-blue-500",
    },
    {
      action: "Updated color tokens",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: "i-lucide-palette",
      iconColor: "text-purple-500",
    },
    {
      action: "Published v1.2.0 docs",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      icon: "i-lucide-file-text",
      iconColor: "text-green-500",
    },
    {
      action: "Invited sarah@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      icon: "i-lucide-users",
      iconColor: "text-orange-500",
    },
  ];
}

onMounted(() => {
  loadStats();
  loadActivities();
});
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-6 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Overview of your design system
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Components</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.components }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
          >
            <Icon name="i-lucide-package" class="text-blue-500 text-xl" />
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Design Tokens
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.tokens }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center"
          >
            <Icon name="i-lucide-palette" class="text-purple-500 text-xl" />
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Documentation
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.docs }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
          >
            <Icon name="i-lucide-file-text" class="text-green-500 text-xl" />
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.users }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"
          >
            <Icon name="i-lucide-users" class="text-orange-500 text-xl" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
        >
          <div
            class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
          >
            <Icon
              :name="action.icon"
              class="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ action.label }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ action.description }}
            </p>
          </div>
          <Icon
            name="i-lucide-chevron-right"
            class="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Feed -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-external-link"
              to="/admin/components"
            >
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.timestamp"
            class="flex items-start gap-3"
          >
            <div
              class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
            >
              <Icon :name="activity.icon" :class="activity.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.action }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ formatTimeAgo(activity.timestamp) }}
              </p>
            </div>
          </div>

          <div
            v-if="activities.length === 0"
            class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <Icon
              name="i-lucide-clock"
              class="text-3xl mx-auto mb-2 opacity-50"
            />
            <p>No recent activity</p>
          </div>
        </div>
      </UCard>

      <!-- Search & Shortcuts -->
      <div class="space-y-6">
        <!-- Quick Search -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Search
            </h2>
          </template>

          <div class="space-y-3">
            <UInput
              v-model="newSearch"
              placeholder="Search components, tokens..."
              icon="i-lucide-search"
              @keyup.enter="addSearch"
            />
            <UButton block icon="i-lucide-search" @click="addSearch">
              Search
            </UButton>
          </div>

          <div v-if="recentSearches.length > 0" class="mt-4">
            <p
              class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
            >
              Recent
            </p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(search, index) in recentSearches"
                :key="index"
                color="neutral"
                variant="soft"
                class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                @click="newSearch = search"
              >
                {{ search }}
                <Icon
                  name="i-lucide-x"
                  class="ml-1 text-xs"
                  @click.stop="removeSearch(index)"
                />
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Keyboard Shortcuts -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Shortcuts
            </h2>
          </template>

          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between py-1.5">
              <span class="text-gray-600 dark:text-gray-400">Search</span>
              <kbd
                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                >⌘K</kbd
              >
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-gray-600 dark:text-gray-400"
                >New Component</span
              >
              <kbd
                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                >N</kbd
              >
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-gray-600 dark:text-gray-400">Toggle Theme</span>
              <kbd
                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                >T</kbd
              >
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-gray-600 dark:text-gray-400">Go to Docs</span>
              <kbd
                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                >G D</kbd
              >
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
