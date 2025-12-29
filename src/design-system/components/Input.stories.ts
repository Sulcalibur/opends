import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Input from './Input.vue'

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url']
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: {
    modelValue: '',
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    error: ''
  }
}

export const WithPlaceholder: Story = {
  args: {
    modelValue: '',
    type: 'text',
    placeholder: 'Search for components...',
    disabled: false,
    error: ''
  }
}

export const Email: Story = {
  args: {
    modelValue: '',
    type: 'email',
    placeholder: 'user@example.com',
    disabled: false,
    error: ''
  }
}

export const Password: Story = {
  args: {
    modelValue: '',
    type: 'password',
    placeholder: 'Enter password',
    disabled: false,
    error: ''
  }
}

export const Number: Story = {
  args: {
    modelValue: 0,
    type: 'number',
    placeholder: 'Enter number',
    disabled: false,
    error: ''
  }
}

export const Disabled: Story = {
  args: {
    modelValue: 'Cannot edit',
    type: 'text',
    placeholder: '',
    disabled: true,
    error: ''
  }
}

export const WithError: Story = {
  args: {
    modelValue: '',
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    error: 'This field is required'
  }
}

export const AllTypes: Story = {
  render: () => ({
    components: { Input },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Text</label>
          <Input type="text" placeholder="Text input" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
          <Input type="email" placeholder="Email input" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
          <Input type="password" placeholder="Password input" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Number</label>
          <Input type="number" placeholder="Number input" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tel</label>
          <Input type="tel" placeholder="Phone input" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">URL</label>
          <Input type="url" placeholder="https://example.com" />
        </div>
      </div>
    `
  })
}

export const FormExample: Story = {
  render: () => ({
    components: { Input },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
          <Input type="text" placeholder="John Doe" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email Address</label>
          <Input type="email" placeholder="john@example.com" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
          <Input type="password" placeholder="•••••••" />
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Phone Number</label>
          <Input type="tel" placeholder="+1 (555) 123-4567" />
        </div>
      </div>
    `
  })
}
