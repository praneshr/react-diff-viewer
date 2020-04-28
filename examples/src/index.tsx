require('./style.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ReactDiff, { DiffMethod } from '../../lib/index';

const oldJs = require('./diff/javascript/old.rjs').default;
const newJs = require('./diff/javascript/new.rjs').default;

const logo = require('../../logo.png');

interface ExampleState {
  splitView?: boolean;
  highlightLine?: string[];
  language?: string;
  enableSyntaxHighlighting?: boolean;
  compareMethod?: DiffMethod;
}

const P = (window as any).Prism;

class Example extends React.Component<{}, ExampleState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      highlightLine: [],
      enableSyntaxHighlighting: true
    };
  }

  componentDidMount() {
    this.scrollToLine();
  }

  componentWillUnMount() {
    this.scrollToLine();
  }

  private scrollToLine() {
    if (location.hash) {
      const row: HTMLElement | null = document.querySelector(location.hash);
      row && row.scrollIntoView();
    }
  }

  private onLineNumberClick = (
    id: string,
    rowId: string,
    e: React.MouseEvent<HTMLTableCellElement>
  ): void => {
    let highlightLine = [id];
    if (e.shiftKey && this.state.highlightLine.length === 1) {
      const [dir, oldId] = this.state.highlightLine[0].split('-');
      const [newDir, newId] = id.split('-');
      if (dir === newDir) {
        highlightLine = [];
        const lowEnd = Math.min(Number(oldId), Number(newId));
        const highEnd = Math.max(Number(oldId), Number(newId));
        for (let i = lowEnd; i <= highEnd; i++) {
          highlightLine.push(`${dir}-${i}`);
        }
      }
    }
    this.copyLinkToClipboard(rowId);
    this.setState({
      highlightLine
    });
  };

  private copyLinkToClipboard(rowId: string) {
    const link = `${location.origin}#${rowId}`;
    var el = document.createElement('textarea');
    el.value = link;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  private syntaxHighlight = (str: string): any => {
    if (!str) return;
    const language = P.highlight(str, P.languages.javascript);
    return <span dangerouslySetInnerHTML={{ __html: language }} />;
  };

  public render(): JSX.Element {
    return (
      <div className='react-diff-viewer-example'>
        <div className='radial'></div>
        <div className='banner'>
          <div className='img-container'>
            <img src={logo} alt='React Diff Viewer Logo' />
          </div>
          <p>
            A simple and beautiful text diff viewer made with{' '}
            <a href='https://github.com/kpdecker/jsdiff' target='_blank'>
              Diff{' '}
            </a>
            and{' '}
            <a href='https://reactjs.org' target='_blank'>
              React.{' '}
            </a>
            Featuring split view, inline view, word diff, line highlight and
            more.
          </p>
          <div className='cta'>
            <a href='https://github.com/praneshr/react-diff-viewer#install'>
              <button type='button' className='btn btn-primary btn-lg'>
                Documentation
              </button>
            </a>
          </div>
        </div>
        <div className='diff-viewer'>
          <ReactDiff
            highlightLines={this.state.highlightLine}
            onLineNumberClick={this.onLineNumberClick}
            oldValue={oldJs}
            splitView
            newValue={newJs}
            renderContent={this.syntaxHighlight}
            useDarkTheme
            leftTitle='webpack.config.js master@2178133 - pushed 2 hours ago.'
            rightTitle='webpack.config.js master@64207ee - pushed 13 hours ago.'
            specifier='test'
          />
        </div>
        <footer>
          Made with 💓 by{' '}
          <a href='https://praneshravi.in' target='_blank'>
            Pranesh Ravi
          </a>
        </footer>
      </div>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById('app'));
