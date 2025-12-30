<script setup lang="ts">
/**
 * Create New Documentation Page
 * Uses PrimeVue components for polished UI
 */
definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const toast = useToast()

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  category: 'general',
  isPublished: false
})

const saving = ref(false)

// Auto-generate slug from title
watch(() => form.value.title, (title) => {
  if (!form.value.slug || form.value.slug === generateSlug(form.value.title.slice(0, -1))) {
    form.value.slug = generateSlug(title)
  }
})

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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
    await $fetch('/api/docs', {
      method: 'POST',
      body: {
        title: form.value.title,
        slug: form.value.slug,
        content: form.value.content,
        excerpt: form.value.excerpt || undefined,
        category: form.value.category,
        isPublished: form.value.isPublished
      }
    })

    toast.add({
      severity: 'success',
      summary: 'Created',
      detail: 'Page created successfully',
      life: 3000
    })

    router.push('/admin/docs')
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.data?.message || 'Failed to create page',
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
          <i class="pi pi-plus-circle" />
          Create Documentation Page
        </h1>
      </div>
      <div class="header-actions">
        <div class="publish-toggle">
          <Checkbox v-model="form.isPublished" :binary="true" inputId="published" />
          <label for="published" class="publish-label">
            {{ form.isPublished ? 'Publish immediately' : 'Save as draft' }}
          </label>
        </div>
        <Button 
          label="Create Page" 
          icon="pi pi-check" 
          :loading="saving"
          :disabled="saving || !form.title || !form.slug"
          @click="savePage"
        />
      </div>
    </div>

    <!-- Editor Layout -->
    <div class="editor-layout">
      <!-- Main Content -->
      <div class="editor-main">
        <Card class="form-card">
          <template #content>
            <div class="form-group">
              <label for="title" class="form-label">Title <span class="required">*</span></label>
              <InputText 
                id="title"
                v-model="form.title"
                placeholder="Enter page title"
                class="w-full"
                autofocus
              />
            </div>

            <div class="form-group">
              <label for="slug" class="form-label">Slug <span class="required">*</span></label>
              <InputGroup>
                <InputGroupAddon>/docs/</InputGroupAddon>
                <InputText 
                  id="slug"
                  v-model="form.slug"
                  placeholder="page-slug"
                />
              </InputGroup>
              <small class="form-hint">Auto-generated from title. URL-friendly identifier (lowercase, dashes only)</small>
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

            <div class="tips-section">
              <h4><i class="pi pi-lightbulb" /> Tips</h4>
              <ul>
                <li>Use headings (# ## ###) to structure your content</li>
                <li>Add code blocks with ``` for code examples</li>
                <li>Use / for slash commands in the editor</li>
              </ul>
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

.required {
  color: var(--red-500);
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

.tips-section {
  background: var(--surface-100);
  border-radius: 8px;
  padding: 1rem;
}

.tips-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-color);
}

.tips-section h4 i {
  color: var(--yellow-500);
}

.tips-section ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.tips-section li {
  margin-bottom: 0.5rem;
}

.tips-section li:last-child {
  margin-bottom: 0;
}

.w-full {
  width: 100%;
}
</style>
