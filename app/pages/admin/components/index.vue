<template>
  <div class="max-w-[1400px] mx-auto p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Components
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Manage your design system components
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="New Component"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Filters -->
    <UCard>
      <div class="flex flex-col sm:flex-row gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search components..."
          icon="i-lucide-search"
          class="flex-1"
        />
        <USelect
          v-model="selectedCategory"
          :items="categories"
          placeholder="All Categories"
          class="w-full sm:w-48"
        />
        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
          placeholder="All Statuses"
          class="w-full sm:w-48"
        />
      </div>
    </UCard>

    <!-- Components Grid -->
    <div
      v-if="filteredComponents.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="component in filteredComponents"
        :key="component.id"
        class="group hover:shadow-lg transition-shadow"
      >
        <template #header>
          <div
            class="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-t-lg overflow-hidden"
          >
            <img
              v-if="component.preview_url"
              :src="component.preview_url"
              alt="Preview"
              class="w-full h-full object-cover"
            />
            <UIcon
              v-else
              name="i-lucide-image"
              class="w-12 h-12 text-gray-300 dark:text-gray-600"
            />
          </div>
        </template>

        <div class="space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <UBadge
              :label="component.category"
              color="info"
              variant="soft"
              size="sm"
            />
            <UBadge
              :label="component.status"
              :color="getStatusColor(component.status)"
              variant="soft"
              size="sm"
            />
          </div>

          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ component.display_name || component.name }}
          </h3>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ component.description || "No description provided" }}
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="editComponent(component)"
            />
            <UButton
              data-testid="view-btn"
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="viewComponent(component)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="deleteComponent(component)"
            />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else class="text-center py-16">
      <UIcon
        name="i-lucide-box"
        class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
      />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No components yet
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Create your first component to get started
      </p>
      <UButton
        icon="i-lucide-plus"
        label="Create Component"
        @click="showCreateDialog = true"
      />
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal :open="showCreateDialog" @update:open="showCreateDialog = $event">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ editingComponent ? "Edit Component" : "New Component" }}
            </h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Component Name *">
              <UInput v-model="form.name" placeholder="e.g., Button" />
            </UFormField>

            <UFormField label="Display Name">
              <UInput
                v-model="form.display_name"
                placeholder="e.g., Primary Button"
              />
            </UFormField>

            <UFormField label="Category">
              <USelect
                v-model="form.category"
                :items="categories"
                placeholder="Select category"
              />
            </UFormField>

            <UFormField label="Status">
              <USelect
                v-model="form.status"
                :items="statusOptions"
                placeholder="Select status"
              />
            </UFormField>

            <UFormField label="Description">
              <UTextarea
                v-model="form.description"
                :rows="3"
                placeholder="Describe this component..."
              />
            </UFormField>

            <UFormField label="Preview URL">
              <UInput v-model="form.preview_url" placeholder="https://..." />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="closeDialog"
              />
              <UButton
                :label="editingComponent ? 'Update' : 'Create'"
                :loading="saving"
                @click="saveComponent"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface ComponentItem {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  status: "draft" | "review" | "approved" | "deprecated";
  preview_url?: string;
  spec: Record<string, unknown>;
}

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const showCreateDialog = ref(false);
const editingComponent = ref<ComponentItem | null>(null);
const saving = ref(false);
const searchQuery = ref("");
const selectedCategory = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);
const loading = ref(false);

const form = ref({
  name: "",
  display_name: "",
  description: "",
  category: "",
  status: "draft" as "draft" | "review" | "approved" | "deprecated",
  preview_url: "",
  spec: {} as Record<string, unknown>,
});

const categories = [
  "Form",
  "Navigation",
  "Layout",
  "Data Display",
  "Feedback",
  "Overlay",
  "Media",
  "Misc",
];

const statusOptions = ["draft", "review", "approved", "deprecated"];

const components = ref<ComponentItem[]>([]);
const api = useApi();

const filteredComponents = computed(() => {
  return components.value.filter((c) => {
    const matchesSearch =
      !searchQuery.value ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.display_name?.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      !selectedCategory.value || c.category === selectedCategory.value;
    const matchesStatus =
      !selectedStatus.value || c.status === selectedStatus.value;

    return matchesSearch && matchesCategory && matchesStatus;
  });
});

function getStatusColor(status: string) {
  const map: Record<
    string,
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral"
  > = {
    draft: "secondary",
    review: "warning",
    approved: "success",
    deprecated: "error",
  };
  return map[status] || "info";
}

function editComponent(component: ComponentItem) {
  navigateTo(`/admin/components/${component.id}/edit`);
}

function viewComponent(component: ComponentItem) {
  navigateTo(`/admin/components/${component.id}`);
}

async function deleteComponent(component: ComponentItem) {
  if (confirm(`Delete ${component.name}?`)) {
    try {
      await api.delete(`/components/${component.id}`);
      components.value = components.value.filter((c) => c.id !== component.id);
    } catch (error: any) {
      alert("Failed to delete component: " + error.message);
    }
  }
}

async function saveComponent() {
  saving.value = true;
  try {
    if (editingComponent.value) {
      const updated = await api.put(
        `/components/${editingComponent.value.id}`,
        form.value,
      );
      const index = components.value.findIndex(
        (c) => c.id === editingComponent.value!.id,
      );
      if (index !== -1) {
        components.value[index] = updated.component;
      }
    } else {
      const created = await api.post("/components", form.value);
      components.value.unshift(created.component);
    }
    closeDialog();
  } catch (error: any) {
    alert("Failed to save component: " + error.message);
  } finally {
    saving.value = false;
  }
}

function closeDialog() {
  showCreateDialog.value = false;
  editingComponent.value = null;
  form.value = {
    name: "",
    display_name: "",
    description: "",
    category: "",
    status: "draft",
    preview_url: "",
    spec: {},
  };
}

async function loadComponents() {
  loading.value = true;
  try {
    const response = await api.get("/components");
    components.value = response.components || [];
  } catch (error: any) {
    console.error("Failed to load components:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadComponents();
});
</script>
