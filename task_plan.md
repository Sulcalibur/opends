# Task Plan: OpenDS MVP v1.0 + Features 5-8

## Goal

Complete critical gaps for MVP v1.0, then implement features 5-8 (Code Generation, Search, Collaboration, Analytics) to reach feature parity with Zeroheight for Penpot users.

## Completed Phases

### Phase 1-4: MVP v1.0 ✅ COMPLETE

- Foundation fixes, user CRUD, component workflows, Vue codegen basics
- All 15 tasks completed successfully

---

## Active Phase: Features 5-8

### Phase 5: Code Generation Enhancement (Priority: High)

**Goal:** Make code generation production-ready with multiple output formats

- [ ] **5.1** Add React component code generation
  - Create React templates (functional components, hooks)
  - Add framework selector in UI
  - Update `server/utils/codeGenerator.ts`
- [ ] **5.2** Add Svelte component code generation
  - Create Svelte templates (.svelte files)
  - Add to framework selector
- [ ] **5.3** Add CSS/SCSS generation from design tokens
  - Generate CSS variables from tokens
  - Generate SCSS mixins and variables
  - Export as downloadable files
- [ ] **5.4** Add copy-to-clipboard functionality
  - One-click copy for generated code
  - Toast notification on success
- [ ] **5.5** Add syntax highlighting
  - Use Shiki or Prism for code display
  - Support Vue, React, Svelte, CSS, SCSS

### Phase 6: Global Search (Priority: Critical)

**Goal:** Universal search across all content types

- [ ] **6.1** Design search architecture
  - Database full-text search vs. dedicated search index (Elasticsearch/Typesense)
  - For MVP: PostgreSQL full-text search
- [ ] **6.2** Create search index tables
  - `search_index` table with content type, title, content, tokens
  - Triggers to auto-update on insert/update/delete
- [ ] **6.3** Build search API endpoint
  - `GET /api/search?q=query&filters=type`
  - Support filtering by type (token, component, doc)
  - Pagination support
- [ ] **6.4** Create search UI component
  - Global search bar in navbar (Cmd/Ctrl+K shortcut)
  - Dropdown with instant results
  - Results page with filters
- [ ] **6.5** Add search result previews
  - Show context around matched text
  - Highlight matching terms
  - Direct links to content

### Phase 7: Team Collaboration (Priority: Medium)

**Goal:** Enable teams to collaborate on design system documentation

- [ ] **7.1** Add comments system
  - Comments on components
  - Comments on documentation pages
  - Threaded replies
  - Comment notifications
- [ ] **7.2** Create comments database schema
  - `comments` table (id, content, author_id, target_type, target_id, parent_id, created_at)
  - `comment_notifications` table
- [ ] **7.3** Build comments UI
  - Inline comments on component pages
  - Sidebar comment threads
  - Mention users (@username)
- [ ] **7.4** Add component review workflow
  - Draft → Review → Approved → Published states
  - Review requests (assign to specific users)
  - Approval system with comments
- [ ] **7.5** Add activity feed
  - Recent changes log
  - Who edited what and when
  - Filter by user/content type

### Phase 8: Analytics & Insights (Priority: Low-Medium)

**Goal:** Track design system adoption and usage

- [ ] **8.1** Add component usage tracking
  - Track component page views
  - Track code generation downloads
  - Store in `analytics_events` table
- [ ] **8.2** Create analytics dashboard
  - Most viewed components
  - Popular design tokens
  - Search queries
  - Daily/weekly/monthly views
- [ ] **8.3** Add usage API for external tracking
  - REST endpoint to report component usage from projects
  - JavaScript snippet for tracking
  - Integration with npm packages
- [ ] **8.4** Generate usage reports
  - Export as CSV/PDF
  - Scheduled email reports (future)
- [ ] **8.5** Add health metrics
  - Components without documentation
  - Unused design tokens
  - Outdated component versions

---

## Implementation Order

**Recommended sequence:**

1. **Phase 6 (Search)** - Critical for usability, affects all other features
2. **Phase 5 (Code Gen)** - High value, builds on existing foundation
3. **Phase 7 (Collaboration)** - Enables team workflows
4. **Phase 8 (Analytics)** - Nice-to-have for insights

---

## Key Questions

1. **Search technology:** PostgreSQL FTS (simpler) or Typesense (better results)?
2. **Comments storage:** Inline vs. separate system?
3. **Analytics granularity:** Track every view or aggregate daily?
4. **Multi-tenancy prep:** Design collaboration features for future SaaS?

---

## Decisions Made

- **Framework support:** Add React and Svelte to match Zeroheight multi-framework support
- **Search approach:** Start with PostgreSQL FTS, migrate to Typesense if needed
- **Collaboration scope:** Comments + basic review workflow (approvals deferred to v1.5)
- **Analytics approach:** Passive tracking first, active project integration later

---

## Status

**Currently in Phase 5** - Enhancing code generation

## Progress Tracker

### Phase 5: Code Generation (0/5 complete)

- [ ] 5.1 React code generation
- [ ] 5.2 Svelte code generation
- [ ] 5.3 CSS/SCSS generation
- [ ] 5.4 Copy-to-clipboard
- [ ] 5.5 Syntax highlighting

### Phase 6: Search (0/5 complete)

- [ ] 6.1 Search architecture design
- [ ] 6.2 Search index tables
- [ ] 6.3 Search API endpoint
- [ ] 6.4 Search UI component
- [ ] 6.5 Search result previews

### Phase 7: Collaboration (0/5 complete)

- [ ] 7.1 Comments system design
- [ ] 7.2 Comments database schema
- [ ] 7.3 Comments UI
- [ ] 7.4 Review workflow
- [ ] 7.5 Activity feed

### Phase 8: Analytics (0/5 complete)

- [ ] 8.1 Usage tracking
- [ ] 8.2 Analytics dashboard
- [ ] 8.3 Usage API
- [ ] 8.4 Usage reports
- [ ] 8.5 Health metrics

**Total: 0/20 tasks complete (Features 5-8)**
