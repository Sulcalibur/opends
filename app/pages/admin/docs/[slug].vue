<script setup lang="ts">
/**
 * Edit Documentation Page
 * Uses PrimeVue components for polished UI
 */
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const slug = route.params.slug as string

// Fetch existing page data
const { data: pageData, error: fetchError } = await useFetch<{ success: boolean; data: any }>(`/api/docs/${slug}`, {
  query: { published: 'false' }
})

if (fetchError.value || !pageData.value?.data) {
  throw createError({
    statusCode: 404,
    message: 'Page not found'
  })
}

const form = ref({
  title: pageData.value.data.title || '',
  slug: pageData.value.data.slug || '',
  content: pageData.value.data.content || '',
  excerpt: pageData.value.data.excerpt || '',
  category: pageData.value.data.category || 'general',
  isPublished: Boolean(pageData.value.data.isPublished)
})

const saving = ref(false)
const hasChanges = ref(false)

// Track changes
watch(form, () => {
  hasChanges.value = true
}, { deep: true })

async function savePage() {
  if (!form.value.title || !form.value.slug) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Title and slug are required',
      life: 3000
    })
    return
  }

  saving.value = true

  try {
    await $fetch(`/api/docs/${slug}`, {
      method: 'PUT',
      body: {
        title: form.value.title,
        slug: form.value.slug,
        content: form.value.content,
        excerpt: form.value.excerpt || undefined,
        category: form.value.category,
        isPublished: form.value.isPublished
      }
    })

    hasChanges.value = false
    
    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Page updated successfully',
      life: 3000
    })

    // If slug changed, redirect to new URL
    if (form.value.slug !== slug) {
      router.push(`/admin/docs/${form.value.slug}`)
    }
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.data?.message || 'Failed to save page',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const categories = [
  { label: 'General', value: 'general' },
  { label: 'Getting Started', value: 'getting-started' },
  { label: 'Guides', value: 'guides' },
  { label: 'Components', value: 'components' },
  { label: 'Tokens', value: 'tokens' },
  { label: 'Patterns', value: 'patterns' },
  { label: 'Resources', value: 'resources' }
]
</script>

<template>
  <div class="docs-editor">
    <!-- Toast for notifications -->
    <Toast />

    <!-- Header -->
    <div class="editor-header">
      <div class="header-left">
        <NuxtLink to="/admin/docs" class="back-link">
          <i class="pi pi-arrow-left" />
          <span>Back to Docs</span>
        </NuxtLink>
        <h1 class="editor-title">
          <i class="pi pi-file-edit" />
          Edit: {{ form.title || 'Untitled' }}
        </h1>
      </div>
      <div class="header-actions">
        <NuxtLink :to="`/docs/${slug}`" target="_blank">
          <Button label="Preview" icon="pi pi-external-link" severity="secondary" outlined />
        </NuxtLink>
        <div class="publish-toggle">
          <Checkbox v-model="form.isPublished" :binary="true" inputId="published" />
          <label for="published" class="publish-label">
            {{ form.isPublished ? 'Published' : 'Draft' }}
          </label>
        </div>
        <Button 
          label="Save Changes" 
          icon="pi pi-save" 
          :loading="saving"
          :disabled="saving"
          @click="savePage"
        />
      </div>
    </div>

    <!-- Unsaved changes indicator -->
    <Message v-if="hasChanges && !saving" severity="warn" :closable="false" class="changes-message">
      You have unsaved changes
    </Message>

    <!-- Editor Layout -->
    <div class="editor-layout">
      <!-- Main Content -->
      <div class="editor-main">
        <Card class="form-card">
          <template #content>
            <div class="form-group">
              <label for="title" class="form-label">Title</label>
              <InputText 
                id="title"
                v-model="form.title"
                placeholder="Page title"
                class="w-full"
              />
            </div>

            <div class="form-group">
              <label for="slug" class="form-label">Slug</label>
              <InputGroup>
                <InputGroupAddon>/docs/</InputGroupAddon>
                <InputText 
                  id="slug"
                  v-model="form.slug"
                  placeholder="page-slug"
                />
              </InputGroup>
              <small class="form-hint">URL-friendly identifier (lowercase, dashes only)</small>
            </div>

            <div class="form-group">
              <label class="form-label">Content</label>
              <ClientOnly>
                <MilkdownEditor v-model="form.content" />
                <template #fallback>
                  <div class="editor-loading">
                    <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
                    <span>Loading editor...</span>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sidebar -->
      <aside class="editor-sidebar">
        <Card class="sidebar-card">
          <template #title>
            <div class="sidebar-title">
              <i class="pi pi-cog" />
              Page Settings
            </div>
          </template>
          <template #content>
            <div class="form-group">
              <label for="category" class="form-label">Category</label>
              <Select 
                id="category"
                v-model="form.category" 
                :options="categories"
                optionLabel="label"
                optionValue="value"
                placeholder="Select category"
                class="w-full"
              />
            </div>

            <div class="form-group">
              <label for="excerpt" class="form-label">Excerpt</label>
              <Textarea 
                id="excerpt"
                v-model="form.excerpt"
                placeholder="Brief description for listings"
                :rows="4"
                class="w-full"
              />
              <small class="form-hint">Used in page listings and SEO</small>
            </div>

            <Divider />

            <div class="sidebar-info">
              <div class="info-item">
                <i class="pi pi-clock" />
                <span>Last updated: {{ new Date(pageData?.data?.updatedAt).toLocaleDateString() }}</span>
              </div>
              <div class="info-item">
                <i class="pi pi-calendar" />
                <span>Created: {{ new Date(pageData?.data?.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </template>
        </Card>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.docs-editor {
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary-color);
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.editor-title i {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.publish-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--surface-100);
  border-radius: 8px;
}

.publish-label {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-color);
}

.changes-message {
  margin-bottom: 1rem;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .editor-sidebar {
    order: -1;
  }
}

.form-card, .sidebar-card {
  border-radius: 12px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  color: var(--text-color-secondary);
  font-size: 0.75rem;
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--surface-100);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  gap: 0.75rem;
  color: var(--text-color-secondary);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.sidebar-title i {
  color: var(--primary-color);
}

.sidebar-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.info-item i {
  font-size: 0.875rem;
}

.w-full {
  width: 100%;
}
</style>
