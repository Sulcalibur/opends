<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const slug = route.params.slug as string;

// Fetch existing page data
const { data: pageData, error: fetchError } = await useFetch<{
  success: boolean;
  data: any;
}>(`/api/docs/${slug}`, {
  query: { published: "false" },
});

if (fetchError.value || !pageData.value?.data) {
  throw createError({
    statusCode: 404,
    message: "Page not found",
  });
}

const form = ref({
  title: pageData.value.data.title || "",
  slug: pageData.value.data.slug || "",
  content: pageData.value.data.content || "",
  excerpt: pageData.value.data.excerpt || "",
  category: pageData.value.data.category || "general",
  isPublished: Boolean(pageData.value.data.isPublished),
});

const saving = ref(false);
const hasChanges = ref(false);

// Track changes
watch(
  form,
  () => {
    hasChanges.value = true;
  },
  { deep: true },
);

async function savePage() {
  if (!form.value.title || !form.value.slug) {
    toast.add({
      color: "error",
      title: "Error",
      description: "Title and slug are required",
    });
    return;
  }

  saving.value = true;

  try {
    await $fetch(`/api/docs/${slug}`, {
      method: "PUT",
      body: {
        title: form.value.title,
        slug: form.value.slug,
        content: form.value.content,
        excerpt: form.value.excerpt || undefined,
        category: form.value.category,
        isPublished: form.value.isPublished,
      },
    });

    hasChanges.value = false;
    toast.add({
      color: "success",
      title: "Saved",
      description: "Page updated successfully",
    });

    if (form.value.slug !== slug) {
      router.push(`/admin/docs/${form.value.slug}`);
    }
  } catch (err: any) {
    toast.add({
      color: "error",
      title: "Error",
      description: err.data?.message || "Failed to save",
    });
  } finally {
    saving.value = false;
  }
}

const categories = [
  { label: "General", value: "general" },
  { label: "Getting Started", value: "getting-started" },
  { label: "Guides", value: "guides" },
  { label: "Components", value: "components" },
  { label: "Tokens", value: "tokens" },
  { label: "Patterns", value: "patterns" },
  { label: "Resources", value: "resources" },
];
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div>
        <div class="mb-2">
          <NuxtLink
            to="/admin/docs"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-2 transition-colors"
          >
            <Icon name="i-lucide-arrow-left" />
            Back to Docs
          </NuxtLink>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit: {{ form.title || "Untitled" }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 font-mono">
          /docs/{{ slug }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          label="Preview"
          icon="i-lucide-external-link"
          variant="outline"
          color="neutral"
          :to="`/docs/${slug}`"
          target="_blank"
        />
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <div class="flex items-center gap-3">
          <span
            class="text-sm font-semibold text-gray-600 dark:text-gray-300"
            >{{ form.isPublished ? "Published" : "Draft" }}</span
          >
          <USwitch v-model="form.isPublished" />
        </div>
        <UButton
          label="Save Changes"
          icon="i-lucide-save"
          :loading="saving"
          :disabled="saving || !hasChanges"
          @click="savePage"
        />
      </div>
    </div>

    <!-- Alert for unsaved changes -->
    <div
      v-if="hasChanges && !saving"
      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
    >
      <Icon name="i-lucide-info" />
      <span>You have unsaved changes.</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
      <!-- Main Content -->
      <div>
        <UCard class="shadow-sm">
          <div class="space-y-6">
            <div>
              <label
                class="block font-semibold text-gray-900 dark:text-gray-100 mb-2"
                >Page Title</label
              >
              <UInput v-model="form.title" placeholder="Page Title" size="xl" />
            </div>

            <div>
              <label
                class="block font-semibold text-gray-900 dark:text-gray-100 mb-2"
                >Content</label
              >
              <ClientOnly>
                <EditorMilkdownEditor v-model="form.content" />
                <template #fallback>
                  <div
                    class="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    Loading editor...
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <aside>
        <UCard class="shadow-sm sticky top-8">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Page Settings
            </h3>
          </template>

          <div class="space-y-5">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >Slug</label
              >
              <UInput v-model="form.slug" />
              <span class="text-xs text-gray-400 mt-1 block"
                >URL identifier</span
              >
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >Category</label
              >
              <USelect v-model="form.category" :items="categories" />
            </div>

            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >Excerpt</label
              >
              <UTextarea v-model="form.excerpt" :rows="4" />
              <span class="text-xs text-gray-400 mt-1 block"
                >SEO description</span
              >
            </div>

            <USeparator />

            <div class="text-xs text-gray-400">
              Last updated:
              {{ new Date(pageData?.data?.updatedAt).toLocaleDateString() }}
            </div>
          </div>
        </UCard>
      </aside>
    </div>
  </div>
</template>
