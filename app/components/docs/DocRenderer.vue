<script setup lang="ts">
import { marked } from 'marked'
import { codeToHtml } from 'shiki'
import { ref, watch } from 'vue'

interface Props {
  content: string
}

const props = defineProps<Props>()
const renderedContent = ref('')

async function highlightCode(html: string): Promise<string> {
  // Match markdown code blocks: <pre><code class="language-xxx">...</code></pre>
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g
  const matches: { index: number; full: string; lang: string; code: string }[] = []
  let match

  while ((match = codeBlockRegex.exec(html)) !== null) {
    matches.push({ index: match.index, full: match[0], lang: match[1], code: match[2] })
  }

  if (matches.length === 0) return html

  // Highlight each block in parallel
  const highlighted = await Promise.all(
    matches.map(async (m) => {
      try {
        const decoded = m.code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
        const html = await codeToHtml(decoded, {
          lang: m.lang,
          theme: 'github-dark',
        })
        return { index: m.index, full: m.full, result: html }
      } catch {
        return null
      }
    }),
  )

  // Replace in reverse order to preserve indices
  let result = html
  for (const h of highlighted.reverse()) {
    if (h === null) continue
    result = result.slice(0, h.index) + h.result + result.slice(h.index + h.full.length)
  }

  return result
}

async function renderMarkdown() {
  if (!props.content) {
    renderedContent.value = ''
    return
  }

  const rawHtml = await marked.parse(props.content)

  try {
    renderedContent.value = await highlightCode(rawHtml)
  } catch {
    // Fallback: use plain HTML without highlighting
    renderedContent.value = rawHtml
  }
}

watch(() => props.content, renderMarkdown, { immediate: true })
</script>

<template>
  <article class="doc-renderer">
    <div v-html="renderedContent" />
  </article>
</template>

<style scoped>
.doc-renderer {
  color: var(--text);
  line-height: 1.75;
}

/* ── Shiki code blocks ──────────────────────────────────── */
:deep(.shiki) {
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: var(--r-card);
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
}
:deep(.shiki code) {
  font-family: var(--f-mono);
  background: none;
  padding: 0;
  color: inherit;
}

/* ── Inline code (not inside Shiki blocks) ──────────────── */
:deep(:not(.shiki) > code) {
  background: var(--surface-2);
  color: var(--primary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: var(--f-mono);
}

/* ── Headings ───────────────────────────────────────────── */
:deep(h1) {
  font-family: var(--f-display);
  font-size: 2rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  line-height: 1.25;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

:deep(h2) {
  font-family: var(--f-display);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
  color: var(--text);
}

:deep(h3) {
  font-family: var(--f-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  line-height: 1.4;
  color: var(--text);
}

/* ── Body ───────────────────────────────────────────────── */
:deep(p) {
  margin: 1rem 0;
  color: var(--text-secondary);
}

:deep(a) {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
}
:deep(a:hover) {
  text-decoration: underline;
}

:deep(strong) {
  font-weight: 600;
  color: var(--text);
}

:deep(ul),
:deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

:deep(li) {
  margin: 0.5rem 0;
}

:deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: var(--text-tertiary);
  font-style: italic;
}

/* ── Tables ─────────────────────────────────────────────── */
:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

:deep(th),
:deep(td) {
  padding: 10px 14px;
  border: 1px solid var(--border);
  text-align: left;
  font-size: 14px;
}

:deep(th) {
  background: var(--surface-2);
  font-weight: 600;
  color: var(--text);
}

/* ── Misc ───────────────────────────────────────────────── */
:deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

:deep(img) {
  max-width: 100%;
  border-radius: var(--r-card);
}
</style>
