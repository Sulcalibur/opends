<script setup lang="ts">
/**
 * Admin Documentation Pages List
 * Uses PrimeVue components for polished UI
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
  <div class="docs-admin">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Documentation Pages</h1>
        <p class="page-subtitle">Create and manage your design system documentation</p>
      </div>
      <NuxtLink to="/admin/docs/new">
        <Button label="New Page" icon="pi pi-plus" />
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="loading-container">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p>Loading documentation pages...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="pages.length === 0" class="empty-container">
      <Card class="empty-card">
        <template #content>
          <div class="empty-content">
            <i class="pi pi-file-edit empty-icon" />
            <h3>No documentation pages yet</h3>
            <p>Create your first documentation page to get started with your design system docs.</p>
            <NuxtLink to="/admin/docs/new">
              <Button label="Create First Page" icon="pi pi-plus" class="p-button-lg" />
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
            <Tag :value="page.category" severity="secondary" class="category-tag" />
            <Tag 
              :value="page.isPublished ? 'Published' : 'Draft'" 
              :severity="page.isPublished ? 'success' : 'warn'"
              :icon="page.isPublished ? 'pi pi-check-circle' : 'pi pi-clock'"
            />
          </div>

          <h3 class="card-title">{{ page.title }}</h3>
          
          <p v-if="page.excerpt" class="card-excerpt">{{ page.excerpt }}</p>
          
          <div class="card-slug">
            <i class="pi pi-link" />
            <code>/docs/{{ page.slug }}</code>
          </div>

          <div class="card-meta">
            <i class="pi pi-clock" />
            <span>Updated {{ formatDate(page.updatedAt) }}</span>
          </div>

          <Divider />

          <div class="card-actions">
            <NuxtLink :to="`/admin/docs/${page.slug}`">
              <Button icon="pi pi-pencil" label="Edit" severity="secondary" size="small" outlined />
            </NuxtLink>
            <NuxtLink :to="`/docs/${page.slug}`" target="_blank">
              <Button icon="pi pi-external-link" label="View" severity="secondary" size="small" text />
            </NuxtLink>
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              size="small"
              text
              @click="confirmDelete(page)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      :style="{ width: '450px' }" 
      header="Delete Page" 
      :modal="true"
      :closable="!deleting"
    >
      <div class="delete-content">
        <i class="pi pi-exclamation-triangle delete-icon" />
        <div>
          <p>Are you sure you want to delete <strong>{{ pageToDelete?.title }}</strong>?</p>
          <p class="delete-warning">This action cannot be undone.</p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showDeleteDialog = false" :disabled="deleting" />
        <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deletePage" :loading="deleting" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.docs-admin {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: var(--text-color-secondary);
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--text-color-secondary);
}

.empty-container {
  max-width: 500px;
  margin: 2rem auto;
}

.empty-card {
  border-radius: 16px;
  overflow: hidden;
}

.empty-content {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--surface-400);
  margin-bottom: 1.5rem;
}

.empty-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-content p {
  color: var(--text-color-secondary);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.page-card {
  border-radius: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.page-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-tag {
  text-transform: capitalize;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.card-excerpt {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-slug {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-slug i {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
}

.card-slug code {
  font-size: 0.8rem;
  color: var(--primary-color);
  background: var(--primary-50);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.card-meta i {
  font-size: 0.75rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.delete-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.delete-icon {
  font-size: 2rem;
  color: var(--red-500);
  flex-shrink: 0;
}

.delete-content p {
  margin: 0 0 0.5rem 0;
}

.delete-warning {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-header > a {
    align-self: flex-start;
  }

  .pages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
