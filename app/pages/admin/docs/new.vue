<script setup lang="ts">
/**
 * Create Documentation Page
 * Consistent Admin UI
 */
definePageMeta({
  layout: "admin",
});

const router = useRouter();
const toast = useToast();

const form = ref({
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "general",
  isPublished: false,
});

const saving = ref(false);

// Auto-generate slug from title
watch(
  () => form.value.title,
  (title) => {
    if (
      !form.value.slug ||
      form.value.slug === generateSlug(form.value.title.slice(0, -1))
    ) {
      form.value.slug = generateSlug(title);
    }
  },
);

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

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
    await $fetch("/api/docs", {
      method: "POST",
      body: {
        title: form.value.title,
        slug: form.value.slug,
        content: form.value.content,
        excerpt: form.value.excerpt || undefined,
        category: form.value.category,
        isPublished: form.value.isPublished,
      },
    });

    toast.add({
      color: "success",
      title: "Created",
      description: "Page created successfully",
    });
    router.push("/admin/docs");
  } catch (err: any) {
    toast.add({
      color: "error",
      title: "Error",
      description: err.data?.message || "Failed to create page",
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
            <UIcon name="i-lucide-arrow-left" />
            Back to Docs
          </NuxtLink>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          New Documentation Page
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Create a new guide or documentation entry
        </p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <span
            class="text-sm font-semibold text-gray-600 dark:text-gray-300"
            >{{
              form.isPublished ? "Publish Immediately" : "Save as Draft"
            }}</span
          >
          <USwitch v-model="form.isPublished" />
        </div>
        <UButton
          label="Create Page"
          icon="i-lucide-check"
          :loading="saving"
          :disabled="saving || !form.title || !form.slug"
          @click="savePage"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
      <!-- Main Content -->
      <div>
        <UCard class="shadow-sm">
          <div class="space-y-6">
            <div>
              <label
                class="block font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                Page Title <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="form.title"
                placeholder="Page Title"
                size="xl"
                autofocus
              />
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
              >
                Slug <span class="text-red-500">*</span>
              </label>
              <UInput v-model="form.slug" placeholder="url-slug" />
              <span class="text-xs text-gray-400 mt-1 block"
                >Auto-generated from title</span
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
              <UTextarea
                v-model="form.excerpt"
                :rows="4"
                placeholder="Brief description..."
              />
              <span class="text-xs text-gray-400 mt-1 block"
                >Used for SEO and list previews</span
              >
            </div>

            <USeparator />

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p
                class="font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2"
              >
                <UIcon name="i-lucide-lightbulb" class="text-yellow-500" />
                Pro Tips
              </p>
              <ul
                class="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 space-y-1"
              >
                <li>Use headers to structure content</li>
                <li>`Code blocks` are supported</li>
                <li>Type / to open the command menu</li>
              </ul>
            </div>
          </div>
        </UCard>
      </aside>
    </div>
  </div>
</template>
