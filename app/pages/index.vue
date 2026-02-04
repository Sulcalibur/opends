<script setup lang="ts">
import { computed } from "vue";

const { data: settingsData, refresh: refreshSettings } = await useFetch(
  "/api/settings/public",
  {
    key: "public-settings",
  },
).catch(() => ({ data: ref(null), refresh: () => {} }));
const settings = computed(() => settingsData.value?.settings || {});

const { data: docs } = await useFetch("/api/docs", {
  query: { isPublished: 1 },
}).catch(() => ({ data: ref(null) }));

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
    grouped[cat].sort((a: any, b: any) => a.title.localeCompare(b.title));
  });

  return grouped;
});

const categories = computed(() => Object.keys(pagesByCategory.value).sort());

useHead({
  title: computed(
    () => `${settings.value.organization_name || "OpenDS"} Design System`,
  ),
  meta: [
    {
      name: "description",
      content: "Design system documentation and guidelines.",
    },
  ],
});
</script>

<template>
  <div class="ds-home">
    <AnimatedGradientBackground class="hero-gradient">
      <div class="hero-content">
        <div class="floating-shapes">
          <div class="shape shape-1"/>
          <div class="shape shape-2"/>
          <div class="shape shape-3"/>
        </div>

        <div class="hero-text fade-up">
          <h1 class="hero-title">
            {{
              settings.home_hero?.title ||
              (settings.organization_name
                ? settings.organization_name + " Design System"
                : "OpenDS Design System")
            }}
          </h1>
          <p class="hero-subtitle">
            {{
              settings.home_hero?.subtitle ||
              "Use this design system to build consistent, accessible, and high-quality digital services."
            }}
          </p>

          <div class="hero-actions">
            <NuxtLink to="/docs/components" class="hero-cta primary">
              <i class="pi pi-box"/>
              <span>Explore Components</span>
            </NuxtLink>
            <NuxtLink to="/tokens" class="hero-cta secondary">
              <i class="pi pi-palette"/>
              <span>Design Tokens</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>

    <main class="container mx-auto max-w-7xl px-6 py-20">
      <AnimatedCard variant="elevated" class="quick-links-section">
        <template #header>
          <div class="card-header-title">
            <i class="pi pi-bolt"/>
            Get Started
          </div>
        </template>
        <template #default>
          <div class="quick-links-grid">
            <NuxtLink
              to="/docs/components"
              class="quick-link-item hover-lift stagger-1"
            >
              <div class="link-icon blue">
                <i class="pi pi-th-large"/>
              </div>
              <div class="link-content">
                <h3 class="link-title">Components</h3>
                <p class="link-description">Browse component library.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/tokens" class="quick-link-item hover-lift stagger-2">
              <div class="link-icon indigo">
                <i class="pi pi-palette"/>
              </div>
              <div class="link-content">
                <h3 class="link-title">Design Tokens</h3>
                <p class="link-description">Colors, spacing, and typography.</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin" class="quick-link-item hover-lift stagger-3">
              <div class="link-icon lavender">
                <i class="pi pi-cog"/>
              </div>
              <div class="link-content">
                <h3 class="link-title">Admin</h3>
                <p class="link-description">Manage settings and content.</p>
              </div>
            </NuxtLink>
          </div>
        </template>
      </AnimatedCard>

      <div
        v-for="category in categories"
        :key="category"
        class="docs-section fade-up"
        :class="`stagger-${Math.floor(Math.random() * 3) + 1}`"
      >
        <h2 class="category-title">
          <span class="category-text">{{ category }}</span>
          <div class="category-line"/>
        </h2>

        <div class="docs-grid">
          <NuxtLink
            v-for="page in pagesByCategory[category]"
            :key="page.slug"
            :to="`/docs/${page.slug}`"
            class="doc-card hover-lift card-gradient-border"
          >
            <div class="doc-card-content">
              <div class="doc-icon-wrapper">
                <i class="pi pi-file text-xl"/>
              </div>
              <div class="doc-info">
                <h3
                  class="doc-title"
                  :class="`stagger-${(page.slug.length % 3) + 1}`"
                >
                  {{ page.title }}
                </h3>
                <p class="doc-excerpt line-clamp-2">
                  {{ page.excerpt || "No description available." }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container mx-auto max-w-7xl px-6">
        <div class="footer-content">
          <p class="footer-text">
            &copy; {{ new Date().getFullYear() }}
            {{ settings.organization_name || "OpenDS" }}. All rights reserved.
          </p>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
            <a href="#" class="footer-link">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.ds-home {
  min-height: 100vh;
  background-color: var(--color-bg);
  overflow-x: hidden;
}

/* Animated Gradient Background */
.hero-gradient {
  position: relative;
  padding: 120px 0 100px;
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

/* Floating Shapes */
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

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 4rem;
  font-weight: var(--font-weight-extrabold);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: fade-up 0.8s var(--easing-out);
}

.hero-subtitle {
  font-size: 1.375rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto 2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: fade-up 1s var(--easing-out) 0.2s both;
}

/* Hero CTAs */
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

.hero-cta.secondary {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hero-cta i {
  font-size: 1.25rem;
}

/* Quick Links Section */
.quick-links-section {
  margin-top: -60px;
  margin-bottom: 4rem;
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.quick-link-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-slow);
  border: 2px solid var(--color-border-light);
}

.quick-link-item:hover {
  border-color: var(--color-primary-200);
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.link-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.link-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.link-icon.indigo {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.link-icon.lavender {
  background: linear-gradient(135deg, #a5b4fc 0%, #9ca3af 100%);
}

.link-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 25rem 0.5rem 0;
}

.link-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Documentation Sections */
.docs-section {
  margin-bottom: 4rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 2rem;
  position: relative;
}

.category-text {
  position: relative;
  z-index: 1;
}

.category-line {
  flex: 1;
  height: 2px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
}

/* Docs Grid */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.doc-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-slow);
  position: relative;
  overflow: hidden;
}

.doc-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

.doc-card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
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
  background: var(--color-primary-500);
}

.doc-icon-wrapper i {
  color: var(--color-text-400);
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
}

/* Footer */
.footer {
  background: var(--color-bg-secondary);
  border-top: 2px solid var(--color-border-light);
  margin-top: 6rem;
  padding: 4rem 0;
}

.footer-content {
  text-align: center;
}

.footer-text {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.footer-link {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: color var(--transition-base);
}

.footer-link:hover {
  color: var(--color-primary-500);
  text-decoration: underline;
}

/* Dark Mode */
.dark .ds-home {
  background: var(--dark-color-bg);
}

.dark .hero-title,
.dark .category-title,
.dark .link-title,
.dark .doc-title {
  color: var(--dark-color-text-primary);
  text-shadow: none;
}

.dark .hero-subtitle,
.dark .link-description,
.dark .doc-excerpt,
.dark .footer-text {
  color: var(--dark-color-text-secondary);
}

.dark .quick-link-item {
  background: var(--dark-color-bg-100);
  border-color: var(--dark-color-border-200);
}

.dark .quick-link-item:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-xl), var(--dark-shadow-glow-sm);
}

.dark .doc-card {
  background: var(--dark-color-surface);
  border: none;
}

.dark .doc-card:hover {
  box-shadow: var(--shadow-xl), var(--dark-shadow-glow-sm);
}

.dark .doc-icon-wrapper {
  background: linear-gradient(
    135deg,
    var(--dark-color-bg-200) 0%,
    var(--dark-color-bg-100) 100%
  );
}

.dark .doc-icon-wrapper i {
  color: var(--dark-color-text-400);
}

.dark .category-line {
  background: var(--dark-color-border);
}

.dark .footer {
  background: var(--dark-color-bg-100);
  border-top-color: var(--dark-color-border);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .quick-links-grid,
  .docs-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
