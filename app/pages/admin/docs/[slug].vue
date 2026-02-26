```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

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
    toast.add({ color: 'error', title: 'Error', description: 'Title and slug are required' })
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
    toast.add({ color: 'success', title: 'Saved', description: 'Page updated successfully' })

    if (form.value.slug !== slug) {
      router.push(`/admin/docs/${form.value.slug}`)
    }
  } catch (err: any) {
    toast.add({ color: 'error', title: 'Error', description: err.data?.message || 'Failed to save' })
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
  <div class="editor-page">
    <Toast />

    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="breadcrumb">
          <NuxtLink to="/admin/docs" class="back-link">
            <i class="pi pi-arrow-left" />
            Back to Docs
          </NuxtLink>
        </div>
        <h1 class="page-title">Edit: {{ form.title || 'Untitled' }}</h1>
        <p class="page-subtitle slug-display">/docs/{{ slug }}</p>
      </div>
      <div class="header-actions">
        <NuxtLink :to="`/docs/${slug}`" target="_blank">
          <Button label="Preview" icon="pi pi-external-link" severity="secondary" outlined />
        </NuxtLink>
        <span class="divider"/>
        <div class="status-toggle">
          <label class="toggle-label">{{ form.isPublished ? 'Published' : 'Draft' }}</label>
          <InputSwitch v-model="form.isPublished" />
        </div>
        <Button 
          label="Save Changes" 
          icon="pi pi-save" 
          :loading="saving"
          :disabled="saving || !hasChanges"
          @click="savePage"
        />
      </div>
    </div>

    <!-- Alert for unsaved changes -->
    <div v-if="hasChanges && !saving" class="changes-alert">
      <i class="pi pi-info-circle" />
      <span>You have unsaved changes.</span>
    </div>

    <div class="editor-layout">
      <!-- Main Content -->
      <div class="main-column">
        <Card class="editor-card">
          <template #content>
            <div class="form-section">
              <label class="section-label">Page Title</label>
              <InputText v-model="form.title" class="title-input" placeholder="Page Title" />
            </div>

            <div class="form-section">
              <label class="section-label">Content</label>
              <div class="editor-wrapper">
                <ClientOnly>
                  <EditorMilkdownEditor v-model="form.content" />
                  <template #fallback>
                    <div class="loading-editor">Loading editor...</div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sidebar -->
      <aside class="sidebar-column">
        <Card class="settings-card">
          <template #title>Page Settings</template>
          <template #content>
            <div class="setting-item">
              <label>Slug</label>
              <InputText v-model="form.slug" class="w-full" />
              <small class="help-text">URL identifier</small>
            </div>

            <div class="setting-item">
              <label>Category</label>
              <Select 
                v-model="form.category" 
                :options="categories" 
                option-label="label" 
                option-value="value" 
                class="w-full"
              />
            </div>

            <div class="setting-item">
              <label>Excerpt</label>
              <Textarea v-model="form.excerpt" rows="4" class="w-full" />
              <small class="help-text">SEO description</small>
            </div>

            <Divider />
            
            <div class="meta-info">
              <p>Last updated: {{ new Date(pageData?.data?.updatedAt).toLocaleDateString() }}</p>
            </div>
          </template>
        </Card>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.breadcrumb {
  margin-bottom: 0.5rem;
}

.back-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  color: #3b82f6;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-family: monospace;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider {
  width: 1px;
  height: 24px;
  background: #cbd5e1;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 0.5rem;
}

.toggle-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.875rem;
}

.changes-alert {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  color: #92400e;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.editor-card {
  border-radius: 1rem;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.title-input {
  width: 100%;
  font-size: 1.5rem;
  padding: 0.75rem;
}

.editor-wrapper {
  overflow: visible;
}

.settings-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 2rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-item label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.help-text {
  color: #94a3b8;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.25rem;
}

.meta-info {
  font-size: 0.75rem;
  color: #94a3b8;
}

.w-full {
  width: 100%;
}

:deep(.p-card-content) {
  padding: 2rem;
}

:deep(.p-card-title) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}
</style>
