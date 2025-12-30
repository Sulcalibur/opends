<script setup lang="ts">
/**
 * Admin Documentation Pages List
 * Uses PrimeVue components for polished UI
 */
import { FilterMatchMode } from '@primevue/core/api'

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

// DataTable filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const categories = computed(() => {
  const cats = new Set(pages.value.map(p => p.category))
  return Array.from(cats).sort().map(c => ({ label: c, value: c }))
})

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

function getSeverity(isPublished: boolean) {
  return isPublished ? 'success' : 'warn'
}
</script>

<template>
  <div class="docs-admin">
    <!-- Header -->
    <div class="docs-header">
      <div>
        <h1 class="docs-title">
          <i class="pi pi-file-edit" />
          Documentation Pages
        </h1>
        <p class="docs-subtitle">Create and manage your design system documentation</p>
      </div>
      <NuxtLink to="/admin/docs/new">
        <Button label="New Page" icon="pi pi-plus" />
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="loading-state">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p>Loading documentation pages...</p>
    </div>

    <!-- Empty State -->
    <Card v-else-if="pages.length === 0" class="empty-card">
      <template #content>
        <div class="empty-state">
          <i class="pi pi-file-edit empty-icon" />
          <h3>No documentation pages yet</h3>
          <p>Create your first documentation page to get started with your design system docs.</p>
          <NuxtLink to="/admin/docs/new">
            <Button label="Create First Page" icon="pi pi-plus" class="mt-4" />
          </NuxtLink>
        </div>
      </template>
    </Card>

    <!-- Data Table -->
    <Card v-else class="data-card">
      <template #content>
        <DataTable 
          :value="pages" 
          :paginator="pages.length > 10" 
          :rows="10"
          v-model:filters="filters"
          filterDisplay="row"
          :globalFilterFields="['title', 'slug', 'category']"
          removableSort
          stripedRows
          class="docs-table"
        >
          <template #header>
            <div class="table-header">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search pages..." />
              </IconField>
            </div>
          </template>

          <template #empty>
            <div class="empty-table">No documentation pages found.</div>
          </template>

          <Column field="title" header="Title" sortable style="min-width: 250px">
            <template #body="{ data }">
              <div class="title-cell">
                <span class="page-title">{{ data.title }}</span>
                <code class="page-slug">/docs/{{ data.slug }}</code>
              </div>
            </template>
          </Column>

          <Column field="category" header="Category" sortable :showFilterMenu="false" style="min-width: 150px">
            <template #body="{ data }">
              <Tag :value="data.category" severity="secondary" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                v-model="filterModel.value" 
                @change="filterCallback()" 
                :options="categories" 
                optionLabel="label"
                optionValue="value"
                placeholder="All"
                showClear
                class="w-full"
              />
            </template>
          </Column>

          <Column field="isPublished" header="Status" sortable style="min-width: 120px">
            <template #body="{ data }">
              <Tag 
                :value="data.isPublished ? 'Published' : 'Draft'" 
                :severity="getSeverity(data.isPublished)"
                :icon="data.isPublished ? 'pi pi-check-circle' : 'pi pi-clock'"
              />
            </template>
          </Column>

          <Column field="updatedAt" header="Last Updated" sortable style="min-width: 150px">
            <template #body="{ data }">
              <span class="date-text">{{ formatDate(data.updatedAt) }}</span>
            </template>
          </Column>

          <Column header="Actions" style="min-width: 150px">
            <template #body="{ data }">
              <div class="action-buttons">
                <NuxtLink :to="`/admin/docs/${data.slug}`">
                  <Button 
                    icon="pi pi-pencil" 
                    severity="secondary" 
                    text 
                    rounded 
                    v-tooltip.top="'Edit'"
                  />
                </NuxtLink>
                <NuxtLink :to="`/docs/${data.slug}`" target="_blank">
                  <Button 
                    icon="pi pi-external-link" 
                    severity="secondary" 
                    text 
                    rounded 
                    v-tooltip.top="'Preview'"
                  />
                </NuxtLink>
                <Button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  text 
                  rounded 
                  v-tooltip.top="'Delete'"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      :style="{ width: '450px' }" 
      header="Delete Page" 
      :modal="true"
      :closable="!deleting"
    >
      <div class="delete-dialog-content">
        <i class="pi pi-exclamation-triangle delete-warning-icon" />
        <div>
          <p>Are you sure you want to delete <strong>{{ pageToDelete?.title }}</strong>?</p>
          <p class="text-secondary">This action cannot be undone.</p>
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
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.docs-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.docs-title i {
  color: var(--primary-color);
}

.docs-subtitle {
  color: var(--text-color-secondary);
  margin: 0.5rem 0 0 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--text-color-secondary);
}

.empty-card, .data-card {
  border-radius: 12px;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--surface-400);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-color-secondary);
  margin: 0;
  max-width: 400px;
  margin-inline: auto;
}

.table-header {
  display: flex;
  justify-content: flex-end;
}

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-weight: 500;
  color: var(--text-color);
}

.page-slug {
  font-size: 0.75rem;
  color: var(--primary-color);
  background: var(--surface-100);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

.date-text {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.empty-table {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.delete-dialog-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.delete-warning-icon {
  font-size: 2rem;
  color: var(--red-500);
  flex-shrink: 0;
}

.delete-dialog-content p {
  margin: 0 0 0.5rem 0;
}

.text-secondary {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .docs-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .docs-header > a {
    align-self: flex-start;
  }
}
</style>
