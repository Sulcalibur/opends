# OpenDS Features 5-8 Design Document

**Date:** 2026-03-12  
**Status:** Draft  
**Target:** Zeroheight feature parity for Penpot users

---

## Overview

After completing MVP v1.0, we need to implement features 5-8 to achieve feature parity with Zeroheight:

| Feature          | Zeroheight Equivalent        | OpenDS Implementation           |
| ---------------- | ---------------------------- | ------------------------------- |
| 5. Code Snippets | Multi-framework code display | Vue + React + Svelte generation |
| 6. Search        | Global search across content | PostgreSQL full-text search     |
| 7. Collaboration | Comments, reviews, approvals | Comments + review workflow      |
| 8. Analytics     | Component adoption tracking  | Usage tracking + dashboard      |

---

## Feature 5: Enhanced Code Generation

### Problem

MVP has basic Vue code generation. Zeroheight displays code in multiple frameworks and makes it easy to copy/use.

### Solution

Add React and Svelte support with better UX.

### Architecture

```
Code Generation Flow:
Component Definition → Template Engine → Generated Code → UI Display
                           ↓
                    Vue Template
                    React Template
                    Svelte Template
                    CSS Template
                    SCSS Template
```

### Components

#### 5.1 React Code Generation

**New Files:**

- `server/templates/react/component.tsx.template`
- `server/templates/react/hook.ts.template`
- `server/templates/react/index.ts`

**Template Variables:**

- `{{componentName}}` - PascalCase component name
- `{{props}}` - TypeScript interface for props
- `{{slots}}` - React children handling
- `{{styles}}` - CSS-in-JS or className

**Output Example:**

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
}: ButtonProps) {
  return (
    <button className={`btn btn--${variant} btn--${size}`}>{children}</button>
  );
}
```

#### 5.2 Svelte Code Generation

**New Files:**

- `server/templates/svelte/component.svelte.template`
- `server/templates/svelte/index.ts`

**Output Example:**

```svelte
<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<button class="btn btn--{variant} btn--{size}">
  <slot />
</button>
```

#### 5.3 CSS/SCSS Generation from Tokens

**New File:** `server/utils/tokenCssGenerator.ts`

**Functionality:**

- Convert design tokens to CSS custom properties
- Generate SCSS variables and mixins
- Group by token category (colors, spacing, typography)

**Output Example (CSS):**

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}
```

#### 5.4 Copy-to-Clipboard

**Component:** `app/components/ui/CodeBlock.vue`

**Features:**

- Copy button with icon
- Toast notification on success
- Keyboard shortcut (Cmd/Ctrl+C when focused)

#### 5.5 Syntax Highlighting

**Library:** Shiki (works well with Vue/Nuxt)

**Component:** Update `CodeBlock.vue` with Shiki integration

**Themes:**

- Light: GitHub Light
- Dark: GitHub Dark
- Match site theme

### API Changes

**Update:** `server/api/components/[id]/generate.post.ts`

**Request Body:**

```json
{
  "framework": "vue" | "react" | "svelte",
  "includeStyles": true,
  "styleFormat": "css" | "scss" | "css-in-js"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "component": "<generated code>",
    "styles": "<generated styles>",
    "usage": "<usage example>"
  }
}
```

---

## Feature 6: Global Search

### Problem

Users can't find content across tokens, components, and documentation.

### Solution

PostgreSQL full-text search with unified search interface.

### Architecture

```
Search Flow:
User Query → Search API → PostgreSQL FTS → Rank Results → Return
                ↓
        Searches: tokens.name
                 tokens.description
                 components.name
                 components.description
                 docs.title
                 docs.content
```

### Database Design

#### Search Index Table

```sql
CREATE TABLE search_index (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'token', 'component', 'doc'
  content_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  search_vector tsvector,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_content_type ON search_index(content_type);
```

#### Auto-Update Triggers

```sql
-- Trigger function to update search_index on token changes
CREATE OR REPLACE FUNCTION update_token_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'token',
      NEW.id,
      NEW.name,
      NEW.description,
      to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, ''))
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE search_index
    SET title = NEW.name,
        content = NEW.description,
        search_vector = to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, '')),
        updated_at = NOW()
    WHERE content_type = 'token' AND content_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'token' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER token_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON tokens
FOR EACH ROW EXECUTE FUNCTION update_token_search_index();
```

### API Design

**Endpoint:** `GET /api/search`

**Query Parameters:**

- `q` (required): Search query string
- `type` (optional): Filter by type ('token', 'component', 'doc')
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "component",
        "id": 123,
        "title": "Button",
        "excerpt": "Primary action button component with variants...",
        "url": "/docs/components/button",
        "highlight": "Primary action <mark>button</mark> component"
      }
    ],
    "meta": {
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
}
```

### UI Components

#### Global Search Bar

**Location:** Navbar (right side)

**Features:**

- Cmd/Ctrl+K keyboard shortcut
- Input with search icon
- Loading state
- Clear button

#### Search Dropdown (Instant Results)

**Components:**

- Grouped by type (Tokens, Components, Docs)
- Max 5 results per type
- Show "View all results" link
- Keyboard navigation (arrow keys, enter)

#### Search Results Page

**Route:** `/search?q=query`

**Features:**

- Filter tabs (All, Tokens, Components, Docs)
- Result cards with:
  - Title with highlight
  - Type badge
  - Excerpt with context
  - Direct link
- Pagination
- "No results" state with suggestions

### Search Ranking

**Priorities:**

1. Exact title match (highest)
2. Title contains query
3. Content/description match
4. Tag/category match (lowest)

**PostgreSQL Ranking:**

```sql
SELECT
  *,
  ts_rank(search_vector, query) as rank
FROM search_index, plainto_tsquery('english', $1) query
WHERE search_vector @@ query
ORDER BY rank DESC, updated_at DESC
LIMIT $2 OFFSET $3;
```

---

## Feature 7: Team Collaboration

### Problem

Teams can't discuss components or track changes.

### Solution

Comments on components/docs + basic review workflow.

### Architecture

```
Collaboration Flow:
User Action → Store Comment → Notify Users → Display Thread
                ↓
        Component Page
        Documentation Page
        Activity Feed
```

### Database Design

#### Comments Table

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(50) NOT NULL, -- 'component', 'doc'
  target_id INTEGER NOT NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

#### Comment Notifications

```sql
CREATE TABLE comment_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON comment_notifications(user_id);
CREATE INDEX idx_notifications_read ON comment_notifications(read);
```

### API Design

**Comments CRUD:**

```
POST   /api/components/[id]/comments      - Create comment
GET    /api/components/[id]/comments      - List comments
PUT    /api/comments/[id]                 - Update comment
DELETE /api/comments/[id]                 - Delete comment
POST   /api/comments/[id]/resolve         - Mark resolved
```

**Comment Structure:**

```json
{
  "id": 123,
  "content": "Should we add a loading state?",
  "author": {
    "id": 1,
    "name": "John Doe",
    "avatar": "/avatars/john.png"
  },
  "createdAt": "2026-03-12T10:30:00Z",
  "replies": [
    {
      "id": 124,
      "content": "Good idea, I'll add it",
      "author": { ... },
      "parentId": 123
    }
  ],
  "resolved": false
}
```

### UI Components

#### Comments Section

**Location:** Bottom of component/doc pages

**Features:**

- Comment input with @mentions
- Threaded replies (1 level deep for MVP)
- Author avatar and timestamp
- Edit/Delete (own comments only)
- Resolve button (component owners)
- "Show resolved" toggle

#### @Mentions

**Implementation:**

- Trigger: Type @
- Dropdown: List of team members
- Backend: Parse @username, create notifications

#### Activity Feed

**Route:** `/admin/activity`

**Shows:**

- New comments
- Component updates
- New components
- Token changes

**Filter by:**

- User
- Content type
- Date range

### Review Workflow (Basic)

**Component States:**

- `draft` - Work in progress
- `in_review` - Submitted for review
- `approved` - Reviewer approved
- `published` - Live

**API:**

```
POST /api/components/[id]/submit-for-review
POST /api/components/[id]/approve
POST /api/components/[id]/request-changes
POST /api/components/[id]/publish
```

**UI:**

- Status badge on component
- Action buttons (based on permissions)
- Review comment input

---

## Feature 8: Analytics & Insights

### Problem

No visibility into design system usage.

### Solution

Track component views, generate usage reports.

### Architecture

```
Analytics Flow:
User Action → Log Event → Aggregate → Dashboard Display
                ↓
        Page Views
        Code Downloads
        Search Queries
```

### Database Design

#### Analytics Events

```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL, -- 'page_view', 'code_download', 'search'
  target_type VARCHAR(50), -- 'component', 'token', 'doc'
  target_id INTEGER,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB, -- Additional context
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_target ON analytics_events(target_type, target_id);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
```

#### Daily Aggregates (for performance)

```sql
CREATE TABLE analytics_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INTEGER NOT NULL,
  views INTEGER DEFAULT 0,
  code_downloads INTEGER DEFAULT 0,
  UNIQUE(date, target_type, target_id)
);
```

### Event Tracking

**Automatic Events:**

- `component_view` - When component detail page loaded
- `token_view` - When token page viewed
- `doc_view` - When documentation page viewed
- `code_download` - When code copied/generated

**Tracked via:**

- Middleware on API routes
- Client-side for page views (if needed)

### API Design

**Dashboard Data:**

```
GET /api/analytics/dashboard
GET /api/analytics/components/popular?days=30
GET /api/analytics/tokens/popular?days=30
GET /api/analytics/search/queries?days=7
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "popularComponents": [
      {
        "id": 123,
        "name": "Button",
        "views": 450,
        "codeDownloads": 89
      }
    ],
    "totalViews": 12500,
    "totalDownloads": 450,
    "topSearches": ["button", "input", "card"]
  }
}
```

### UI Components

#### Analytics Dashboard

**Route:** `/admin/analytics`

**Widgets:**

1. **Overview Cards**
   - Total views (7/30/90 days)
   - Total code downloads
   - Unique components viewed

2. **Popular Components Chart**
   - Bar chart of top 10 components
   - Toggle: views vs downloads

3. **Usage Over Time**
   - Line chart (daily views)
   - Date range selector

4. **Search Analytics**
   - Top search queries
   - Failed searches (no results)

5. **Health Metrics**
   - Undocumented components
   - Unused tokens
   - Orphaned pages

#### Component Analytics

**Location:** Component detail page (admin view)

**Shows:**

- Total views
- Views over time (sparkline)
- Code download count
- Related searches

### External Tracking (Future)

**JavaScript Snippet:**

```javascript
// Track component usage in production apps
OpenDS.track({
  component: "Button",
  project: "my-app",
  version: "1.2.0",
});
```

**API Endpoint:**

```
POST /api/analytics/external
Body: { component, project, version, timestamp }
```

---

## Implementation Order

**Recommended:**

1. **Phase 6: Search** (Critical)
   - Unblocks finding content
   - Required for good UX
   - Time: 3-4 days

2. **Phase 5: Code Gen Enhancement** (High)
   - Builds on existing foundation
   - High user value
   - Time: 4-5 days

3. **Phase 7: Collaboration** (Medium)
   - Enables team workflows
   - Database changes needed
   - Time: 5-6 days

4. **Phase 8: Analytics** (Low-Medium)
   - Nice-to-have insights
   - Can be added anytime
   - Time: 3-4 days

**Total Estimate:** 15-19 days for all features

---

## Technical Considerations

### Performance

**Search:**

- Add database indexes (included in design)
- Cache popular searches
- Consider read replicas for heavy search load

**Analytics:**

- Async event logging (don't block requests)
- Aggregate daily to reduce query load
- Archive old events (90+ days)

### Security

**Search:**

- Respect content permissions
- Don't expose private content in search

**Comments:**

- Sanitize HTML (prevent XSS)
- Rate limiting on comment creation
- Moderation tools (admin delete)

**Analytics:**

- Anonymize data where possible
- GDPR compliance (data retention)

### Future Enhancements

**Phase 5+:**

- More frameworks (Angular, Solid, etc.)
- Custom templates
- Design-to-code AI

**Phase 6+:**

- Advanced search (faceted, fuzzy)
- Typesense/Elasticsearch migration
- Search suggestions

**Phase 7+:**

- Real-time comments (WebSockets)
- Email notifications
- Slack integration
- Advanced review workflows

**Phase 8+:**

- Real-time analytics
- Custom reports
- Export to BI tools
- Project integration tracking

---

## Success Criteria

✅ **Phase 5 Complete:**

- Can generate Vue, React, Svelte code
- Can export CSS/SCSS from tokens
- Copy-to-clipboard works
- Syntax highlighting applied

✅ **Phase 6 Complete:**

- Global search works (Cmd+K)
- Instant results in dropdown
- Results page with filters
- Highlights matching terms

✅ **Phase 7 Complete:**

- Can comment on components/docs
- Threaded replies work
- Activity feed shows changes
- Basic review workflow functional

✅ **Phase 8 Complete:**

- Component views tracked
- Dashboard shows popular content
- Health metrics visible
- Can export reports

---

_Ready for implementation planning._  
_Created by: Design Agent_  
_Date: 2026-03-12_
