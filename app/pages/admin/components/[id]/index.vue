<template>
  <div class="component-detail-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <UButton
        variant="ghost"
        to="/admin/components"
        icon="i-lucide-arrow-left"
      >
        Back to Components
      </UButton>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="component-title">
          <h1>{{ component?.display_name || component?.name }}</h1>
          <UBadge :color="getStatusColor(component?.status)" variant="soft">
            {{ component?.status }}
          </UBadge>
        </div>
        <div class="header-actions">
          <UButton
            data-testid="edit-btn"
            variant="soft"
            icon="i-lucide-pencil"
            @click="navigateToEdit"
          >
            Edit
          </UButton>
          <UButton
            data-testid="delete-btn"
            color="error"
            variant="soft"
            icon="i-lucide-trash"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </div>
      <p v-if="component?.description" class="description">
        {{ component.description }}
      </p>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Preview Card -->
      <UCard class="preview-card">
        <template #header>
          <h3>Preview</h3>
        </template>
        <div class="preview-container">
          <img
            v-if="component?.preview_url"
            :src="component.preview_url"
            :alt="component.name"
            class="preview-image"
          />
          <div v-else class="preview-placeholder">
            <Icon name="i-lucide-image" class="placeholder-icon" />
            <span>No preview available</span>
          </div>
        </div>
      </UCard>

      <!-- Spec Card -->
      <UCard class="spec-card">
        <template #header>
          <h3>Component Spec</h3>
        </template>
        <div v-if="component?.spec" class="spec-content">
          <div v-if="component.spec.props?.length" class="spec-section">
            <h4>Props</h4>
            <UTable :rows="component.spec.props" :columns="propColumns" />
          </div>
          <div v-if="component.spec.slots?.length" class="spec-section">
            <h4>Slots</h4>
            <UTable :rows="component.spec.slots" :columns="slotColumns" />
          </div>
          <div v-if="component.spec.events?.length" class="spec-section">
            <h4>Events</h4>
            <UTable :rows="component.spec.events" :columns="eventColumns" />
          </div>
        </div>
        <div v-else class="empty-state">
          <span>No specification defined</span>
        </div>
      </UCard>

      <!-- Metadata Card -->
      <UCard class="metadata-card">
        <template #header>
          <h3>Metadata</h3>
        </template>
        <div class="metadata-list">
          <div class="metadata-item">
            <span class="label">Name</span>
            <code class="value">{{ component?.name }}</code>
          </div>
          <div class="metadata-item">
            <span class="label">Category</span>
            <span class="value">{{
              component?.category || "Uncategorized"
            }}</span>
          </div>
          <div class="metadata-item">
            <span class="label">Created</span>
            <span class="value">{{ formatDate(component?.created_at) }}</span>
          </div>
          <div class="metadata-item">
            <span class="label">Updated</span>
            <span class="value">{{ formatDate(component?.updated_at) }}</span>
          </div>
          <div class="metadata-item">
            <span class="label">Version</span>
            <UBadge size="xs" variant="soft">v1.0</UBadge>
          </div>
        </div>
      </UCard>

      <!-- Code Generation Card -->
      <UCard class="codegen-card">
        <template #header>
          <h3>Code Generation</h3>
        </template>
        <div class="codegen-content">
          <UFormGroup label="Framework">
            <USelect v-model="selectedFramework" :options="frameworks" />
          </UFormGroup>
          <UButton
            block
            icon="i-lucide-code"
            :loading="generating"
            @click="generateCode"
          >
            Generate Code
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3>Delete Component</h3>
        </template>
        <p>
          Are you sure you want to delete <strong>{{ component?.name }}</strong
          >?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
        <template #footer>
          <UButton variant="ghost" @click="showDeleteModal = false">
            Cancel
          </UButton>
          <UButton color="error" :loading="deleting" @click="deleteComponent">
            Delete
          </UButton>
        </template>
      </UCard>
    </UModal>

    <!-- Code Generation Modal -->
    <UModal v-model="showCodeModal" :ui="{ width: 'lg' }">
      <UCard>
        <template #header>
          <div class="code-modal-header">
            <h3>Generated Code</h3>
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-copy"
              @click="copyCode"
            >
              Copy
            </UButton>
          </div>
        </template>
        <pre class="code-block"><code>{{ generatedCode }}</code></pre>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

interface Component {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  category: string | null;
  status: "draft" | "review" | "approved" | "deprecated";
  preview_url: string | null;
  spec: {
    props?: Array<{
      name: string;
      type: string;
      required?: boolean;
      default?: unknown;
    }>;
    slots?: Array<{ name: string; description?: string }>;
    events?: Array<{ name: string; payload?: string }>;
  };
  created_at: string;
  updated_at: string;
}

const route = useRoute();
const api = useApi();
const toast = useToast();

const component = ref<Component | null>(null);
const loading = ref(false);
const deleting = ref(false);
const generating = ref(false);
const showDeleteModal = ref(false);
const showCodeModal = ref(false);
const generatedCode = ref("");

const selectedFramework = ref("vue");
const frameworks = ["vue", "react", "svelte"];

const propColumns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "required", label: "Required" },
  { key: "default", label: "Default" },
];

const slotColumns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const eventColumns = [
  { key: "name", label: "Name" },
  { key: "payload", label: "Payload" },
];

function getStatusColor(status?: string): string {
  const colors: Record<string, string> = {
    draft: "neutral",
    review: "warning",
    approved: "success",
    deprecated: "error",
  };
  return colors[status || "draft"] || colors.draft;
}

function formatDate(date?: string): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function navigateToEdit() {
  navigateTo(`/admin/components/${route.params.id}/edit`);
}

function confirmDelete() {
  showDeleteModal.value = true;
}

async function deleteComponent() {
  deleting.value = true;
  try {
    await api.delete(`/components/${route.params.id}`);
    toast.add({
      title: "Component deleted",
      color: "success",
    });
    navigateTo("/admin/components");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast.add({
      title: "Failed to delete",
      description: errorMessage,
      color: "error",
    });
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
  }
}

async function generateCode() {
  generating.value = true;
  try {
    const response = await api.post<{ code: string }>(
      `/components/${route.params.id}/generate`,
      {
        framework: selectedFramework.value,
      },
    );
    generatedCode.value = response.code;
    showCodeModal.value = true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast.add({
      title: "Failed to generate code",
      description: errorMessage,
      color: "error",
    });
  } finally {
    generating.value = false;
  }
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value);
  toast.add({
    title: "Code copied to clipboard",
    color: "success",
  });
}

async function loadComponent() {
  loading.value = true;
  try {
    const response = await api.get<{ component: Component }>(
      `/components/${route.params.id}`,
    );
    component.value = response.component;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast.add({
      title: "Failed to load component",
      description: errorMessage,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadComponent();
});
</script>

<style scoped>
.component-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.component-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.component-title h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.description {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 1.125rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.preview-card {
  grid-column: span 1;
}

.preview-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-100);
  border-radius: var(--radius-lg);
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-tertiary);
}

.placeholder-icon {
  font-size: 3rem;
}

.spec-card {
  grid-column: span 1;
}

.spec-section {
  margin-bottom: 1.5rem;
}

.spec-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.metadata-card {
  grid-column: span 1;
}

.metadata-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.metadata-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metadata-item .label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.metadata-item .value {
  font-weight: 500;
}

.codegen-card {
  grid-column: span 1;
}

.codegen-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-text {
  color: var(--color-error-500);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.code-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-block {
  background: var(--color-bg-900);
  color: var(--color-bg-100);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  overflow-x: auto;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .preview-card,
  .spec-card,
  .metadata-card,
  .codegen-card {
    grid-column: span 1;
  }
}
</style>
