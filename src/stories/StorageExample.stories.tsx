/*
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 * More on args: https://storybook.js.org/docs/react/writing-stories/args
 * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
 */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LocalStorageExample } from '../components/StorageExample';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSessionStorage } from '../hooks/useSessionStorage';

export default {
  title: 'Stories/Web Storage',
  component: LocalStorageExample,
  parameters: {
    controls: {
      disabled: true,
    },
    options: { showPanel: false },
  },
} as ComponentMeta<typeof LocalStorageExample>;

const Template: ComponentStory<typeof LocalStorageExample> = (args) => <LocalStorageExample {...args} />;

export const LocalStorage = Template.bind({});
LocalStorage.args = {
  useStorage: useLocalStorage,
};

export const SessionStorage = Template.bind({});
SessionStorage.args = {
  useStorage: useSessionStorage as any,
};
