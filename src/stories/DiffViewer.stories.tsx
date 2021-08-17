import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DiffViewer from '../index';

export default {
  title: 'Components/Diff Viewer',
  component: DiffViewer,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof DiffViewer>;

const Template: ComponentStory<typeof DiffViewer> = (args) => <DiffViewer {...args} />;

export const SplitView = Template.bind({});
export const InlineView = Template.bind({});


const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;

const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

const highlightLines: string[] = [];
const canSelectLines = {
  L: true,
  R: true,
};

const onLineNumberClick = (lineNumber: string, isNewSelection: boolean): void => {
  if (isNewSelection) {
    highlightLines.push(lineNumber);
  } else {
    highlightLines.splice(highlightLines.indexOf(lineNumber), 1);
  }
};

SplitView.args = {
  oldValue: oldCode,
  newValue: newCode,
  splitView: true,
  onLineNumberClick,
  highlightLines,
  canSelectLines,
};

InlineView.args = {
  oldValue: oldCode,
  newValue: newCode,
  splitView: false,
  onLineNumberClick,
  highlightLines,
};
