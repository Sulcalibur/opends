<script setup lang="ts">
interface DocsListResponse {
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    sortOrder?: number;
    updatedAt: string;
  }>;
}

const { data: docs, error } = await useFetch<DocsListResponse>("/api/docs", {
  query: { isPublished: 1 },
});

const pages = computed(() => docs.value?.pages || []);

const pagesByCategory = computed(() => {
  const grouped: Record<string, typeof pages.value> = {};

  pages.value.forEach((page) => {
    const category = page.category || "general";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(page);
  });

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  });

  return grouped;
});

const categories = computed(() => Object.keys(pagesByCategory.value).sort());

useHead({
  title: "Documentation - OpenDS Design System",
  meta: [
    {
      name: "description",
      content:
        "Browse OpenDS design system documentation, guides, and resources.",
    },
  ],
});
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300"
  >
    <!-- Hero -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 py-24 px-4"
    >
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <div
          class="absolute top-1/2 left-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"
        />
        <div
          class="absolute bottom-20 right-1/4 w-36 h-36 bg-orange-300 rounded-full blur-3xl"
        />
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h1 class="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Documentation
        </h1>
        <p class="text-xl opacity-95 max-w-2xl mx-auto mb-8 drop-shadow">
          Explore our comprehensive guides and resources to get the most out of
          OpenDS.
        </p>
        <UButton
          to="/admin/docs"
          color="neutral"
          variant="solid"
          size="lg"
          class="backdrop-blur-sm"
        >
          <template #leading>
            <UIcon name="i-lucide-plus-circle" class="w-5 h-5" />
          </template>
          Create Documentation
        </UButton>
      </div>
    </div>

    <!-- Content -->
    <div class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Empty state -->
        <div v-if="pages.length === 0" class="text-center py-16">
          <UIcon
            name="i-lucide-book-open"
            class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
          />
          <h2
            class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2"
          >
            No Documentation Available Yet
          </h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            Get started by creating your first documentation page in the admin
            panel.
          </p>
          <UButton to="/admin/docs" color="primary">
            <template #leading>
              <UIcon name="i-lucide-plus" class="w-4 h-4" />
            </template>
            Create First Doc
          </UButton>
        </div>

        <!-- Categories -->
        <div v-else class="space-y-12">
          <section
            v-for="category in categories"
            :key="category"
            class="space-y-6"
          >
            <div class="flex items-center gap-4">
              <h2
                class="text-2xl font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap"
              >
                {{
                  category.charAt(0).toUpperCase() +
                  category.slice(1).replace(/-/g, " ")
                }}
              </h2>
              <div
                class="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NuxtLink
                v-for="page in pagesByCategory[category]"
                :key="page.slug"
                :to="`/docs/${page.slug}`"
                class="group flex flex-col bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-primary-300 dark:hover:border-primary-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div class="p-6 flex-1">
                  <div
                    class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:rotate-[-10deg] group-hover:scale-110 transition-all duration-300"
                  >
                    <UIcon
                      name="i-lucide-file-text"
                      class="w-6 h-6 text-slate-400 group-hover:text-white transition-colors"
                    />
                  </div>
                  <h3
                    class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-500 transition-colors"
                  >
                    {{ page.title }}
                  </h3>
                  <p
                    v-if="page.excerpt"
                    class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3"
                  >
                    {{ page.excerpt }}
                  </p>
                  <div
                    class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500"
                  >
                    <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                    {{ new Date(page.updatedAt).toLocaleDateString() }}
                  </div>
                </div>
                <div
                  class="px-6 py-3 bg-slate-100 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300"
                >
                  <span
                    class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors"
                  >
                    Read more
                  </span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
