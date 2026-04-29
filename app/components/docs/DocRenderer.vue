<script setup lang="ts">
import { marked } from "marked";
import { codeToHtml } from "shiki";
import { ref, watch, onMounted } from "vue";

interface Props {
  content: string;
}

const props = defineProps<Props>();
const renderedContent = ref("");

async function highlightCodeBlocks(html: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const codeBlocks = doc.querySelectorAll("pre code");

  for (const block of Array.from(codeBlocks)) {
    const code = block.textContent || "";
    const langClass = block.className.match(/language-(\w+)/);
    const lang = langClass ? langClass[1] : "text";

    try {
      const highlighted = await codeToHtml(code, {
        lang,
        theme: "github-dark",
      });
      const wrapper = document.createElement("div");
      wrapper.innerHTML = highlighted;
      const pre = wrapper.querySelector("pre");
      if (pre) {
        block.parentElement?.replaceWith(pre);
      }
    } catch {
      // Fallback: keep original
    }
  }

  return doc.body.innerHTML;
}

async function renderMarkdown() {
  if (!props.content) {
    renderedContent.value = "";
    return;
  }

  const rawHtml = await marked.parse(props.content);
  if (typeof window !== "undefined") {
    renderedContent.value = await highlightCodeBlocks(rawHtml);
  } else {
    renderedContent.value = rawHtml;
  }
}

watch(() => props.content, renderMarkdown, { immediate: true });
onMounted(renderMarkdown);
</script>

<template>
  <article class="prose dark:prose-invert max-w-none">
    <div v-html="renderedContent" />
  </article>
</template>

<style scoped>
:deep(.shiki) {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
}

:deep(pre) {
  margin: 1.5rem 0;
  background: #1e293b;
  border-radius: 0.5rem;
  overflow-x: auto;
}

:deep(code:not(.shiki code)) {
  background: #f1f5f9;
  color: #e11d48;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: "Monaco", "Menlo", "Courier New", monospace;
}

.dark :deep(code:not(.shiki code)) {
  background: #334155;
  color: #fbbf24;
}

:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  line-height: 1.25;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark :deep(h1) {
  border-bottom-color: #334155;
  color: #f1f5f9;
}

:deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
  color: #0f172a;
}

.dark :deep(h2) {
  color: #f1f5f9;
}

:deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  line-height: 1.4;
  color: #1e293b;
}

.dark :deep(h3) {
  color: #e2e8f0;
}

:deep(p) {
  margin: 1rem 0;
  line-height: 1.75;
  color: #334155;
}

.dark :deep(p) {
  color: #cbd5e1;
}

:deep(a) {
  color: #1d70b8;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.1em;
}

:deep(a:hover) {
  color: #003078;
  text-decoration-thickness: 3px;
}

.dark :deep(a) {
  color: #60a5fa;
}

.dark :deep(a:hover) {
  color: #93c5fd;
}

:deep(strong) {
  font-weight: 600;
  color: #0f172a;
}

.dark :deep(strong) {
  color: #e2e8f0;
}

:deep(ul),
:deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(li) {
  margin: 0.5rem 0;
  color: #334155;
}

.dark :deep(li) {
  color: #cbd5e1;
}

:deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #475569;
  font-style: italic;
}

.dark :deep(blockquote) {
  color: #94a3b8;
  border-left-color: #60a5fa;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

:deep(th),
:deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

.dark :deep(th),
.dark :deep(td) {
  border-color: #334155;
}

:deep(th) {
  background: #f8fafc;
  font-weight: 600;
  color: #0f172a;
}

.dark :deep(th) {
  background: #1e293b;
  color: #f1f5f9;
}

:deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

.dark :deep(hr) {
  border-top-color: #334155;
}
</style>
