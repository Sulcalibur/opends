<script setup lang="ts">
/**
 * Documentation Index Page
 * Lists all published documentation pages
 */

// Fetch all published documentation
const { data: docs, error } = await useFetch('/api/docs', {
  query: { isPublished: 1 }
})

const pages = computed(() => docs.value?.data || [])

// Group pages by category
const pagesByCategory = computed(() => {
  const grouped: Record<string, any[]> = {}
  
  pages.value.forEach((page: any) => {
    const category = page.category || 'general'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(page)
  })
  
  // Sort pages within each category by sortOrder
  Object.keys(grouped).forEach(cat => {
    grouped[cat].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  })
  
  return grouped
})

const categories = computed(() => Object.keys(pagesByCategory.value).sort())

useHead({
  title: 'Documentation - OpenDS Design System',
  meta: [
    { name: 'description', content: 'Browse OpenDS design system documentation, guides, and resources.' }
  ]
})
</script>

<template>
  <div class="docs-index">
    <!-- Hero Section -->
    <div class="docs-hero">
      <div class="container">
        <h1 class="hero-title">Documentation</h1>
        <p class="hero-subtitle">
          Explore our comprehensive guides and resources to get the most out of OpenDS.
        </p>
      </div>
    </div>

    <!-- Documentation Grid -->
    <div class="docs-grid">
      <div class="container">
        <!-- Empty State -->
        <div v-if="pages.length === 0" class="empty-state-card">
          <div class="empty-state-content">
            <div class="empty-icon">
              <i class="pi pi-book"></i>
            </div>
            <h3>No Documentation Available Yet</h3>
            <p>Get started by creating your first documentation page in the admin panel.</p>
            <NuxtLink to="/admin/docs" class="theme-btn-primary mt-4 inline-flex items-center">
              <i class="pi pi-plus mr-2"></i>
              Create First Doc
            </NuxtLink>
          </div>
        </div>

        <!-- Documentation Categories -->
        <div v-else class="categories">
          <section v-for="category in categories" :key="category" class="category-section">
            <h2 class="category-title">{{ category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') }}</h2>
            
            <div class="docs-cards">
              <NuxtLink
                v-for="page in pagesByCategory[category]"
                :key="page.slug"
                :to="`/docs/${page.slug}`"
                class="doc-card"
              >
                <div class="card-content">
                  <h3 class="card-title">{{ page.title }}</h3>
                  <p v-if="page.excerpt" class="card-excerpt">{{ page.excerpt }}</p>
                  <div class="card-meta">
                    <span class="meta-item">
                      <i class="pi pi-clock"></i>
                      {{ new Date(page.updatedAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <div class="card-arrow">
                  <i class="pi pi-arrow-right"></i>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-index {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero */
.docs-hero {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 4rem 0 3rem;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid */
.docs-grid {
  padding: 4rem 0;
}

/* Empty State */
.empty-state-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon i {
  font-size: 2.5rem;
  color: #64748b;
}

.empty-state-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
}

.empty-state-card p {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Categories */
.categories {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Doc Cards */
.docs-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.75rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.doc-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.doc-card:hover .card-arrow {
  background: #3b82f6;
  color: white;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.card-excerpt {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.meta-item i {
  font-size: 0.75rem;
}

.card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: #f1f5f9;
  color: #64748b;
  transition: all 0.2s;
  flex-shrink: 0;
}

.card-arrow i {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .docs-hero {
    padding: 3rem 0 2rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .docs-grid {
    padding: 3rem 0;
  }

  .docs-cards {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 1.5rem;
  }
}

/* Dark mode */
:root.dark .docs-index {
  background: linear-gradient(to bottom, #0f172a 0%, #1e293b 100%);
}

:root.dark .docs-hero {
  background: #1e293b;
  border-bottom-color: #334155;
}

:root.dark .hero-title,
:root.dark .category-title {
  color: #f1f5f9;
}

:root.dark .hero-subtitle {
  color: #94a3b8;
}

:root.dark .doc-card {
  background: #1e293b;
  border-color: #334155;
}

:root.dark .doc-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

:root.dark .card-title {
  color: #f1f5f9;
}

.card-excerpt {
  color: #94a3b8;
}

:root.dark .card-arrow {
  background: #334155;
  color: #94a3b8;
}

:root.dark .empty-state h3 {
  color: #cbd5e1;
}
</style>