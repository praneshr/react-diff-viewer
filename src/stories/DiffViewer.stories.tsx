import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DiffViewer from '../index';

const comments = {
  L: [
    {
      app: '6070158da0299934b7037d17',
      comment: "* check's pulse *",
      createdAt: '2021-07-09T14:36:49.542Z',
      module: '60e859d3b267df4bc3c6159d',
      replies: [1, 2, 3],
      resolved: false,
      subscribed: [] as Record<string, any>[],
      isUrgent: true,
      target: {
        createdAt: '2021-07-09T14:36:49.542Z',
        description: 'line-1,line-2,line-3,line-4',
        id: '60e85bc129eea948453cd3ad',
        type: 'code-fragment',
        updatedAt: '2021-07-09T14:36:49.542Z',
      },
      user: {
        avatar: '',
        avatarColor: '#C9C9C9',
        email: 'enterprise@mailinator.com',
        name: 'Enterprise Architect',
        _id: '607013b3731c4c20f01eaab5',
        __v: 0,
      },
      _id: '60e85f014a0640540764617e',
    },
  ] as Record<string, any>[],
  R: [
    {
      app: '6070158da0299934b7037d17',
      comment: "* check's pulse *",
      createdAt: '2021-07-09T14:36:49.542Z',
      module: '60e859d3b267df4bc3c6159d',
      replies: [] as Record<string, any>[],
      resolved: false,
      subscribed: [] as Record<string, any>[],
      target: {
        createdAt: '2021-07-09T14:36:49.542Z',
        description: 'line-3,line-4',
        id: '60e85bc129eea948453cd3ad',
        type: 'code-fragment',
        updatedAt: '2021-07-09T14:36:49.542Z',
      },
      user: {
        avatar: '',
        avatarColor: '#C9C9C9',
        email: 'enterprise@mailinator.com',
        name: 'Enterprise Architect',
        _id: '607013b3731c4c20f01eaab5',
        __v: 0,
      },
      _id: '60e85f014a0640540764617e',
    },
    {
      app: '6070158da0299934b7037d17',
      comment: "* check's pulse *",
      createdAt: '2021-07-09T14:36:49.542Z',
      module: '60e859d3b267df4bc3c6159d',
      replies: [1,2,3],
      resolved: false,
      subscribed: [] as Record<string, any>[],
      isUrgent: true,
      target: {
        createdAt: '2021-07-09T14:36:49.542Z',
        description: 'line-3,line-4',
        id: '60e85bc129eea948453cd3ad',
        type: 'code-fragment',
        updatedAt: '2021-07-09T14:36:49.542Z',
      },
      user: {
        avatar: '',
        avatarColor: '#C9C9C9',
        email: 'enterprise@mailinator.com',
        name: 'Enterprise Architect',
        _id: '607013b3731c4c20f01eaab5',
        __v: 0,
      },
      _id: '60e85f014a0640540764617e',
    },
    {
      app: '6070158da0299934b7037d17',
      comment: "* check's pulse *",
      createdAt: '2021-07-09T14:36:49.542Z',
      module: '60e859d3b267df4bc3c6159d',
      replies: [] as Record<string, any>[],
      resolved: false,
      subscribed: [] as Record<string, any>[],
      target: {
        createdAt: '2021-07-09T14:36:49.542Z',
        description: 'line-3,line-4',
        id: '60e85bc129eea948453cd3ad',
        type: 'code-fragment',
        updatedAt: '2021-07-09T14:36:49.542Z',
      },
      user: {
        avatar: '',
        avatarColor: '#C9C9C9',
        email: 'enterprise@mailinator.com',
        name: 'Enterprise Architect',
        _id: '607013b3731c4c20f01eaab5',
        __v: 0,
      },
      _id: '60e85f014a0640540764617e',
    },
    {
      app: '6070158da0299934b7037d17',
      comment: "* check's pulse *",
      createdAt: '2021-07-09T14:36:49.542Z',
      module: '60e859d3b267df4bc3c6159d',
      replies: [] as Record<string, any>[],
      resolved: false,
      subscribed: [] as Record<string, any>[],
      target: {
        createdAt: '2021-07-09T14:36:49.542Z',
        description: 'line-1,line-2',
        id: '60e85bc129eea948453cd3ad',
        type: 'code-fragment',
        updatedAt: '2021-07-09T14:36:49.542Z',
      },
      user: {
        avatar: '',
        avatarColor: '#C9C9C9',
        email: 'enterprise@mailinator.com',
        name: 'Enterprise Architect',
        _id: '607013b3731c4c20f01eaab5',
        __v: 0,
      },
      _id: '60e85f014a0640540764617e',
    },
  ] as Record<string, any>[],
};

const DiffWrapper: React.FC = (props: any) => {
  const [highlightLines, setHighlightLines] = useState(props.highlightLines || []);
  const diffComments = {
    L: [] as Record<string, any>[],
    R: [] as Record<string, any>[],
  };

  Object.keys(comments).forEach((key) => {
    diffComments[key as keyof typeof diffComments] = comments[key as keyof typeof comments]
      .map((comment) => {
        const tempComment = { ...comment };

        tempComment.commentLines = comment.target.description
          .replace(/line/g, key).split(',').sort();

        tempComment.commentLabel = `${comment.replies.length + 1}`;

        return tempComment;
      });
  });

  const onLineNumberClick = (lineId: string, isNewSelection: boolean): void => {
    if (isNewSelection) {
      setHighlightLines((prevState: string[]) => [...prevState, lineId]);
    } else {
      setHighlightLines((prevState: string[]) => (
        prevState.filter((oldLine: string) => oldLine !== lineId)
      ));
    }
  };

  const onCommentClick = (comment: Record<string, any>, prefix: string) => {
    console.log('[COMMENT]:', comment, prefix);
    setHighlightLines(comment.commentLines);
  };

  const onAddNewCommentStart = (selectedLines: string[], prefix: string) => {
    const prefixRegex = new RegExp(`${prefix}`, 'g');
    const formattedLines = selectedLines.map(line => line.replace(prefixRegex, 'line'));
    console.log('[SELECTED LINES]:', formattedLines, prefix);
  };

  const onClearHighlights = (): void => {
    setHighlightLines([]);
  };

  return (
    <DiffViewer
      {...props}
      highlightLines={highlightLines}
      onLineNumberClick={onLineNumberClick}
      onCommentClick={onCommentClick}
      onAddNewCommentStart={onAddNewCommentStart}
      onClearHighlights={onClearHighlights}
      comments={diffComments}
    />
  );
};

const story: ComponentMeta<typeof DiffWrapper> = {
  title: 'Components/Diff Viewer',
  component: DiffWrapper,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
};

export default story;

const Template: ComponentStory<typeof DiffWrapper> = (
  args: Record<string, any>,
): React.ReactNode => (
  <DiffWrapper {...args} />
);

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

SplitView.args = {
  oldValue: oldCode,
  newValue: newCode,
  splitView: true,
  canSelectLines: {
    L: false,
    R: true,
  },
};

InlineView.args = {
  oldValue: oldCode,
  newValue: newCode,
  splitView: false,
  canSelectLines: {
    L: false,
    R: false,
  },
};
