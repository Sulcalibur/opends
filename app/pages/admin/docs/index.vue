<script setup lang="ts">
/**
 * Admin Documentation Pages List
 * Uses PrimeVue components matching Users page design
 */
definePageMeta({
  layout: 'admin'
})

interface DocPage {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

const { data, pending, refresh } = await useFetch<{ success: boolean; data: { pages: DocPage[] } }>('/api/docs', {
  query: { published: 'false' }
})

const pages = computed(() => data.value?.data?.pages || [])

const showDeleteDialog = ref(false)
const pageToDelete = ref<DocPage | null>(null)
const deleting = ref(false)

function confirmDelete(page: DocPage) {
  pageToDelete.value = page
  showDeleteDialog.value = true
}

async function deletePage() {
  if (!pageToDelete.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/docs/${pageToDelete.value.slug}`, { method: 'DELETE' })
    showDeleteDialog.value = false
    pageToDelete.value = null
    refresh()
  } catch (error) {
    console.error('Failed to delete page:', error)
  } finally {
    deleting.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="docs-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Documentation Pages</h1>
        <p class="page-subtitle">Create and manage your design system documentation</p>
      </div>
      <NuxtLink to="/admin/docs/new">
        <Button icon="pi pi-plus" label="New Page" />
      </NuxtLink>
    </div>

    <!-- Stats Section -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-file-edit stat-icon"/>
            <div>
              <p class="stat-value">{{ pages.length }}</p>
              <p class="stat-label">Total Pages</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-check-circle stat-icon" style="color: #10b981"/>
            <div>
              <p class="stat-value">{{ pages.filter(p => p.isPublished).length }}</p>
              <p class="stat-label">Published</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-clock stat-icon" style="color: #f59e0b"/>
            <div>
              <p class="stat-value">{{ pages.filter(p => !p.isPublished).length }}</p>
              <p class="stat-label">Drafts</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Content Area -->
    <div v-if="pending" class="loading-state">
      <ProgressSpinner style="width: 50px; height: 50px" stroke-width="4" />
      <p>Loading documentation pages...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="pages.length === 0" class="empty-state-card">
      <Card>
        <template #content>
          <div class="empty-content">
            <i class="pi pi-file-edit empty-icon" />
            <h3>No documentation pages yet</h3>
            <p>Create your first documentation page to get started with your design system docs.</p>
            <NuxtLink to="/admin/docs/new">
              <Button label="Create First Page" icon="pi pi-plus" size="large" />
            </NuxtLink>
          </div>
        </template>
      </Card>
    </div>

    <!-- Pages Grid -->
    <div v-else class="pages-grid">
      <Card v-for="page in pages" :key="page.id" class="page-card">
        <template #content>
          <div class="card-header">
            <div class="category-badge">{{ page.category }}</div>
            <Tag 
              :value="page.isPublished ? 'Published' : 'Draft'" 
              :severity="page.isPublished ? 'success' : 'warn'"
              class="status-tag"
            />
          </div>

          <h3 class="card-title">{{ page.title }}</h3>
          
          <p class="card-excerpt">{{ page.excerpt || 'No excerpt available.' }}</p>
          
          <div class="card-meta">
            <div class="meta-item">
              <i class="pi pi-link" />
              <code class="slug-code">/docs/{{ page.slug }}</code>
            </div>
            <div class="meta-item">
              <i class="pi pi-clock" />
              <span>{{ formatDate(page.updatedAt) }}</span>
            </div>
          </div>

          <div class="card-actions">
            <NuxtLink :to="`/admin/docs/${page.slug}`" class="action-btn-link">
              <Button icon="pi pi-pencil" label="Edit" severity="secondary" outlined size="small" class="w-full" />
            </NuxtLink>
            <NuxtLink :to="`/docs/${page.slug}`" target="_blank" class="action-btn-link">
              <Button icon="pi pi-external-link" severity="secondary" text aria-label="View" />
            </NuxtLink>
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              text
              aria-label="Delete"
              @click="confirmDelete(page)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      header="Delete Page" 
      :style="{ width: '450px' }"
      modal
      :closable="!deleting"
    >
      <div class="delete-content">
        <div class="warning-icon-wrapper">
          <i class="pi pi-exclamation-triangle warning-icon" />
        </div>
        <div>
          <p class="font-semibold text-lg mb-2">Are you sure?</p>
          <p class="text-gray-600 mb-0">
            You are about to delete <strong>{{ pageToDelete?.title }}</strong>. This action cannot be undone.
          </p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" text severity="secondary" :disabled="deleting" @click="showDeleteDialog = false" />
        <Button label="Delete" severity="danger" icon="pi pi-trash" :loading="deleting" @click="deletePage" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.docs-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

/* Stats Grid matches User page */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  background: white;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  font-size: 2.5rem;
  color: #3b82f6;
  background: #eff6ff;
  padding: 1rem;
  border-radius: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

/* Loading & Empty States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.empty-state-card {
  max-width: 600px;
  margin: 2rem auto;
}

.empty-content {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

/* Pages Grid */
.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.page-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  height: 100%;
}

.page-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.category-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.card-excerpt {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em; /* Approximate height for 2 lines */
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.slug-code {
  font-family: monospace;
  background: #f8fafc;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  color: #3b82f6;
  font-size: 0.8rem;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn-link {
  text-decoration: none;
}

.w-full {
  width: 100%;
}

/* Dialog Styling */
.delete-content {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
}

.warning-icon-wrapper {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-icon {
  font-size: 1.5rem;
  color: #dc2626;
}

:deep(.p-card-content) {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
  background: #f8fafc;
}
</style>
