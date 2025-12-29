# Storybook Integration

OpenDS now includes Storybook for interactive component development and testing.

## Getting Started

### Running Storybook

To start the Storybook development server:

```bash
pnpm run storybook
```

Storybook will start on http://localhost:6006

### Building Storybook

To build Storybook for production:

```bash
pnpm run build-storybook
```

The static build will be generated in the `storybook-static` directory.

### Running Alongside Main Dev Server

You can run Storybook alongside the main OpenDS dev server:

Terminal 1 - Main App:

```bash
pnpm run dev
```

Terminal 2 - Storybook:

```bash
pnpm run storybook
```

- Main app: http://localhost:3002
- Storybook: http://localhost:6006

Both servers can run independently without conflicts.

## Component Stories

Stories are located in `src/design-system/components/*.stories.ts` for each component.

### Creating New Stories

To add a story for a component:

1. Create a new file `ComponentName.stories.ts` in the same directory as your component
2. Follow the story format:

   ```typescript
   import type { Meta, StoryObj } from '@storybook/vue3-vite'
   import Component from './Component.vue'

   const meta = {
     title: 'Design System/ComponentName',
     component: Component,
     tags: ['autodocs']
   } satisfies Meta<typeof Component>

   export default meta
   type Story = StoryObj<typeof Component>

   export const Default: Story = {
     args: {
       // component props
     }
   }
   ```

## Design Tool Integration

OpenDS Storybook includes design tool embed functionality for comparing designs with code implementations.

### Linking Designs to Components

Add design metadata to component YAML files (`design-system-data/components/*.yaml`):

```yaml
name: Button
description: A versatile button component
design:
  tool: penpot # Options: penpot, figma, sketch
  fileId: 'your-file-id'
  frameId: 'your-frame-id'
  nodeId: 'your-node-id'
  timestamp: '2024-12-15T10:00:00Z'
props:
  # ...
```

### Design Tool Support

- **Penpot**: Native embed support with frame ID
- **Figma**: Figma embed API with node ID
- **Sketch**: Fallback to image display or embed link

### Sync Status

Components display sync status indicators:

- 🟢 **Synced** - Design and code are up to date
- 🟡 **Outdated** - Design or code has changed
- 🔴 **Missing** - No design or code linked

## Storybook Configuration

Storybook configuration is in the `.storybook/` directory:

- **main.ts** - Core configuration, addons, path aliases
- **preview.ts** - Global decorators, parameters, themes
- **utils/** - Design tool integration utilities
- **components/** - Reusable Storybook components (DesignEmbed, SyncStatus, DesignCodeView)

## Available Addons

- **@storybook/addon-docs** - Auto-generated component documentation
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-vitest** - Unit testing in Storybook
- **@chromatic-com/storybook** - Visual regression testing and publishing

## Best Practices

1. **Use controls for interactive props** - All component props should be configurable via Storybook controls
2. **Document variants** - Create multiple stories for different component states
3. **Test accessibility** - Use the a11y panel to check accessibility
4. **Link designs** - Add design metadata to YAML files for design-code comparison
5. **Keep stories simple** - Focus on component behavior, not application logic

## Troubleshooting

### Storybook won't start

- Ensure you've run `pnpm install` after adding Storybook
- Check that `.storybook/main.ts` and `.storybook/preview.ts` are valid
- Look at console output for specific errors

### Components not appearing

- Verify story files are in `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Check that the `stories` glob in `.storybook/main.ts` matches your file locations
- Ensure component imports are correct

### Design embeds not loading

- Check that design tool credentials are configured (if using private files)
- Verify fileId, frameId, and nodeId are correct in YAML files
- Some design tools require the design to be shared/publicly accessible
