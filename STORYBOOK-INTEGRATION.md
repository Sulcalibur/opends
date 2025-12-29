# Storybook Integration with Documentation

## Architecture Overview

OpenDS uses a **purpose-separate** approach where Storybook and documentation serve different but complementary roles.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OpenDS Ecosystem                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐      ┌────────────────────┐      │
│  │   Storybook       │      │  Documentation    │      │
│  │   (Development)   │◄────►  (Production)    │      │
│  └────────────────────┘      └────────────────────┘      │
│         │                          │                │
│         ▼                          ▼                ▼
│  ┌────────────────────┐      ┌────────────────────┐      │
│  │  Component       │      │  Component       │      │
│  │  .stories.ts    │      │  .yaml files     │      │
│  └────────────────────┘      └────────────────────┘      │
│         ▲                          ▲                │
│         └──────────┬───────────────┘                │
│                    │                                 │
│                    ▼                                 │
│          ┌────────────────────┐                     │
│          │  Component       │                     │
│          │  .vue files     │                     │
│          └────────────────────┘                     │
│                                                              │
└───────────────────────────────────────────────────────────────┘
```

## Purposes

| Tool              | Primary Purpose                                                                                       | When to Use                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Storybook**     | - Component development<br>- Interactive testing<br>- Design/code comparison<br>- Variant exploration | - Building new components<br>- Testing props/states<br>- Designing with design tools<br>- QA for components |
| **Documentation** | - Production user-facing docs<br>- Usage examples<br>- API reference<br>- Code snippets               | - Publishing design system<br>- Developer onboarding<br>- Integrating components into apps                  |

## Integration Points

### 1. Auto-Sync Props (Maintains Consistency)

Keep story and YAML props in sync automatically:

```bash
# Run after updating component props in stories
pnpm run sync:stories
```

This script:

1. Reads `.stories.ts` files
2. Extracts prop definitions
3. Updates `.yaml` files with matching props

**Benefits:**

- Single source of truth for props
- Documentation always reflects story definitions
- Reduces manual updates

### 2. Deep Links (Interactive Playgrounds)

Link from component documentation to specific Storybook stories:

```vue
<!-- Component documentation page -->
<template>
  <div>
    <h2>{{ component.name }}</h2>
    <p>{{ component.description }}</p>

    <!-- Usage examples from YAML -->
    <UsageExamples :examples="component.examples" />

    <!-- Interactive playground link -->
    <div class="playground-link">
      <a
        href="http://localhost:6006/?path=/story/design-system-{{ component.name }}--default"
        target="_blank"
        rel="noopener noreferrer"
      >
        🎨 Try it in Storybook →
      </a>
    </div>
  </div>
</template>
```

**Benefits:**

- Static docs remain lightweight
- Interactive exploration available
- Clear separation of concerns

### 3. Design Integration (Design-Code Comparison)

Built-in comparison of design tool artifacts vs. code:

```yaml
# design-system-data/components/button.yaml
design:
  tool: penpot
  fileId: 'abc-123-file'
  frameId: 'frame-456'
  timestamp: '2024-12-15T10:00:00Z'
```

Storybook automatically:

- Embeds design in iframe
- Shows code component
- Displays sync status
- Allows toggling between views

**Benefits:**

- See design and code side-by-side
- Know when they're out of sync
- Reduce back-and-forth between tools

## Workflow

### Correct Workflow Order: Penpot → Storybook → Open DS

```
1. Create Design in Penpot
   ↓
   • Create button component design
   • Define variants (primary, secondary, success, danger)
   • Note File ID and Frame ID from URL
   ↓
2. Update Component in Storybook
   ↓
   • Import component to Button.stories.ts
   • Define variant stories
   • Add interactive controls
   • Test component interactively
   ↓
3. Add Design Metadata to YAML
   ↓
   • Open design-system-data/components/button.yaml
   • Add design section with Penpot IDs
   • Update timestamp
   ↓
4. Sync to Open DS Documentation
   ↓
   • Run: pnpm run sync:stories (auto-sync props)
   • Or: pnpm run generate:docs (read from YAML)
   • Review documentation (localhost:3002)
```

### Developer Workflow

```
Create Design (Penpot)
   ↓
Create/Update Component.vue
   ↓
Update Component.stories.ts
   ↓
Test in Storybook (localhost:6006)
   ↓
Add design metadata to YAML
   ↓
Run: pnpm run sync:stories
   ↓
View in Open DS (localhost:3002)
```

### Design-First Workflow

```
1. Design Component in Penpot
   • Define visual design
   • Create all variants
   • Export or note File/Frame ID
   ↓
2. Implement Component Code
   • Create Button.vue
   • Match design specifications
   • Implement all variants
   ↓
3. Create Stories
   • Create Button.stories.ts
   • Test each variant
   • Verify props work correctly
   ↓
4. Add Design Metadata
   • Edit button.yaml
   • Add Penpot file ID and frame ID
   • Add current timestamp
   ↓
5. Sync to Documentation
   • Run: pnpm run sync:stories
   • Generate docs from YAML
   • Verify everything is aligned
```

## Why This Approach?

### ✅ Advantages

1. **Performance**
   - Documentation stays static and fast
   - Storybook is development tool only
   - No iframe embedding in production docs

2. **Maintainability**
   - Each tool has clear purpose
   - Smaller codebase to debug
   - Easier to update independently

3. **Flexibility**
   - Can replace Storybook without affecting docs
   - Can change docs engine without affecting stories
   - Tools evolve independently

4. **User Experience**
   - Fast, static documentation
   - Interactive playgrounds available when needed
   - Designers and developers use appropriate tools

### 🔄 Alternatives Considered

| Alternative                 | Pros                   | Cons                                | Why Rejected                           |
| --------------------------- | ---------------------- | ----------------------------------- | -------------------------------------- |
| **Storybook in Production** | Single codebase        | Heavy bundle size, not SEO-friendly | Documentation should be fast, static   |
| **Docs from Storybook**     | Always in sync         | Can't customize docs layout, slow   | Need full control over docs UX         |
| **Full Embed**              | Interactive everywhere | Performance issues, complexity      | Only need interactivity for playground |

## Best Practices

### 1. Keep Stories Focused

- Show component behavior, not application logic
- Use meaningful variant names (Primary, Disabled, etc.)
- Include edge cases (error states, loading states)

### 2. Maintain Sync

- Run `pnpm run sync:stories` after prop changes
- Check that YAML updates are correct
- Commit both `.stories.ts` and `.yaml` together

### 3. Link Appropriately

- Primary documentation: Static YAML
- Links: Deep-link to specific stories
- Design: Add to YAML, show in Storybook

### 4. Test in Both Tools

- Verify props work in stories
- Check documentation examples are accurate
- Ensure links go to correct stories

### 5. Use Design Integration

- Add design IDs when linking components
- Update timestamps after design changes
- Review sync status before shipping

## Example: Complete Component

### Step 1: Design in Penpot

```
1. Open: https://design.penpot.app
2. Create new file or open existing
3. Draw button component with:
   - Primary variant (blue)
   - Secondary variant (gray)
   - Success variant (green)
   - Danger variant (red)
   - Disabled state
4. Note the File ID from URL:
   https://design.penpot.app/file/abc123?page-id=456
   → File ID: abc123
   → Page ID (Frame ID): 456
```

### Step 2: Component Code

```vue
<!-- src/design-system/components/Button.vue -->
<template>
  <template>
    <button :class="classes" :disabled="disabled">
      {{ label }}
    </button>
  </template>

  <script setup>
    defineProps({
      label: { type: String, required: true },
      severity: {
        type: String,
        default: 'primary',
        validator: v => ['primary', 'secondary', 'success', 'danger'].includes(v)
      },
      disabled: { type: Boolean, default: false }
    })
  </script>
</template>
```

### Story File

```typescript
// src/design-system/components/Button.stories.ts
export const Primary: Story = {
  args: {
    label: 'Primary Button',
    severity: 'primary',
    disabled: false
  }
}
```

### YAML Definition

```yaml
# design-system-data/components/button.yaml
name: Button
description: A versatile button component
design:
  tool: penpot
  fileId: 'abc-123-file'
  frameId: 'frame-456'
  timestamp: '2024-12-15T10:00:00Z'
props:
  - name: label
    type: string
    required: true
    description: Button text
  - name: severity
    type: string
    default: primary
    description: Button style
  - name: disabled
    type: boolean
    default: 'false'
    description: Whether button is disabled
```

### Auto-Sync Result

After running `pnpm run sync:stories`:

```bash
✅ Updated design-system-data/components/button.yaml
  - Extracted 3 props from Button.stories.ts
  - Merged with existing YAML structure
  - Preserved design metadata and examples
```

## FAQ

### Q: Can I have different props in stories vs YAML?

A: Yes, but they'll diverge. Run `pnpm run sync:stories` to reconcile.

### Q: Do I need Storybook to update docs?

A: No, documentation reads YAML files directly. Storybook is for development.

### Q: Can I use Storybook in production?

A: Not recommended. Use deep links for interactive playgrounds.

### Q: How do I update design metadata?

A: Edit YAML files directly. Storybook shows the comparison automatically.

### Q: What if I don't have design tool access?

A: Leave design metadata null. Storybook shows "missing" sync status.

## Next Steps

1. **Add Storybook links** to documentation pages
2. **Update AGENTS.md** with development guidelines
3. **Create templates** for new components with all three files
4. **Add pre-commit hook** to run `sync:stories` automatically
