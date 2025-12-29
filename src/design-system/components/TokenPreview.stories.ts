import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TokenPreview from './TokenPreview.vue'

const meta = {
  title: 'Design System/TokenPreview',
  component: TokenPreview,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['color', 'typography', 'spacing']
    },
    token: { control: 'text' },
    value: { control: 'text' }
  }
} satisfies Meta<typeof TokenPreview>

export default meta
type Story = StoryObj<typeof meta>

export const ColorToken: Story = {
  args: {
    type: 'color',
    token: 'primary-500',
    value: '#3b82f6'
  },
  render: args => ({
    components: { TokenPreview },
    setup() {
      return { args }
    },
    template: `
      <TokenPreview v-bind="args" />
    `
  })
}

export const TypographyToken: Story = {
  args: {
    type: 'typography',
    token: 'heading-1',
    value: '32px, Inter, bold'
  },
  render: args => ({
    components: { TokenPreview },
    setup() {
      return { args }
    },
    template: `
      <TokenPreview v-bind="args" />
    `
  })
}

export const SpacingToken: Story = {
  args: {
    type: 'spacing',
    token: 'spacing-md',
    value: '1rem (16px)'
  },
  render: args => ({
    components: { TokenPreview },
    setup() {
      return { args }
    },
    template: `
      <TokenPreview v-bind="args" />
    `
  })
}

export const MultipleColorTokens: Story = {
  render: () => ({
    components: { TokenPreview },
    template: `
      <div style="padding: 20px;">
        <div style="margin-bottom: 1rem;">
          <h4>Color Palette</h4>
          <TokenPreview type="color" token="primary-500" value="#3b82f6" />
          <TokenPreview type="color" token="primary-600" value="#2563eb" />
          <TokenPreview type="color" token="success-500" value="#22c55e" />
          <TokenPreview type="color" token="danger-500" value="#ef4444" />
        </div>
      </div>
    `
  })
}
