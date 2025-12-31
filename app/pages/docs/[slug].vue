<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useFetch, useHead, createError } from '#app'

const route = useRoute()
const slug = route.params.slug as string

// Fetch the documentation page
const { data: doc, error } = await useFetch(`/api/docs/${slug}`)

// Handle not found or unpublished pages
if (error.value || !doc.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Documentation page not found',
    fatal: true
  })
}

const page = doc.value.data

// Set page metadata
useHead({
  title: `${page.title} - OpenDS Documentation`,
  meta: [
    { name: 'description', content: page.excerpt || `${page.title} - OpenDS Design System Documentation` }
  ]
})

// Parse markdown to HTML (simple approach - you can use a library like marked or remark)
const renderMarkdown = (markdown: string) => {
  if (!markdown) return ''
  
  // Basic markdown parsing (you should use a proper library in production)
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
  
  return `<p>${html}</p>`.replace(/<p><\/p>/g, '').replace(/<p><h/g, '<h').replace(/<\/h(\d)><\/p>/g, '</h$1>')
}

const htmlContent = computed(() => renderMarkdown(page.content))
</script>

<template>
  <div class="docs-page">
    <div class="ds-phase-banner ds-container">
      <span class="ds-phase-tag">ALPHA</span>
      <p class="text-sm">This is a new service – your <a href="#">feedback</a> will help us to improve it.</p>
    </div>

    <!-- Header -->
    <div class="docs-header">
      <div class="ds-container">
        <nav class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
          <i class="pi pi-angle-right"></i>
          <NuxtLink to="/docs" class="breadcrumb-item">Documentation</NuxtLink>
          <i class="pi pi-angle-right"></i>
          <span class="breadcrumb-item active">{{ page.title }}</span>
        </nav>
        
        <h1 class="docs-title">{{ page.title }}</h1>
        <p v-if="page.excerpt" class="docs-excerpt">{{ page.excerpt }}</p>
        
        <div class="docs-meta">
          <span class="meta-item">
            <i class="pi pi-folder"></i>
            {{ page.category || 'General' }}
          </span>
          <span class="meta-item">
            <i class="pi pi-clock"></i>
            Updated {{ new Date(page.updatedAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="docs-content">
      <div class="ds-container">
        <article class="prose" v-html="htmlContent"></article>
        
        <!-- Footer navigation -->
        <div class="docs-footer">
          <NuxtLink to="/docs" class="back-link">
            <i class="pi pi-arrow-left"></i>
            Back to Documentation
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-page {
  min-height: 100vh;
  background: white;
}

.ds-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.docs-header {
  background: white;
  border-bottom: 2px solid #b1b4b6;
  padding: 2rem 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  color: #64748b;
}

.breadcrumb-item {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: var(--primary-color, #3b82f6);
}

.breadcrumb-item.active {
  color: #0f172a;
  font-weight: 500;
}

.docs-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.docs-excerpt {
  font-size: 1.125rem;
  color: #475569;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.docs-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.meta-item i {
  font-size: 0.75rem;
}

/* Content */
.docs-content {
  padding: 3rem 0 4rem;
}

.prose {
  color: #334155;
  line-height: 1.75;
  font-size: 1.0625rem;
}

.prose :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 2.5rem 0 1rem;
  line-height: 1.25;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.prose :deep(h1:first-child) {
  margin-top: 0;
}

.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 1.5rem 0 0.5rem;
  line-height: 1.4;
}

.prose :deep(p) {
  margin: 1rem 0;
}

.prose :deep(a) {
  color: var(--primary-color, #1d70b8);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.1em;
}

.prose :deep(a:hover) {
  color: var(--primary-color-hover, #003078);
  text-decoration-thickness: 3px;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #0f172a;
}

.prose :deep(em) {
  font-style: italic;
}

.prose :deep(code) {
  background: #f1f5f9;
  color: #e11d48;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
}

.prose :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.prose :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin: 0.5rem 0;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--primary-color, #3b82f6);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #475569;
  font-style: italic;
}

/* Footer */
.docs-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color, #3b82f6);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.back-link:hover {
  color: #2563eb;
  gap: 0.75rem;
}

.back-link i {
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .docs-header {
    padding: 2rem 0 1.5rem;
  }

  .docs-title {
    font-size: 2rem;
  }

  .docs-excerpt {
    font-size: 1rem;
  }

  .docs-content {
    padding: 2rem 0 3rem;
  }

  .prose {
    font-size: 1rem;
  }

  .prose :deep(h1) {
    font-size: 1.75rem;
  }

  .prose :deep(h2) {
    font-size: 1.375rem;
  }

  .prose :deep(h3) {
    font-size: 1.125rem;
  }
}

/* Dark mode support */
:root.dark .docs-page {
  background: linear-gradient(to bottom, #0f172a 0%, #1e293b 100%);
}

:root.dark .docs-header {
  background: #1e293b;
  border-bottom-color: #334155;
}

:root.dark .docs-title,
:root.dark .prose :deep(h1),
:root.dark .prose :deep(h2) {
  color: #f1f5f9;
}

:root.dark .prose :deep(h3),
:root.dark .prose :deep(strong) {
  color: #e2e8f0;
}

:root.dark .prose {
  color: #cbd5e1;
}

:root.dark .breadcrumb-item {
  color: #94a3b8;
}

:root.dark .breadcrumb-item.active {
  color: #f1f5f9;
}

:root.dark .docs-excerpt {
  color: #94a3b8;
}

:root.dark .meta-item {
  color: #94a3b8;
}

:root.dark .prose :deep(code) {
  background: #334155;
  color: #fbbf24;
}

:root.dark .prose :deep(blockquote) {
  color: #94a3b8;
}

:root.dark .docs-footer {
  border-top-color: #334155;
}
</style>
