# OpenDS - UI/UX Design Specification

> **Inspired by ZeroHeight & Modern Design System Platforms**  
> **Last Updated**: December 25, 2024  
> **Status**: Design Specification

---

## 🎨 Design Philosophy

**OpenDS should feel:**
- **Professional** - Like ZeroHeight, Supernova, and enterprise tools
- **Welcoming** - Friendly onboarding and helpful guidance
- **Efficient** - Quick access to frequently used features
- **Beautiful** - Modern aesthetics that inspire confidence

**Visual Inspiration:**
- ZeroHeight (structure and organization)
- Nessie Design System (bold branding and color)
- Material Design (clean, functional)
- Linear (polish and micro-interactions)

---

## 📐 Layout Patterns

### **1. Dashboard Layout**

**Purpose**: Landing page after login, showing recent activity and quick actions

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] [Nav Menu]                    [Search] [Avatar] │ ← Header (fixed)
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Good [morning/afternoon/evening] [Name]! 👋            │ ← Personalized greeting
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  LAST VIEWED                                     │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  [Card] [Card] [Card] [Card]                    │   │ ← Recently accessed items
│  │  Button  Typography  Icons  Cover page          │   │
│  │  12:34 AM  12:34 AM  12:34 AM  12:34 AM         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────┐  ┌──────────────────────────────┐     │
│  │ MISSING     │  │ RECOMMENDATIONS              │     │
│  │ BLOCKS      │  │                              │     │
│  │             │  │ Category    Task             │     │
│  │ 11 Pages    │  │ [Adoption]  Connect repo... │     │
│  │ without     │  │ [Adoption]  Connect code... │     │
│  │ design      │  │ [Doc]       Add release... │     │
│  │             │  │                              │     │
│  └─────────────┘  └──────────────────────────────┘     │
│                                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │  [Showcase] [Help Center] [Slack Community]      │ │ ← Helpful resources
│  │  Colorful cards with gradient backgrounds       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                          │
│  [Get started (60%)] ▼                                  │ ← Progress indicator
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Personalized greeting** with time of day
- **Last Viewed** - Quick access to recent items (4-6 cards)
- **Missing Blocks** - Nudge to complete documentation
- **Recommendations** - Smart suggestions based on setup status
- **Resource Cards** - Colorful, eye-catching cards for help/community
- **Progress Tracker** - Onboarding/setup completion percentage

**Design Details:**
- Cards: Subtle shadow, rounded corners (8-12px)
- Spacing: Generous whitespace (24-32px between sections)
- Typography: Large, bold headings for sections
- Colors: Neutral background, colorful accents for cards

---

### **2. Styleguides List View**

**Purpose**: Overview of all design system styleguides/projects

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] [Nav: Dashboard | Documentation | ...]          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Styleguides                    [Create styleguide]     │
│  1/2 styleguides in your plan.                          │
│  Tip: You can create one more styleguide...             │
│                                                          │
│  ┌──────────────────────┐                               │
│  │                      │                               │
│  │  [Preview Image]     │                               │
│  │                      │                               │
│  │  DayDeskr Test       │                               │
│  │  Updated 21 hours ago│                               │
│  └──────────────────────┘                               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │  Learning and resources                            ││
│  │  [Showcase] [Help center] [Slack community]        ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  [Get started (60%)] ▼                                  │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Header with action** - "Create styleguide" button (primary action)
- **Usage indicator** - "1/2 styleguides in your plan"
- **Helpful tip** - Contextual guidance
- **Card grid** - Visual preview of each styleguide
- **Last updated** - Timestamp on each card

---

### **3. Documentation Editor (Two-Panel Layout)**

**Purpose**: Main editing interface for creating documentation pages

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← DayDeskr Test  Updated 21 hours ago                  │
│  [Add navigation] [Styles] [Preview] [...] [Share] [@]  │
├──────────────────┬──────────────────────────────────────┤
│ [D] DayDeskr     │  DayDeskr Test                       │
│                  │  Styleguide updated about 21 hours   │
│ [🔍] Search...   │                                       │
│                  │  Add a description to your style...  │
│ [📄] Cover page  │                                       │
│                  │  ┌────────────┐  ┌────────────┐      │
│ OVERVIEW      ▾  │  │   Design   │  │   Code     │      │
│   Introduction   │  │            │  │            │      │
│   Principles     │  │  Shortcut  │  │  Shortcut  │      │
│   Release notes  │  └────────────┘  └────────────┘      │
│ + Add sub...     │                                       │
│                  │  ⊕ Add tab                            │
│ + Add page       │                                       │
│                  │  Get started                          │
│ STYLE         ▾  │  ☐ Click anywhere and start...       │
│   Colors         │  ☐ Hit / to see all content...       │
│   Typography     │  ☐ Add design styles from files...   │
│   Icons          │  ☐ Click ... in top-right...         │
│   Layout      >  │  ☐ Check our 101 guide...            │
│ + Add sub...     │                                       │
│ + Add page       │  [+] Upload components from...        │
│                  │  [Add a design file]                 │
│ COMPONENTS    ▾  │                                       │
│   Button      >  │                                       │
│ + Add sub...     │  [⚙] Footer settings                 │
│                  │                                       │
│ COMPONENTS    ▾  │                                       │
│   Button      >  │                                       │
│ + Add sub...     │                                       │
│ + Add page       │                                       │
│                  │                                       │
│ STYLE         ▾  │                                       │
│   Colors         │                                       │
└──────────────────┴──────────────────────────────────────┘
```

**Key Features:**

**Left Sidebar (Navigation Tree):**
- Logo/project name at top
- Search bar
- Hierarchical navigation
  - Collapsible sections (▾)
  - Nested items with indent
  - Right arrow (>) for items with children
- "+ Add subcategory" and "+ Add page" actions
- Clear visual hierarchy

**Right Panel (Content Editor):**
- Page title (large, bold)
- Metadata (last updated)
- Description area
- Shortcut tiles for quick actions
- Checklist for getting started
- Upload/import actions
- Rich content editing area
- Footer settings

**Design Details:**
- Left sidebar: 240-280px width, light gray background
- Collapsible sections with smooth animation
- Active page highlighted with subtle blue/accent background
- Content area: Max-width 960px for readability
- Generous line-height (1.6-1.8) for body text

---

### **4. Integration Pages (Empty States)**

**Purpose**: Connect external tools (GitHub, Figma, Storybook, etc.)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] [Nav: Components | Design files | Code repos]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              [GitHub] [GitLab] [Bitbucket] [Azure]      │ ← Service icons
│                                                          │
│              Sync content from your code repos          │
│       Bring in markdown and tokens files to use...      │
│                                                          │
│                  [Connect your repos]                   │ ← Primary CTA
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Service icons** - Large, colorful icons (48-64px)
- **Centered layout** - Empty state in center of viewport
- **Clear value proposition** - "Sync content from..."
- **Single primary action** - Big, obvious CTA button
- **Tab navigation** - Switch between integration types

---

### **5. Tokens Management**

**Purpose**: View and manage design tokens

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Tokens                                                  │
│                                                          │
│           [Figma] [GitHub] [File] [Manual]              │
│                                                          │
│              Get started with tokens                     │
│      Create your first token set in zeroheight,         │
│      or use our Figma plugin to sync tokens...          │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  + Create a token set                            │   │
│  │  Bring tokens from GitHub, Figma styles,         │   │
│  │  a JSON file, or add them manually.              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ℹ Sync with Figma variables                     │   │
│  │  Create tokens from Figma variables with the     │   │
│  │  Figma sync plugin.                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [Get started (60%)] ▼                                  │
└──────────────────────────────────────────────────────────┘
```

**With Tokens (Populated State):**
```
┌─────────────────────────────────────────────────────────┐
│  Tokens                               [+ Create token]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Color] [Typography] [Spacing] [Border] [Shadow]       │ ← Tabs
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Token name        Preview      Value    Usage  │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  primary           [■]          #2196F3     83   │   │
│  │  primary-dark      [■]          #1976D2     45   │   │
│  │  secondary         [■]          #FF5722     67   │   │
│  │  ...                                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### **6. Adoption/Analytics Dashboard**

**Purpose**: Track design system adoption and usage

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Adoption                                                │
│                                                          │
│      Measure adoption of your design system             │
│  A design system is only as good as your adoption...    │
│                                                          │
│                  [Set up adoption]                       │
│                  Learn more                              │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Button usage                                   │    │
│  │  [Line chart showing usage over time]           │    │
│  │  Sep 30th        Usage                          │    │
│  │  ■ admin-center  42                             │    │
│  │  ■ marketing     112                            │    │
│  │  ■ secure-web    87                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Track component usage                          │    │
│  │  See which components are getting the most      │    │
│  │  usage from your design system consumers...     │    │
│  │                                                  │    │
│  │  [React and Angular]  Find out more             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Spot usage of raw color values                 │    │
│  │  [Color usage breakdown table]                  │    │
│  │  Color      Preview    Usage                    │    │
│  │  #212121    [■]        83                       │    │
│  │  #338DC9    [■]        45                       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Know who's not up to date                      │    │
│  │  @ds-components adoption                        │    │
│  │  ○ admin-center    ✓ Up to date                │    │
│  │  ○ marketing-site  ○ Not used                  │    │
│  │  ○ ios-app         ✓ Up to date                │    │
│  │  ○ android-app     ⚠ Out of date               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Charts and visualizations** - Line charts, bar charts
- **Tables** - Sortable, filterable data tables
- **Status indicators** - ✓ (green), ⚠ (yellow), ○ (gray)
- **Actionable insights** - "Track component usage" cards
- **Clear metrics** - Usage counts, percentages

---

## 🎨 Visual Design System

### **Color Palette**

**Primary Colors:**
```
Primary Blue:     #2196F3  (buttons, links, active states)
Primary Dark:     #1976D2  (hover states)
Primary Light:    #BBDEFB  (backgrounds, highlights)

Accent:           #FF5722  (important actions, alerts)
Success:          #4CAF50  (success states, completed)
Warning:          #FF9800  (warnings, pending)
Error:            #F44336  (errors, destructive actions)
```

**Neutral Colors:**
```
Gray 50:          #FAFAFA  (page background)
Gray 100:         #F5F5F5  (card background)
Gray 200:         #EEEEEE  (borders, dividers)
Gray 400:         #BDBDBD  (placeholder text)
Gray 600:         #757575  (secondary text)
Gray 900:         #212121  (primary text)

White:            #FFFFFF
Black:            #000000  (rarely used pure black)
```

**Gradient Backgrounds (for cards/sections):**
```
Pink/Red:         linear-gradient(135deg, #FFB3BA, #FF8A9B)
Purple/Blue:      linear-gradient(135deg, #C9B3FF, #8A9BFF)
Teal/Green:       linear-gradient(135deg, #7FDBCA, #5FD3BC)
Yellow/Orange:    linear-gradient(135deg, #FFE070, #FFD060)
```

---

### **Typography**

**Font Family:**
```
Primary:   Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'JetBrains Mono', 'Fira Code', Consolas, monospace
```

**Font Sizes:**
```
Display (Hero):   3rem    (48px)   - Homepage hero text
H1:               2rem    (32px)   - Page titles
H2:               1.5rem  (24px)   - Section headings
H3:               1.25rem (20px)   - Subsection headings
H4:               1.125rem(18px)   - Card titles
Body Large:       1rem    (16px)   - Important body text
Body:             0.875rem(14px)   - Default body text
Small:            0.75rem (12px)   - Metadata, captions
Tiny:             0.6875rem(11px)  - Timestamps, labels
```

**Font Weights:**
```
Regular:  400  - Body text
Medium:   500  - Emphasized text
Semibold: 600  - Headings, buttons
Bold:     700  - Important headings
```

**Line Heights:**
```
Tight:    1.2   - Headings
Normal:   1.5   - UI text
Relaxed:  1.6   - Body text
Loose:    1.8   - Documentation
```

---

### **Spacing System**

**Base unit: 4px**

```
xs:   4px   (0.25rem)  - Tight spacing
sm:   8px   (0.5rem)   - Small gaps
md:   16px  (1rem)     - Default spacing
lg:   24px  (1.5rem)   - Section spacing
xl:   32px  (2rem)     - Large spacing
2xl:  48px  (3rem)     - Page sections
3xl:  64px  (4rem)     - Hero sections
```

**Common Patterns:**
- Card padding: `24px` (lg)
- Section gaps: `32px` (xl)
- Inline gaps: `8px` (sm)
- Page margins: `48px` (2xl)

---

### **Shadows**

```
None:     none
XS:       0 1px 2px 0 rgba(0, 0, 0, 0.05)
SM:       0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
MD:       0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
LG:       0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
XL:       0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
```

**Usage:**
- Cards: `shadow-sm` or `shadow-md`
- Dropdowns: `shadow-lg`
- Modals: `shadow-xl`
- Hover states: Increase shadow by one level

---

### **Border Radius**

```
None:     0
SM:       4px
MD:       8px
LG:       12px
XL:       16px
2XL:      24px
Full:     9999px (pill shape)
```

**Usage:**
- Buttons: `8px` (md)
- Cards: `12px` (lg)
- Inputs: `8px` (md)
- Avatars: `9999px` (full)

---

### **Icons**

**Icon Library:** Heroicons, Lucide, or Phosphor

**Sizes:**
```
XS:  12px  - Inline icons
SM:  16px  - UI icons
MD:  20px  - Default icons
LG:  24px  - Prominent icons
XL:  32px  - Feature icons
2XL: 48px  - Hero/empty state icons
```

**Colors:**
- Default: `text-gray-600`
- Active: `text-primary`
- Disabled: `text-gray-400`

---

## 🧩 Component Patterns

### **Navigation Bar**

```vue
<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <img src="/logo.svg" alt="OpenDS" class="logo" />
    </div>
    
    <div class="navbar-menu">
      <a href="/dashboard" class="nav-item">Dashboard</a>
      <a href="/documentation" class="nav-item active">Documentation</a>
      <a href="/resources" class="nav-item">Resources</a>
      <a href="/tokens" class="nav-item">Tokens</a>
      <a href="/adoption" class="nav-item">Adoption</a>
    </div>
    
    <div class="navbar-actions">
      <button class="search-trigger">
        <Icon name="search" />
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
      
      <div class="trial-notice">
        <Icon name="clock" />
        <span>Starter trial: <strong>14 days left</strong></span>
        <button class="upgrade-btn">Upgrade</button>
      </div>
      
      <div class="avatar-menu">
        <Avatar user="Sul" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-item {
  padding: 0.5rem 1rem;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #111827;
}

.nav-item.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
}
</style>
```

---

### **Card Component**

```vue
<template>
  <div class="card" :class="cardClasses">
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" />
    </div>
    
    <div class="card-content">
      <div v-if="badge" class="card-badge">{{ badge }}</div>
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <div v-if="meta" class="card-meta">{{ meta }}</div>
    </div>
    
    <div v-if="$slots.actions" class="card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.card-meta {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
```

---

### **Empty State**

```vue
<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <slot name="icon">
        <Icon :name="icon" size="48" />
      </slot>
    </div>
    
    <h3 class="empty-state-title">{{ title }}</h3>
    <p class="empty-state-description">{{ description }}</p>
    
    <div v-if="$slots.actions" class="empty-state-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}

.empty-state-icon {
  margin-bottom: 1.5rem;
  color: #9ca3af;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}
</style>
```

---

## 🎭 Micro-Interactions

### **Hover Effects**

```css
/* Subtle scale */
.card:hover {
  transform: scale(1.02);
}

/* Lift effect */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Glow effect */
.button-primary:hover {
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
}
```

### **Loading States**

```vue
<template>
  <div class="skeleton">
    <div class="skeleton-line" />
    <div class="skeleton-line" />
    <div class="skeleton-line short" />
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}
</style>
```

### **Transitions**

```css
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
```

---

## 📱 Responsive Design

### **Breakpoints**

```css
/* Mobile First */
--sm:  640px   /* Tablet */
--md:  768px   /* Desktop */
--lg:  1024px  /* Large Desktop */
--xl:  1280px  /* Extra Large */
--2xl: 1536px  /* Ultra Wide */
```

### **Mobile Adaptations**

**Navigation:**
- Collapse to hamburger menu on mobile
- Full-screen navigation overlay
- Bottom navigation bar option

**Cards:**
- Full-width on mobile
- 2-column on tablet
- 3-4 column on desktop

**Sidebar:**
- Off-canvas drawer on mobile
- Fixed sidebar on desktop
- Toggle button always visible

---

## ✨ Special Features

### **1. Command Palette (⌘K)**

- Global search
- Quick actions
- Keyboard shortcuts
- Recent items

### **2. Onboarding Progress**

- Sticky progress indicator
- Collapsible checklist
- Smart recommendations
- Celebration on completion

### **3. Contextual Help**

- Tooltips on hover
- Info icons for complex features
- Inline documentation
- Link to help center

### **4. Notifications**

- Toast messages (top-right)
- System notifications
- Activity feed
- Email preferences

---

## 🎨 Brand Examples

### **Bold Branding (Like Nessie)**

```css
/* Hero section with brand color */
.hero {
  background: linear-gradient(135deg, #FFD600, #FFC400);
  min-height: 400px;
  padding: 4rem 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #003D82; /* Brand blue */
  line-height: 1.2;
}

/* Branded illustration */
.hero-illustration {
  max-width: 600px;
  margin-left: auto;
}
```

---

## 📋 Checklist for Implementation

### **Phase 1: Foundation**
- [ ] Set up design tokens (colors, spacing, typography)
- [ ] Create base components (Button, Card, Input, etc.)
- [ ] Implement responsive navigation
- [ ] Add global search (⌘K)

### **Phase 2: Core Pages**
- [ ] Dashboard with widgets
- [ ] Styleguide list view
- [ ] Documentation editor (two-panel)
- [ ] Component library view

### **Phase 3: Features**
- [ ] Empty states for all integrations
- [ ] Token management UI
- [ ] Adoption analytics
- [ ] Onboarding flow

### **Phase 4: Polish**
- [ ] Micro-interactions and animations
- [ ] Loading states and skeletons
- [ ] Error states and feedback
- [ ] Accessibility audit

---

**Next Steps:**
1. Review this specification
2. Create design mockups in Figma/Penpot
3. Build component library in Storybook
4. Implement pages iteratively

---

**Document Owner**: Design Team  
**Last Review**: December 25, 2024  
**Status**: Ready for Implementation

