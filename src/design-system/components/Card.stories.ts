import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Card from './Card.vue'

const meta = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5]
    }
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    title: '',
    subtitle: '',
    elevation: 1
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>This is a basic card with no title or subtitle.</p>
      </Card>
    `
  })
}

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    subtitle: '',
    elevation: 1
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>This card has a title but no subtitle.</p>
      </Card>
    `
  })
}

export const WithSubtitle: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Additional context or description',
    elevation: 1
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>This card has both title and subtitle.</p>
      </Card>
    `
  })
}

export const NoElevation: Story = {
  args: {
    title: 'No Shadow',
    subtitle: 'Elevation 0',
    elevation: 0
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>This card has no shadow (elevation 0).</p>
      </Card>
    `
  })
}

export const HighElevation: Story = {
  args: {
    title: 'High Elevation',
    subtitle: 'Elevation 3',
    elevation: 3
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>This card has a higher shadow (elevation 3).</p>
      </Card>
    `
  })
}

export const LongContent: Story = {
  args: {
    title: 'Long Content',
    subtitle: 'Card with substantial content',
    elevation: 1
  },
  render: args => ({
    components: { Card },
    setup() {
      return { args }
    },
    template: `
      <Card v-bind="args">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p style="margin-top: 1rem;">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
      </Card>
    `
  })
}

export const AllElevations: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div style="padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          <Card :elevation="0" title="Elevation 0">
            <p>No shadow</p>
          </Card>
          <Card :elevation="1" title="Elevation 1">
            <p>Small shadow</p>
          </Card>
          <Card :elevation="2" title="Elevation 2">
            <p>Medium shadow</p>
          </Card>
          <Card :elevation="3" title="Elevation 3">
            <p>Large shadow</p>
          </Card>
          <Card :elevation="4" title="Elevation 4">
            <p>Larger shadow</p>
          </Card>
          <Card :elevation="5" title="Elevation 5">
            <p>Highest shadow</p>
          </Card>
        </div>
      </div>
    `
  })
}
