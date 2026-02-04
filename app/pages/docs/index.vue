<script setup lang="ts">
import { computed } from "vue";

const { data: docs, error } = await useFetch("/api/docs", {
  query: { isPublished: 1 },
});

const pages = computed(() => docs.value?.pages || []);

const pagesByCategory = computed(() => {
  const grouped: Record<string, any[]> = {};

  pages.value.forEach((page: any) => {
    const category = page.category || "general";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(page);
  });

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  });

  return grouped;
});

const categories = computed(() => Object.keys(pagesByCategory.value).sort());

useHead({
  title: "Documentation - OpenDS Design System",
  meta: [
    {
      name: "description",
      content:
        "Browse OpenDS design system documentation, guides, and resources.",
    },
  ],
});
</script>

<template>
  <div class="docs-index">
    <AnimatedGradientBackground class="hero-gradient">
      <div class="hero-content">
        <div class="floating-shapes">
          <div class="shape shape-1"/>
          <div class="shape shape-2"/>
          <div class="shape shape-3"/>
        </div>

        <div class="hero-text fade-up">
          <h1 class="hero-title">Documentation</h1>
          <p class="hero-subtitle">
            Explore our comprehensive guides and resources to get the most out
            of OpenDS.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/admin/docs" class="hero-cta primary">
              <i class="pi pi-plus-circle"/>
              <span>Create Documentation</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>

    <div class="docs-content">
      <div class="container">
        <EmptyState
          v-if="pages.length === 0"
          icon="pi-book"
          title="No Documentation Available Yet"
          description="Get started by creating your first documentation page in the admin panel."
          action-link="/admin/docs"
          action-text="Create First Doc"
          class="fade-up stagger-1"
        />

        <div v-else class="docs-categories">
          <section
            v-for="(category, catIndex) in categories"
            :key="category"
            class="category-section fade-up"
            :class="`stagger-${(catIndex % 3) + 1}`"
          >
            <h2 class="category-title">
              {{
                category.charAt(0).toUpperCase() +
                category.slice(1).replace(/-/g, " ")
              }}
              <div class="category-line"/>
            </h2>

            <div class="docs-grid">
              <NuxtLink
                v-for="(page, pageIndex) in pagesByCategory[category]"
                :key="page.slug"
                :to="`/docs/${page.slug}`"
                class="doc-card hover-lift card-gradient-border"
                :class="`stagger-${(pageIndex % 3) + 1}`"
              >
                <div class="doc-card-content">
                  <div class="doc-icon-wrapper">
                    <i class="pi pi-file text-xl"/>
                  </div>
                  <div class="doc-info">
                    <h3 class="doc-title">{{ page.title }}</h3>
                    <p v-if="page.excerpt" class="doc-excerpt">
                      {{ page.excerpt }}
                    </p>
                    <div class="doc-meta">
                      <span class="meta-item">
                        <i class="pi pi-clock"/>
                        {{ new Date(page.updatedAt).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                  <div class="doc-arrow">
                    <i class="pi pi-arrow-right"/>
                  </div>
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
  background: var(--color-bg);
  overflow-x: hidden;
}

.hero-gradient {
  position: relative;
  padding: 100px 0 80px;
  overflow: hidden;
}

.hero-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  opacity: 1;
  animation: gradient-shift 15s ease-in-out infinite alternate;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
    opacity: 0.8;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

.floating-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(60px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(219, 60, 36, 0.3), transparent);
  animation: float 6s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  background: radial-gradient(circle, rgba(231, 189, 24, 0.2), transparent);
  animation: float 8s ease-in-out infinite reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 15%;
  background: radial-gradient(circle, rgba(234, 138, 123, 0.25), transparent);
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(10deg);
  }
  66% {
    transform: translateY(15px) rotate(-5deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-text {
  animation: fade-up 0.8s var(--easing-out);
}

.hero-title {
  font-size: 4rem;
  font-weight: var(--font-weight-extrabold);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.375rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto 2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fade-up 1.2s var(--easing-out) 0.4s both;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  font-size: 1.125rem;
  color: white;
  text-decoration: none;
  transition: all var(--transition-slow);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.hero-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.hero-cta.primary {
  background: linear-gradient(
    135deg,
    var(--color-primary-500) 0%,
    var(--color-secondary-500) 100%
  );
}

.hero-cta i {
  font-size: 1.25rem;
}

.docs-content {
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.docs-categories {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  position: relative;
}

.category-line {
  flex: 1;
  height: 2px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.doc-card {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 0;
  text-decoration: none;
  transition: all var(--transition-slow);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.doc-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.doc-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-xl), var(--shadow-glow-md);
  transform: translateY(-6px);
}

.doc-card:hover::before {
  opacity: 0.05;
}

.doc-card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.doc-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    var(--color-bg-200) 0%,
    var(--color-bg-100) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.doc-card:hover .doc-icon-wrapper {
  transform: rotate(-10deg) scale(1.1);
  background: var(--gradient-primary);
}

.doc-icon-wrapper i {
  color: var(--color-text-400);
  transition: color var(--transition-base);
}

.doc-card:hover .doc-icon-wrapper i {
  color: white;
}

.doc-info {
  flex: 1;
}

.doc-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
  line-height: var(--line-height-tight);
  transition: color var(--transition-base);
}

.doc-card:hover .doc-title {
  color: var(--color-primary-500);
}

.doc-excerpt {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.doc-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-400);
}

.meta-item i {
  font-size: 0.75rem;
}

.doc-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  background: var(--color-bg-200);
  border-left: 1px solid var(--color-border);
  transition: all var(--transition-base);
  position: relative;
  z-index: 1;
}

.doc-card:hover .doc-arrow {
  background: var(--gradient-primary);
  border-left-color: transparent;
}

.doc-arrow i {
  font-size: 1rem;
  color: var(--color-text-400);
  transition: color var(--transition-base);
}

.doc-card:hover .doc-arrow i {
  color: white;
}

.dark .docs-index {
  background: var(--dark-color-bg);
}

.dark .hero-title,
.dark .category-title,
.dark .doc-title {
  color: var(--dark-color-text-primary);
}

.dark .hero-subtitle,
.dark .doc-excerpt,
.dark .meta-item {
  color: var(--dark-color-text-secondary);
}

.dark .doc-card {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
}

.dark .doc-card:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-xl), var(--dark-shadow-glow-md);
}

.dark .doc-icon-wrapper {
  background: var(--dark-color-bg-200);
}

.dark .doc-icon-wrapper i {
  color: var(--dark-color-text-400);
}

.dark .doc-arrow {
  background: var(--dark-color-bg-200);
  border-left-color: var(--dark-color-border);
}

.dark .doc-arrow i {
  color: var(--dark-color-text-400);
}

.dark .category-line {
  background: var(--dark-color-border);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .docs-grid {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .doc-card {
    flex-direction: column;
  }

  .doc-arrow {
    width: 100%;
    height: 3rem;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }

  .dark .doc-arrow {
    border-left: none;
    border-top-color: var(--dark-color-border);
  }
}
</style>
