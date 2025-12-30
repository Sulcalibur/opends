<script setup lang="ts">
/**
 * Admin Documentation Pages List
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
  query: { published: 'false' } // Show all pages for admin
})

const pages = computed(() => data.value?.data?.pages || [])

const categories = computed(() => {
  const cats = new Set(pages.value.map(p => p.category))
  return Array.from(cats).sort()
})

const showDeleteModal = ref(false)
const pageToDelete = ref<DocPage | null>(null)

function confirmDelete(page: DocPage) {
  pageToDelete.value = page
  showDeleteModal.value = true
}

async function deletePage() {
  if (!pageToDelete.value) return
  
  try {
    await $fetch(`/api/docs/${pageToDelete.value.slug}`, { method: 'DELETE' })
    showDeleteModal.value = false
    pageToDelete.value = null
    refresh()
  } catch (error) {
    console.error('Failed to delete page:', error)
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
    <header class="docs-header">
      <div>
        <h1>Documentation Pages</h1>
        <p class="subtitle">Manage your design system documentation</p>
      </div>
      <NuxtLink to="/admin/docs/new" class="btn-primary">
        <i class="pi pi-plus" />
        New Page
      </NuxtLink>
    </header>

    <div v-if="pending" class="loading">
      <i class="pi pi-spin pi-spinner" />
      Loading pages...
    </div>

    <div v-else-if="pages.length === 0" class="empty-state">
      <i class="pi pi-file-edit" />
      <h3>No documentation pages yet</h3>
      <p>Create your first documentation page to get started.</p>
      <NuxtLink to="/admin/docs/new" class="btn-primary">
        Create First Page
      </NuxtLink>
    </div>

    <div v-else class="pages-grid">
      <div v-for="page in pages" :key="page.id" class="page-card">
        <div class="page-header">
          <span class="category-badge">{{ page.category }}</span>
          <span :class="['status-badge', page.isPublished ? 'published' : 'draft']">
            {{ page.isPublished ? 'Published' : 'Draft' }}
          </span>
        </div>
        
        <h3 class="page-title">{{ page.title }}</h3>
        <p v-if="page.excerpt" class="page-excerpt">{{ page.excerpt }}</p>
        <p class="page-slug">/docs/{{ page.slug }}</p>
        
        <div class="page-meta">
          <span>Updated {{ formatDate(page.updatedAt) }}</span>
        </div>

        <div class="page-actions">
          <NuxtLink :to="`/admin/docs/${page.slug}`" class="btn-icon" title="Edit">
            <i class="pi pi-pencil" />
          </NuxtLink>
          <NuxtLink :to="`/docs/${page.slug}`" target="_blank" class="btn-icon" title="View">
            <i class="pi pi-external-link" />
          </NuxtLink>
          <button class="btn-icon btn-danger" title="Delete" @click="confirmDelete(page)">
            <i class="pi pi-trash" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal">
          <h3>Delete Page</h3>
          <p>Are you sure you want to delete "<strong>{{ pageToDelete?.title }}</strong>"?</p>
          <p class="warning">This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button class="btn-danger" @click="deletePage">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.docs-admin {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.docs-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.subtitle {
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-600);
}

.loading, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color-secondary);
}

.empty-state i {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.page-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.page-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-badge {
  background: var(--surface-100);
  color: var(--text-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.published {
  background: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
}

.status-badge.draft {
  background: rgba(234, 179, 8, 0.1);
  color: rgb(234, 179, 8);
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.page-excerpt {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.page-slug {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
}

.page-meta {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.page-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-icon:hover {
  background: var(--surface-100);
}

.btn-icon.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgb(239, 68, 68);
  color: rgb(239, 68, 68);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.modal .warning {
  color: rgb(239, 68, 68);
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--surface-border);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: rgb(239, 68, 68);
  color: white;
  cursor: pointer;
}
</style>
