<script setup lang="ts">
/**
 * Edit Documentation Page
 */
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

// Fetch existing page data
const { data: pageData, error: fetchError } = await useFetch<{ success: boolean; data: any }>(`/api/docs/${slug}`, {
  query: { published: 'false' } // Allow access to unpublished pages for editing
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
const error = ref('')

async function savePage() {
  if (!form.value.title || !form.value.slug) {
    error.value = 'Title and slug are required'
    return
  }

  saving.value = true
  error.value = ''

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

    // If slug changed, redirect to new URL
    if (form.value.slug !== slug) {
      router.push(`/admin/docs/${form.value.slug}`)
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save page'
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
    <header class="editor-header">
      <div class="header-left">
        <NuxtLink to="/admin/docs" class="back-link">
          <i class="pi pi-arrow-left" />
          Back to Docs
        </NuxtLink>
        <h1>Edit: {{ form.title }}</h1>
      </div>
      <div class="header-actions">
        <NuxtLink :to="`/docs/${slug}`" target="_blank" class="btn-secondary">
          <i class="pi pi-external-link" />
          Preview
        </NuxtLink>
        <label class="publish-toggle">
          <input v-model="form.isPublished" type="checkbox" />
          <span>Published</span>
        </label>
        <button 
          class="btn-primary" 
          :disabled="saving"
          @click="savePage"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner" />
          <i v-else class="pi pi-save" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="error-banner">
      <i class="pi pi-exclamation-circle" />
      {{ error }}
    </div>

    <div class="editor-layout">
      <div class="editor-main">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Page title"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="slug">Slug</label>
          <div class="slug-input">
            <span class="slug-prefix">/docs/</span>
            <input 
              id="slug"
              v-model="form.slug"
              type="text"
              placeholder="page-slug"
              class="input-field"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Content</label>
          <ClientOnly>
            <MilkdownEditor v-model="form.content" />
            <template #fallback>
              <div class="editor-loading">
                <i class="pi pi-spin pi-spinner" />
                Loading editor...
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <aside class="editor-sidebar">
        <div class="sidebar-section">
          <h3>Page Settings</h3>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="form.category" class="input-field">
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="excerpt">Excerpt</label>
            <textarea 
              id="excerpt"
              v-model="form.excerpt"
              placeholder="Brief description for listings"
              rows="3"
              class="input-field"
            />
          </div>
        </div>
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
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
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
}

.back-link:hover {
  color: var(--primary-color);
}

.editor-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.publish-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.publish-toggle input {
  width: 18px;
  height: 18px;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--surface-border);
  color: var(--text-color);
}

.btn-secondary:hover {
  background: var(--surface-100);
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--surface-card);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
}

.slug-input {
  display: flex;
  align-items: stretch;
}

.slug-prefix {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: var(--surface-100);
  border: 1px solid var(--surface-border);
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: var(--text-color-secondary);
  font-family: monospace;
}

.slug-input .input-field {
  border-radius: 0 8px 8px 0;
  font-family: monospace;
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  color: var(--text-color-secondary);
  gap: 0.5rem;
}

.editor-sidebar {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.sidebar-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

textarea.input-field {
  resize: vertical;
  min-height: 80px;
}
</style>
