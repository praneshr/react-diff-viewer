import { shallow } from 'enzyme';
import * as React from 'react';
import * as expect from 'expect';

import DiffViewer from '../lib/index';

const oldCode = `
const a = 123
const b = 456
const c = 4556
const d = 4566
const e = () => {
  console.log('c')
}
`;

const newCode = `
const a = 123
const b = 456
const c = 4556
const d = 4566
const aa = 123
const bb = 456
`;

describe('Testing react diff viewer', (): void => {
  it('It should render a table', (): void => {
    const node = shallow(<DiffViewer
      oldValue={oldCode}
      newValue={newCode}
    />);

    expect(node.find('table').length).toEqual(1);
  });

  it('It should render diff lines in diff view', (): void => {
    const node = shallow(<DiffViewer
      oldValue={oldCode}
      newValue={newCode}
    />);

    expect(node.find('table > tbody tr').length).toEqual(7);
  });

  it('It should render diff lines in inline view', (): void => {
    const node = shallow(<DiffViewer
      oldValue={oldCode}
      newValue={newCode}
      splitView={false}
    />);

    expect(node.find('table > tbody tr').length).toEqual(9);
  });

  it('It should allow overriding styles', (): void => {
    shallow(<DiffViewer
      oldValue={oldCode}
      newValue={newCode}
      styles={{
        diffContainer: { background: "red" },
        diffRemoved: { background: "red" },
        diffAdded: { background: "red" },
        splitView: { background: "red" },
        marker: { background: "red" },
        highlightedGutter: { background: "red" },
        highlightedLine: { background: "red" },
        gutter: { background: "red" },
        line: { background: "red" },
        wordDiff: { background: "red" },
        wordAdded: { background: "red" },
        wordRemoved: { background: "red" },
        codeFoldGutter: { background: "red" },
        codeFold: { background: "red" },
        emptyGutter: { background: "red" },
        emptyLine: { background: "red" },
        lineNumber: { background: "red" },
        contentText: { background: "red" },
        content: { background: "red" },
        codeFoldContent: { background: "red" },
        titleBlock: { background: "red" },
      }}
    />);
  })
});
