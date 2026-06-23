<script setup lang="ts">
import DocRenderer from "../../components/docs/DocRenderer.vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const slug = route.params.slug as string;
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

interface DocResponse {
  success: boolean;
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category: string;
    isPublished: boolean;
    updatedAt: string;
    visibility?: string;
  };
}

const { data: doc, error } = await useFetch<DocResponse>(`/api/docs/${slug}`);

if (error.value || !doc.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: "Documentation page not found",
    fatal: true,
  });
}

const page = doc.value.data;

// Determine if doc is team-restricted
const isRestricted = computed(() => {
  if (page.visibility === "team") return true;
  const restrictedTerms = ["internal", "team", "private"];
  return restrictedTerms.some((term) => slug.includes(term));
});

// Show restricted gate if needed
const showRestrictedGate = computed(
  () => isRestricted.value && !isAuthenticated.value,
);

// TOC items — static for now (extracted from content headings at render time would need a computed)
const tocItems = [
  "Introduction",
  "The four rules",
  "Match the destination",
  "Don't ask permission",
  "Action weight",
  "Quick reference",
];
const activeToc = ref("The four rules");

// Helpful vote state
const helpfulVote = ref<"yes" | "no" | null>(null);

function voteHelpful(choice: "yes" | "no") {
  helpfulVote.value = choice;
}

// Relative time helper
function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
}

// Static author for demo (replace with page.author when available)
const author = { name: "Jay Patel", avatar: "" };

useHead({
  title: `${page.title} - OpenDS Documentation`,
  meta: [
    {
      name: "description",
      content:
        page.excerpt || `${page.title} - OpenDS Design System Documentation`,
    },
  ],
});
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-bg)">
    <!-- ========== HEADER ========== -->
    <header
      class="h-14 flex items-center gap-4 px-6 flex-shrink-0 border-b"
      style="
        border-color: var(--color-border);
        background: var(--color-surface);
      "
    >
      <!-- Team brand -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 w-60 flex-shrink-0 no-underline"
      >
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
          <circle
            cx="16"
            cy="16"
            r="7"
            fill="none"
            stroke="var(--color-primary)"
            stroke-width="2.4"
          />
          <circle cx="16" cy="16" r="2.5" fill="var(--color-primary)" />
        </svg>
        <span
          class="font-extrabold text-lg"
          style="
            font-family: var(--font-heading, &quot;Outfit&quot;, sans-serif);
            letter-spacing: -0.01em;
            color: var(--color-text-primary);
          "
          >OpenDS</span
        >
        <UBadge color="neutral" variant="soft" size="sm">docs</UBadge>
      </NuxtLink>

      <div class="flex-1 max-w-lg">
        <UInput
          size="sm"
          placeholder="Search docs…"
          leading-icon="i-lucide-search"
          trailing-icon="i-lucide-command"
          class="w-full"
        />
      </div>

      <div class="flex-1" />

      <!-- Nav -->
      <nav
        class="flex items-center gap-1 text-sm font-medium"
        style="color: var(--color-text-secondary)"
      >
        <NuxtLink
          to="/docs/components"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100 no-underline"
          style="color: var(--color-text-secondary)"
          >Components</NuxtLink
        >
        <NuxtLink
          to="/tokens"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100 no-underline"
          style="color: var(--color-text-secondary)"
          >Tokens</NuxtLink
        >
        <NuxtLink
          to="/docs"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100 no-underline"
          style="color: var(--color-primary); font-weight: 600"
          >Guidelines</NuxtLink
        >
      </nav>

      <div class="flex items-center gap-0.5">
        <UButton variant="ghost" size="sm" square
          ><UIcon name="i-lucide-sun" class="w-4 h-4"
        /></UButton>
        <UButton variant="ghost" size="sm" square
          ><UIcon name="i-lucide-github" class="w-4 h-4"
        /></UButton>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- ========== SIDEBAR ========== -->
      <DocsSidebar />

      <!-- ========== MAIN CONTENT ========== -->
      <main
        class="flex-1 overflow-y-auto px-16 py-12 min-w-0"
        style="max-width: 880px; margin-left: 256px"
      >
        <!-- Restricted gate -->
        <div
          v-if="showRestrictedGate"
          class="flex flex-col items-center justify-center py-16"
          style="
            background:
              radial-gradient(
                500px 280px at 50% 20%,
                rgba(42, 111, 219, 0.07),
                transparent 60%
              ),
              radial-gradient(
                400px 240px at 50% 100%,
                rgba(255, 107, 74, 0.06),
                transparent 60%
              );
          "
        >
          <div
            class="max-w-md w-full rounded-2xl border overflow-hidden"
            style="
              border-color: var(--color-border);
              background: var(--color-surface);
              box-shadow: var(--shadow-card);
            "
          >
            <!-- Decorative strip -->
            <div
              class="px-8 py-7 text-center border-b"
              style="
                border-color: var(--color-border);
                background: rgba(42, 111, 219, 0.08);
              "
            >
              <div
                class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style="background: var(--color-surface-elevated)"
              >
                <UIcon
                  name="i-lucide-lock"
                  class="w-6 h-6"
                  style="color: var(--color-primary)"
                />
              </div>
              <h2
                class="text-xl font-bold mb-2"
                style="color: var(--color-text-primary)"
              >
                This page is for team members
              </h2>
              <p
                class="text-sm max-w-xs mx-auto"
                style="color: var(--color-text-secondary)"
              >
                Brand voice, contributor playbooks and the token roadmap are
                visible to signed-in members of the Lumen workspace.
              </p>
            </div>

            <!-- Sign-in buttons -->
            <div class="px-8 py-6">
              <div class="flex flex-col gap-3">
                <UButton size="lg" block color="primary">
                  <template #leading>
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                      />
                    </svg>
                  </template>
                  Sign in with GitHub
                </UButton>
                <UButton size="lg" block variant="outline">
                  <template #leading>
                    <svg class="w-4 h-4" viewBox="0 0 16 16">
                      <path
                        fill="#4285F4"
                        d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.9h4.2c-.2 1-.7 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8z"
                      />
                      <path
                        fill="#34A853"
                        d="M8 16c2.2 0 4-.7 5.3-2l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H.9v2C2.2 14.1 4.9 16 8 16z"
                      />
                      <path
                        fill="#FBBC04"
                        d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5v-2H.9C.3 5.7 0 6.8 0 8s.3 2.3.9 3.5l2.6-2z"
                      />
                      <path
                        fill="#EA4335"
                        d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .9 10.2 0 8 0 4.9 0 2.2 1.9.9 4.5l2.6 2C4.2 4.6 5.9 3.2 8 3.2z"
                      />
                    </svg>
                  </template>
                  Sign in with Google
                </UButton>
                <UButton size="lg" block variant="ghost">
                  <template #leading>
                    <UIcon name="i-lucide-mail" class="w-4 h-4" />
                  </template>
                  Use a magic link
                </UButton>
              </div>

              <!-- Info note -->
              <div
                class="mt-6 p-4 rounded-xl"
                style="background: var(--color-surface-2)"
              >
                <p class="text-sm" style="color: var(--color-text-secondary)">
                  <strong style="color: var(--color-text)"
                    >Not on the team?</strong
                  >
                  Most of the system is fully public — components, tokens, and
                  guidelines.
                  <NuxtLink
                    to="/docs"
                    class="text-blue-600 hover:underline font-medium"
                    style="color: var(--color-primary)"
                  >
                    Browse the public docs →
                  </NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <!-- Breadcrumb -->
          <div
            class="flex items-center gap-1.5 text-xs font-medium mb-6"
            style="color: var(--color-text-tertiary)"
          >
            <span>Guidelines</span>
            <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
            <span style="color: var(--color-text-secondary)">{{
              page.title
            }}</span>
          </div>

          <!-- H1 Title -->
          <h1
            class="mb-3"
            style="
              font-size: 48px;
              font-weight: 800;
              letter-spacing: -0.03em;
              line-height: 1.05;
              color: var(--color-text-primary);
              font-family: var(--font-heading, &quot;Outfit&quot;, sans-serif);
            "
          >
            {{ page.title }}
          </h1>

          <!-- Author line -->
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
              style="background: var(--color-primary); color: white"
            >
              {{ author.name.charAt(0) }}
            </div>
            <div class="text-sm" style="color: var(--color-text-secondary)">
              <span class="font-semibold" style="color: var(--color-text)">{{
                author.name
              }}</span>
              · Updated {{ timeAgo(page.updatedAt) }} · 6 min read
            </div>
          </div>

          <!-- Excerpt / Intro -->
          <p
            v-if="page.excerpt"
            class="mb-7"
            style="
              font-size: 19px;
              line-height: 1.6;
              color: var(--color-text-secondary);
            "
          >
            {{ page.excerpt }}
          </p>

          <!-- ========== MARKDOWN CONTENT ========== -->
          <ClientOnly>
            <DocRenderer :content="page.content" class="doc-content" />
            <template #fallback>
              <div class="doc-fallback">{{ page.content }}</div>
            </template>
          </ClientOnly>

          <!-- ========== FOOTER ========== -->
          <div
            class="mt-14 pt-6 border-t flex items-center justify-between"
            style="border-color: var(--color-border)"
          >
            <span class="text-sm" style="color: var(--color-text-tertiary)"
              >Was this page helpful?</span
            >
            <div class="flex gap-2">
              <UButton
                variant="outline"
                size="sm"
                :class="helpfulVote === 'no' ? 'ring-2 ring-danger' : ''"
                :disabled="!!helpfulVote"
                @click="voteHelpful('no')"
              >
                👎 Not really
              </UButton>
              <UButton
                variant="outline"
                size="sm"
                :class="helpfulVote === 'yes' ? 'ring-2 ring-primary' : ''"
                :disabled="!!helpfulVote"
                @click="voteHelpful('yes')"
              >
                👍 Yes
              </UButton>
            </div>
          </div>

          <!-- NavCards -->
          <div class="flex gap-3 mt-6">
            <div
              class="flex-1 border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary"
              style="
                border-color: var(--color-border);
                border-radius: var(--r-card);
              "
            >
              <div
                class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2"
                style="
                  color: var(--color-text-tertiary);
                  justify-content: flex-start;
                "
              >
                <UIcon name="i-lucide-chevron-left" class="w-3 h-3" />
                Previous
              </div>
              <div
                class="font-semibold text-sm"
                style="color: var(--color-text)"
              >
                Writing for inputs
              </div>
            </div>
            <div
              class="flex-1 border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary"
              style="
                border-color: var(--color-border);
                border-radius: var(--r-card);
              "
            >
              <div
                class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2"
                style="
                  color: var(--color-text-tertiary);
                  justify-content: flex-end;
                "
              >
                Next
                <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
              </div>
              <div
                class="font-semibold text-sm"
                style="color: var(--color-text); text-align: right"
              >
                Tone & voice
              </div>
            </div>
          </div>
        </template>
      </main>

      <!-- ========== TOC SIDEBAR ========== -->
      <aside
        class="w-60 flex-shrink-0 overflow-y-auto py-12 pr-6 hidden xl:block"
      >
        <div
          class="text-[11px] font-bold uppercase tracking-wider mb-3"
          style="color: var(--color-text-tertiary)"
        >
          On this page
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in tocItems"
            :key="item"
            class="block w-full text-left text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            :style="
              activeToc === item
                ? {
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                  }
                : {
                    color: 'var(--color-text-secondary)',
                  }
            "
            @click="activeToc = item"
          >
            {{ item }}
          </button>
        </nav>

        <!-- Quick links -->
        <div
          class="mt-8 pt-6 border-t"
          style="border-color: var(--color-border)"
        >
          <div
            class="text-[11px] font-bold uppercase tracking-wider mb-3"
            style="color: var(--color-text-tertiary)"
          >
            Quick links
          </div>
          <div class="space-y-2">
            <NuxtLink
              to="/docs"
              class="flex items-center gap-2 text-xs transition-colors hover:text-primary"
              style="color: var(--color-text-secondary)"
            >
              <UIcon name="i-lucide-book" class="w-3.5 h-3.5" />
              All guidelines
            </NuxtLink>
            <NuxtLink
              to="/docs/components"
              class="flex items-center gap-2 text-xs transition-colors hover:text-primary"
              style="color: var(--color-text-secondary)"
            >
              <UIcon name="i-lucide-box" class="w-3.5 h-3.5" />
              Components
            </NuxtLink>
            <NuxtLink
              to="/tokens"
              class="flex items-center gap-2 text-xs transition-colors hover:text-primary"
              style="color: var(--color-text-secondary)"
            >
              <UIcon name="i-lucide-palette" class="w-3.5 h-3.5" />
              Design tokens
            </NuxtLink>
          </div>
        </div>
      </aside>
      <!-- Footer bar: what user can still read -->
      <div
        v-if="showRestrictedGate"
        class="border-t px-6 py-4 flex items-center gap-6 text-sm"
        style="
          border-color: var(--color-border);
          background: var(--color-bg-elevated);
        "
      >
        <span class="font-semibold" style="color: var(--color-text-secondary)">
          You can still read:
        </span>
        <span
          class="flex items-center gap-1.5"
          style="color: var(--color-text-tertiary)"
        >
          <UIcon name="i-lucide-layout" class="w-4 h-4" />
          48 components
        </span>
        <span
          class="flex items-center gap-1.5"
          style="color: var(--color-text-tertiary)"
        >
          <UIcon name="i-lucide-palette" class="w-4 h-4" />
          218 tokens
        </span>
        <span
          class="flex items-center gap-1.5"
          style="color: var(--color-text-tertiary)"
        >
          <UIcon name="i-lucide-file-text" class="w-4 h-4" />
          29 public guidelines
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== MARKDOWN CONTENT TYPOGRAPHY ========== */
/* Override DocRenderer prose styles to match sweet-salmon design */

.doc-content :deep(h1),
.doc-content :deep(h2),
.doc-content :deep(h3) {
  font-family: var(--font-heading, "Outfit", sans-serif);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.doc-content :deep(h1) {
  font-size: 2.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0.75rem;
  line-height: 1.05;
}

.doc-content :deep(h2) {
  font-size: 1.625rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 0.875rem;
  line-height: 1.2;
}

.doc-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.doc-content :deep(p) {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text);
  margin-bottom: 1.125rem;
}

.doc-content :deep(code):not(.doc-content :deep(pre code)) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--color-surface-2);
  color: var(--color-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.doc-content :deep(pre) {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--r-card);
  padding: 1rem;
  overflow-x: auto;
  margin: 1.25rem 0;
}

.doc-content :deep(pre code) {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background: transparent;
  padding: 0;
}

.doc-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding: 0.75rem 1rem;
  margin: 1.25rem 0;
  background: var(--color-primary-soft);
  border-radius: 0 var(--r-card) var(--r-card) 0;
}

.doc-content :deep(blockquote p) {
  color: var(--color-text-secondary);
  font-style: italic;
  margin-bottom: 0;
}

.doc-content :deep(ul),
.doc-content :deep(ol) {
  margin: 0.75rem 0 1rem 1.25rem;
  padding-left: 0.25rem;
}

.doc-content :deep(li) {
  margin: 0.375rem 0;
  line-height: 1.7;
  color: var(--color-text);
}

.doc-content :deep(a) {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.1em;
}

.doc-content :deep(a:hover) {
  text-decoration-thickness: 2px;
}

.doc-content :deep(strong) {
  font-weight: 700;
  color: var(--color-text-primary);
}

.doc-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  border: 1px solid var(--color-border);
  border-radius: var(--r-card);
  overflow: hidden;
}

.doc-content :deep(th) {
  background: var(--color-surface-2);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
  padding: 0.625rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.doc-content :deep(td) {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.doc-content :deep(tr:last-child td) {
  border-bottom: none;
}

.doc-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
}

/* DocRenderer prose base — reset to avoid double-styling */
.doc-content :deep(.prose) {
  max-width: none;
  color: unset;
}

/* Fallback plain text */
.doc-fallback {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text);
  white-space: pre-wrap;
}
</style>
