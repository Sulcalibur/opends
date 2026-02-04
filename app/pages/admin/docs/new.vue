<script setup lang="ts">
/**
 * Create Documentation Page
 * Consistent Admin UI
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'Title and slug are required', life: 3000 })
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

    toast.add({ severity: 'success', summary: 'Created', detail: 'Page created successfully', life: 3000 })
    router.push('/admin/docs')
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.data?.message || 'Failed to create page', life: 5000 })
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
        <h1 class="page-title">New Documentation Page</h1>
        <p class="page-subtitle">Create a new guide or documentation entry</p>
      </div>
      <div class="header-actions">
        <div class="status-toggle">
          <label class="toggle-label">{{ form.isPublished ? 'Publish Immediately' : 'Save as Draft' }}</label>
          <InputSwitch v-model="form.isPublished" />
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

    <div class="editor-layout">
      <!-- Main Content -->
      <div class="main-column">
        <Card class="editor-card">
          <template #content>
            <div class="form-section">
              <label class="section-label">Page Title <span class="required">*</span></label>
              <InputText v-model="form.title" class="title-input" placeholder="Page Title" autofocus />
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
              <label>Slug <span class="required">*</span></label>
              <InputText v-model="form.slug" class="w-full" placeholder="url-slug" />
              <small class="help-text">Auto-generated from title</small>
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
              <Textarea v-model="form.excerpt" rows="4" class="w-full" placeholder="Brief description..." />
              <small class="help-text">Used for SEO and list previews</small>
            </div>

            <Divider />
            
            <div class="tips-box">
              <p class="tips-title"><i class="pi pi-lightbulb" /> Pro Tips</p>
              <ul class="tips-list">
                <li>Use headers to structure content</li>
                <li>`Code blocks` are supported</li>
                <li>Type / to open the command menu</li>
              </ul>
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.875rem;
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

.required {
  color: #ef4444;
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

.w-full {
  width: 100%;
}

.tips-box {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
}

.tips-title {
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tips-title i {
  color: #eab308;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.tips-list li {
  margin-bottom: 0.25rem;
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
