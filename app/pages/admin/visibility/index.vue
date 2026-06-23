<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

interface VisibilityRow {
  page: string
  public: boolean
  team: boolean
  admin: boolean
  comments: boolean
}

const pages = ref<VisibilityRow[]>([
  { page: 'Home', public: true, team: true, admin: true, comments: false },
  { page: 'Component list', public: true, team: true, admin: true, comments: false },
  { page: 'Component detail', public: true, team: true, admin: true, comments: true },
  { page: 'Tokens · Color', public: true, team: true, admin: true, comments: false },
  { page: 'Tokens · Typography', public: true, team: true, admin: true, comments: false },
  { page: 'Tokens · Spacing', public: true, team: true, admin: true, comments: false },
  { page: 'Docs · Getting started', public: true, team: true, admin: true, comments: false },
  { page: 'Docs · Guidelines', public: false, team: true, admin: true, comments: true },
  { page: 'Docs · Internal playbook', public: false, team: true, admin: true, comments: false },
  { page: 'Changelog', public: true, team: true, admin: true, comments: false },
  { page: 'Search (⌘K)', public: false, team: true, admin: true, comments: false },
])

function toggle(row: VisibilityRow, key: 'public' | 'team' | 'admin' | 'comments') {
  row[key] = !row[key]
}

useHead({ title: 'Visibility & Access — Admin' })
</script>

<template>
  <div class="vis-page">
    <div class="vis-header">
      <div>
        <h1 class="vis-title">Visibility & Access</h1>
        <p class="vis-subtitle">Control who can see each page and whether comments are enabled.</p>
      </div>
    </div>

    <div class="vis-table">
      <div class="vis-table-head">
        <span>Page</span>
        <span class="vis-col-center">Public</span>
        <span class="vis-col-center">Team</span>
        <span class="vis-col-center">Admin</span>
        <span class="vis-col-center">Comments</span>
      </div>

      <div v-for="row in pages" :key="row.page" class="vis-table-row">
        <span class="vis-page-name">{{ row.page }}</span>

        <span class="vis-col-center">
          <button class="vis-toggle" :class="{ on: row.public }" @click="toggle(row, 'public')">
            <span class="vis-toggle-knob" />
          </button>
        </span>

        <span class="vis-col-center">
          <button class="vis-toggle" :class="{ on: row.team }" @click="toggle(row, 'team')">
            <span class="vis-toggle-knob" />
          </button>
        </span>

        <span class="vis-col-center">
          <button class="vis-toggle on" disabled>
            <span class="vis-toggle-knob" />
          </button>
        </span>

        <span class="vis-col-center">
          <button class="vis-toggle" :class="{ on: row.comments }" @click="toggle(row, 'comments')">
            <span class="vis-toggle-knob" />
          </button>
        </span>
      </div>
    </div>

    <div class="vis-summary">
      <div class="vis-summary-card">
        <div class="vis-summary-n">{{ pages.filter(p => p.public).length }}</div>
        <div class="vis-summary-l">Public pages</div>
      </div>
      <div class="vis-summary-card">
        <div class="vis-summary-n">{{ pages.filter(p => p.team && !p.public).length }}</div>
        <div class="vis-summary-l">Team-only pages</div>
      </div>
      <div class="vis-summary-card">
        <div class="vis-summary-n">{{ pages.filter(p => p.comments).length }}</div>
        <div class="vis-summary-l">With comments</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-page { max-width: 1000px; }

.vis-header {
  margin-bottom: 24px;
}

.vis-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.vis-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.vis-table {
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
  background: var(--surface);
}

.vis-table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 12px 20px;
  background: var(--surface-2);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.vis-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 14px 20px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 13.5px;
}
.vis-table-row:last-child { border-bottom: none; }
.vis-table-row:hover { background: var(--surface-2); }

.vis-page-name {
  font-weight: 600;
  color: var(--text);
}

.vis-col-center {
  display: flex;
  justify-content: center;
}

.vis-toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-micro);
}
.vis-toggle.on { background: var(--primary); }
.vis-toggle:disabled { opacity: 0.5; cursor: default; }
.vis-toggle-knob {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: white;
  transition: transform var(--duration-micro);
}
.vis-toggle.on .vis-toggle-knob { transform: translateX(16px); }

/* ── Tablet ── */
@media (max-width: 834px) {
  .vis-table-head, .vis-table-row { grid-template-columns: 140px repeat(4, 1fr); }
  .vis-summary { grid-template-columns: repeat(2, 1fr); }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .vis-table-head, .vis-table-row { grid-template-columns: 100px repeat(4, 1fr); font-size: 10px; padding: 10px 12px; }
  .vis-summary { grid-template-columns: 1fr; }
}

.vis-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.vis-summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 20px;
  text-align: center;
}

.vis-summary-n {
  font-family: var(--f-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.vis-summary-l {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  margin-top: 4px;
}
</style>
