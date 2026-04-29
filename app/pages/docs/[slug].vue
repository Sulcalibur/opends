<script setup lang="ts">
import DocRenderer from "../../components/docs/DocRenderer.vue";

const route = useRoute();
const slug = route.params.slug as string;

interface DocResponse {
  success: boolean;
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category: string;
    isPublished: boolean;
    updatedAt: string;
  };
}

const { data: doc, error } = await useFetch<DocResponse>(`/api/docs/${slug}`);

if (error.value || !doc.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: "Documentation page not found",
    fatal: true,
  });
}

const page = doc.value.data;

// Set page metadata
useHead({
  title: `${page.title} - OpenDS Documentation`,
  meta: [
    {
      name: "description",
      content:
        page.excerpt || `${page.title} - OpenDS Design System Documentation`,
    },
  ],
});
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 transition-colors duration-300"
  >
    <!-- Header -->
    <div
      class="border-b-2 border-slate-300 dark:border-slate-700 py-8 bg-white dark:bg-slate-800 transition-colors duration-300"
    >
      <div class="max-w-4xl mx-auto px-4">
        <nav
          class="flex items-center gap-2 text-sm mb-6 text-slate-500 dark:text-slate-400"
        >
          <NuxtLink to="/" class="hover:text-primary transition-colors">
            Home
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <NuxtLink to="/docs" class="hover:text-primary transition-colors">
            Documentation
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          <span class="text-slate-900 dark:text-slate-100 font-medium">
            {{ page.title }}
          </span>
        </nav>

        <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {{ page.title }}
        </h1>
        <p
          v-if="page.excerpt"
          class="text-lg text-slate-600 dark:text-slate-400 mb-4"
        >
          {{ page.excerpt }}
        </p>

        <div class="flex gap-6 flex-wrap">
          <UBadge color="info" variant="soft">
            <UIcon name="i-lucide-folder" class="w-3 h-3 mr-1" />
            {{ page.category || "General" }}
          </UBadge>
          <span
            class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            Updated {{ new Date(page.updatedAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="py-12">
      <div class="max-w-4xl mx-auto px-4">
        <ClientOnly>
          <DocRenderer :content="page.content" />
          <template #fallback>
            <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {{ page.content }}
            </div>
          </template>
        </ClientOnly>

        <!-- Footer navigation -->
        <div class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            Back to Documentation
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
