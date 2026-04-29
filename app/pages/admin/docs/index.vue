<script setup lang="ts">
/**
 * Admin Documentation Pages List
 * Refactored to use NuxtUI v4 + Tailwind + Lucide icons
 */
definePageMeta({
  layout: "admin",
});

interface DocPage {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const { data, pending, refresh } = await useFetch<{
  success: boolean;
  data: { pages: DocPage[] };
}>("/api/docs", {
  query: { published: "false" },
});

const pages = computed(() => data.value?.data?.pages || []);

const showDeleteModal = ref(false);
const pageToDelete = ref<DocPage | null>(null);
const deleting = ref(false);

function confirmDelete(page: DocPage) {
  pageToDelete.value = page;
  showDeleteModal.value = true;
}

async function deletePage() {
  if (!pageToDelete.value) return;

  deleting.value = true;
  try {
    await $fetch(`/api/docs/${pageToDelete.value.slug}`, { method: "DELETE" });
    showDeleteModal.value = false;
    pageToDelete.value = null;
    refresh();
  } catch (error) {
    console.error("Failed to delete page:", error);
  } finally {
    deleting.value = false;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(published: boolean) {
  return published ? ("success" as const) : ("warning" as const);
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Documentation Pages
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Create and manage your design system documentation
        </p>
      </div>
      <NuxtLink to="/admin/docs/new">
        <UButton color="primary" icon="i-lucide-plus"> New Page </UButton>
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950">
            <UIcon
              name="i-lucide-file-text"
              class="w-8 h-8 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pages.length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Pages</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950">
            <UIcon
              name="i-lucide-check-circle"
              class="w-8 h-8 text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pages.filter((p) => p.isPublished).length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Published</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950">
            <UIcon
              name="i-lucide-clock"
              class="w-8 h-8 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ pages.filter((p) => !p.isPublished).length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-16">
      <UIcon
        name="i-lucide-loader-2"
        class="w-10 h-10 animate-spin text-gray-400"
      />
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        Loading documentation pages...
      </p>
    </div>

    <!-- Empty -->
    <UCard v-else-if="pages.length === 0" class="max-w-2xl mx-auto">
      <div class="text-center py-12">
        <UIcon
          name="i-lucide-file-text"
          class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No documentation pages yet
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first documentation page to get started with your design
          system docs.
        </p>
        <NuxtLink to="/admin/docs/new">
          <UButton size="lg" color="primary" icon="i-lucide-plus">
            Create First Page
          </UButton>
        </NuxtLink>
      </div>
    </UCard>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="page in pages"
        :key="page.id"
        class="hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-3">
          <UBadge color="neutral" variant="soft" size="sm">
            {{ page.category }}
          </UBadge>
          <UBadge
            :color="getStatusColor(page.isPublished)"
            variant="soft"
            size="sm"
          >
            {{ page.isPublished ? "Published" : "Draft" }}
          </UBadge>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ page.title }}
        </h3>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {{ page.excerpt || "No excerpt available." }}
        </p>

        <div
          class="space-y-2 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800"
        >
          <div
            class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-lucide-link" class="w-4 h-4" />
            <code
              class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
            >
              /docs/{{ page.slug }}
            </code>
          </div>
          <div
            class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-lucide-clock" class="w-4 h-4" />
            <span>{{ formatDate(page.updatedAt) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink :to="`/admin/docs/${page.slug}`" class="flex-1">
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-lucide-pencil"
              block
            >
              Edit
            </UButton>
          </NuxtLink>
          <NuxtLink :to="`/docs/${page.slug}`" target="_blank">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-external-link"
            />
          </NuxtLink>
          <UButton
            color="error"
            variant="ghost"
            size="sm"
            icon="i-lucide-trash"
            @click="confirmDelete(page)"
          />
        </div>
      </UCard>
    </div>

    <!-- Delete Modal -->
    <UModal :open="showDeleteModal" @update:open="showDeleteModal = $event">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="w-5 h-5 text-red-600"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold">Delete Page</h3>
                <p class="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </template>

          <p class="text-gray-600 dark:text-gray-400">
            You are about to delete <strong>{{ pageToDelete?.title }}</strong
            >.
          </p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="neutral"
                variant="ghost"
                :disabled="deleting"
                @click="showDeleteModal = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                icon="i-lucide-trash"
                :loading="deleting"
                @click="deletePage"
              >
                Delete
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
