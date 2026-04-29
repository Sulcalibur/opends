<template>
  <div class="component-edit-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <UButton
        variant="ghost"
        :to="`/admin/components/${route.params.id}`"
        icon="i-lucide-arrow-left"
      >
        Back to Component
      </UButton>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <h1>Edit Component</h1>
      <p v-if="component" class="subtitle">{{ component.name }}</p>
    </div>

    <!-- Edit Form -->
    <form class="edit-form" @submit.prevent="saveComponent">
      <UCard>
        <template #header>
          <h3>Basic Information</h3>
        </template>

        <div class="form-grid">
          <UFormGroup label="Component Name *" :error="errors.name">
            <UInput
              v-model="form.name"
              data-testid="name-input"
              placeholder="e.g., Button"
              disabled
            />
            <small class="field-hint">Component name cannot be changed</small>
          </UFormGroup>

          <UFormGroup label="Display Name" :error="errors.display_name">
            <UInput
              v-model="form.display_name"
              placeholder="e.g., Primary Button"
            />
          </UFormGroup>

          <UFormGroup label="Category">
            <USelect v-model="form.category" :items="categories" />
          </UFormGroup>

          <UFormGroup label="Status">
            <USelect v-model="form.status" :items="statuses" />
          </UFormGroup>

          <UFormGroup label="Preview URL" class="full-width">
            <UInput v-model="form.preview_url" placeholder="https://..." />
          </UFormGroup>

          <UFormGroup label="Description" class="full-width">
            <UTextarea
              v-model="form.description"
              :rows="4"
              placeholder="Describe this component..."
            />
          </UFormGroup>
        </div>
      </UCard>

      <UCard class="spec-card">
        <template #header>
          <div class="spec-header">
            <h3>Component Specification</h3>
            <UButton size="xs" variant="soft" @click="addProp">
              <UIcon name="i-lucide-plus" />
              Add Prop
            </UButton>
          </div>
        </template>

        <div class="spec-sections">
          <!-- Props Section -->
          <div v-if="form.spec.props?.length" class="spec-section">
            <h4>Props</h4>
            <div class="prop-list">
              <div
                v-for="(prop, index) in form.spec.props"
                :key="index"
                class="prop-item"
              >
                <UInput
                  v-model="prop.name"
                  placeholder="Name"
                  class="prop-name"
                />
                <USelect
                  v-model="prop.type"
                  :items="propTypes"
                  class="prop-type"
                />
                <UInput
                  v-model="prop.default"
                  placeholder="Default"
                  class="prop-default"
                />
                <UCheckbox v-model="prop.required" label="Required" />
                <UButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-trash"
                  @click="removeProp(index)"
                />
              </div>
            </div>
          </div>

          <div v-else class="empty-props">
            <span>No props defined. Click "Add Prop" to add one.</span>
          </div>
        </div>
      </UCard>

      <!-- Form Actions -->
      <div class="form-actions">
        <UButton
          type="button"
          variant="ghost"
          :to="`/admin/components/${route.params.id}`"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          data-testid="save-btn"
          :loading="saving"
          icon="i-lucide-save"
        >
          Save Changes
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

interface ComponentSpec {
  props?: Array<{
    name: string;
    type: string;
    required?: boolean;
    default?: string;
  }>;
  slots?: Array<{
    name: string;
    description?: string;
  }>;
}

interface Component {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  category: string | null;
  status: "draft" | "review" | "approved" | "deprecated";
  preview_url: string | null;
  spec: ComponentSpec;
}

const route = useRoute();
const api = useApi();
const toast = useToast();

const component = ref<Component | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string>>({});

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

const statuses = ["draft", "review", "approved", "deprecated"];

const propTypes = [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "function",
];

const form = ref({
  name: "",
  display_name: "",
  description: "",
  category: "",
  status: "draft" as const,
  preview_url: "",
  spec: {
    props: [] as ComponentSpec["props"],
  },
});

function addProp() {
  if (!form.value.spec.props) {
    form.value.spec.props = [];
  }
  form.value.spec.props.push({
    name: "",
    type: "string",
    required: false,
    default: "",
  });
}

function removeProp(index: number) {
  form.value.spec.props?.splice(index, 1);
}

function validateForm(): boolean {
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = "Name is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function saveComponent() {
  if (!validateForm()) return;

  saving.value = true;
  try {
    const updateData = {
      display_name: form.value.display_name,
      description: form.value.description,
      category: form.value.category,
      status: form.value.status,
      preview_url: form.value.preview_url,
      spec: form.value.spec,
    };

    await api.put(`/components/${route.params.id}`, updateData);

    toast.add({
      title: "Component updated",
      description: "Changes saved successfully",
      color: "success",
    });

    navigateTo(`/admin/components/${route.params.id}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save component";
    toast.add({
      title: "Failed to save",
      description: errorMessage,
      color: "error",
    });
  } finally {
    saving.value = false;
  }
}

async function loadComponent() {
  loading.value = true;
  try {
    const response = await api.get(`/components/${route.params.id}`);
    component.value = response.component;

    // Populate form
    form.value = {
      name: response.component.name,
      display_name: response.component.display_name || "",
      description: response.component.description || "",
      category: response.component.category || "",
      status: response.component.status,
      preview_url: response.component.preview_url || "",
      spec: response.component.spec || { props: [] },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load component";
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
.component-edit-page {
  max-width: 1000px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--color-text-secondary);
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-grid .full-width {
  grid-column: span 2;
}

.field-hint {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
}

.spec-card {
  margin-top: 0.5rem;
}

.spec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.spec-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.prop-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prop-item {
  display: grid;
  grid-template-columns: 1fr 120px 120px auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-bg-50);
  border-radius: var(--radius-lg);
}

.empty-props {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .full-width {
    grid-column: span 1;
  }

  .prop-item {
    grid-template-columns: 1fr;
  }
}
</style>
