import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TokenEditor from '../components/TokenEditor.vue';

const meta = {
  title: 'Example/TokenEditor',
  component: TokenEditor,
  tags: ['autodocs'],
} satisfies Meta<typeof TokenEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
