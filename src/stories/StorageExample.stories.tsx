import type { Meta, StoryObj } from '@storybook/react';
import { LocalStorageExample } from '../components/StorageExample';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSessionStorage } from '../hooks/useSessionStorage';

// === Setup ===
const StoryComponent = LocalStorageExample; // <-- Set to your component
const meta: Meta<typeof StoryComponent> = {
  title: 'Stories/Example', // <-- Set to your story title
  component: StoryComponent,
  parameters: {
    options: { showPanel: false }, // Don't show addons panel
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// === Stories ===
export const LocalStorage: Story = {
  args: {
    useStorage: useLocalStorage,
  },
};

export const SessionStorage: Story = {
  args: {
    useStorage: useSessionStorage,
  },
};
