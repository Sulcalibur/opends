import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DesignCodeView from '@storybook/components/DesignCodeView.vue'
import DesignEmbed from '@storybook/components/DesignEmbed.vue'
import Button from './Button.vue'

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger']
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    severity: 'primary',
    size: 'medium',
    disabled: false
  },
  render: args => ({
    components: { Button, DesignCodeView, DesignEmbed },
    setup() {
      return { args }
    },
    template: `
      <DesignCodeView
        title="Button - Primary"
        :design-metadata="{
          tool: 'penpot',
          fileId: '79c9c158-ad77-81e4-8007-51230d2779fa',
          frameId: '79c9c158-ad77-81e4-8007-51230d2779fb',
          nodeId: '',
          timestamp: '2024-12-28T15:00:00Z'
        }"
        :code-timestamp="new Date().toISOString()"
        initial-view="code"
      >
        <template #code>
          <Button v-bind="args" />
        </template>
      </DesignCodeView>
    `
  })
}

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    severity: 'secondary',
    size: 'medium',
    disabled: false
  }
}

export const Success: Story = {
  args: {
    label: 'Success Button',
    severity: 'success',
    size: 'medium',
    disabled: false
  }
}

export const Danger: Story = {
  args: {
    label: 'Danger Button',
    severity: 'danger',
    size: 'medium',
    disabled: false
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    severity: 'primary',
    size: 'medium',
    disabled: true
  }
}

export const Small: Story = {
  args: {
    label: 'Small Button',
    severity: 'primary',
    size: 'small',
    disabled: false
  }
}

export const Large: Story = {
  args: {
    label: 'Large Button',
    severity: 'primary',
    size: 'large',
    disabled: false
  }
}

export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="padding: 20px;">
        <div style="margin-bottom: 20px;">
          <h4>Primary</h4>
          <Button label="Small" severity="primary" size="small" />
          <Button label="Medium" severity="primary" size="medium" />
          <Button label="Large" severity="primary" size="large" />
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Secondary</h4>
          <Button label="Small" severity="secondary" size="small" />
          <Button label="Medium" severity="secondary" size="medium" />
          <Button label="Large" severity="secondary" size="large" />
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Success</h4>
          <Button label="Small" severity="success" size="small" />
          <Button label="Medium" severity="success" size="medium" />
          <Button label="Large" severity="success" size="large" />
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Danger</h4>
          <Button label="Small" severity="danger" size="small" />
          <Button label="Medium" severity="danger" size="medium" />
          <Button label="Large" severity="danger" size="large" />
        </div>
      </div>
    `
  })
}
