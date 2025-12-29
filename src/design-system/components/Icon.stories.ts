import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from './Icon.vue'

const meta = {
  title: 'Design System/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    }
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Check: Story = {
  args: {
    name: 'check',
    size: 'medium'
  }
}

export const X: Story = {
  args: {
    name: 'x',
    size: 'medium'
  }
}

export const Plus: Story = {
  args: {
    name: 'plus',
    size: 'medium'
  }
}

export const Minus: Story = {
  args: {
    name: 'minus',
    size: 'medium'
  }
}

export const Small: Story = {
  args: {
    name: 'check',
    size: 'small'
  }
}

export const Medium: Story = {
  args: {
    name: 'check',
    size: 'medium'
  }
}

export const Large: Story = {
  args: {
    name: 'check',
    size: 'large'
  }
}

export const AllIcons: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div style="padding: 20px;">
        <div style="margin-bottom: 1rem;">
          <h4>Common Icons</h4>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <Icon name="check" size="small" />
            <Icon name="x" size="small" />
            <Icon name="plus" size="small" />
            <Icon name="minus" size="small" />
          </div>
        </div>
        <div style="margin-bottom: 1rem;">
          <h4>Small Size</h4>
          <Icon name="check" size="small" />
        </div>
        <div style="margin-bottom: 1rem;">
          <h4>Medium Size</h4>
          <Icon name="check" size="medium" />
        </div>
        <div style="margin-bottom: 1rem;">
          <h4>Large Size</h4>
          <Icon name="check" size="large" />
        </div>
      </div>
    `
  })
}
