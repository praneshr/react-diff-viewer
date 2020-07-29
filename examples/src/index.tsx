import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactDiff, { DiffMethod } from '../../lib/index';
import CommentBlock from './CommentBlock';
import { CommentInfo } from '../../lib/index';
const oldJs = require('./diff/javascript/old.rjs').default;
const newJs = require('./diff/javascript/new.rjs').default;
const logo = require('../../logo.png');
require('./style.scss');

interface ExampleState {
  splitView?: boolean;
  highlightLine?: string[];
  language?: string;
  enableSyntaxHighlighting?: boolean;
  compareMethod?: DiffMethod;
  comments: any[];
}

const P = (window as any).Prism;

class Example extends React.Component<{}, ExampleState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      highlightLine: [],
      enableSyntaxHighlighting: true,
      comments: [
        {
          body: {
            lineId: 'L-12-beforeCommit-afterCommit-test/test.jsx',
            text: 'Awesome\ncomment!',
            fileId: 'test/test.jsx',
            prefix: 'L',
            lineNumber: 12,
            specifier: 'beforeCommit-afterCommit'
          }
        }
      ]
    };
  }

  private onLineNumberClick = (
    id: string,
    uiniqueLindeId: string,
    e: React.MouseEvent<HTMLTableCellElement>
  ): void => {
    console.log(uiniqueLindeId);
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
    this.setState({
      highlightLine
    });
  };

  private syntaxHighlight = (source: string, lineId?: string): any => {
    if (!source) return;
    const language = P.highlight(source, P.languages.javascript);
    return <span id={lineId} dangerouslySetInnerHTML={{ __html: language }} />;
  };

  private updateComment = (commentInfo: any, text?: string) => {
    const updatedComments = this.state.comments.map(comment => {
      console.log(comment);
      if (comment.lineId === commentInfo.lineId) {
        return {
          ...commentInfo,
          lineId: commentInfo.uniqueLineId,
          body: text
        };
      }
      return comment;
    });

    this.setState({
      comments: updatedComments
    });
  };

  private removeComment = (lineId: string) => {
    const updatedComments = this.state.comments.filter(
      comment => comment.lineId !== lineId
    );
    this.setState({ comments: updatedComments });
  };

  private createComment = (commentInfo: CommentInfo) => {
    const updatedComments = [
      ...this.state.comments,
      {
        body: {
          ...commentInfo,
          lineId: commentInfo.lineId,
          text: ''
        }
      }
    ];
    this.setState({ comments: updatedComments });
  };

  /**
   *
   * helper that return Array with uniqueLineIds (comment.lineId)
   *
   * @param arr Array with commentLineIds
   *
   */

  private getlineIdsArray = (arr: any[]) => {
    return arr.reduce((acc: Array<string>, comment) => {
      acc.push(comment.body.lineId);
      return acc;
    }, []);
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
            afterCommit={'afterCommit'}
            beforeCommit={'beforeCommit'}
            commentLineIds={this.getlineIdsArray(this.state.comments)}
            getCommentInfo={commentInfo => this.createComment(commentInfo)}
            renderCommentBlock={commentInfo => {
              console.log(commentInfo);
              const currComment = this.state.comments.find(
                comment => comment.body.lineId === commentInfo.lineId
              );
              return (
                <CommentBlock
                  updateComment={this.updateComment}
                  removeComment={this.removeComment}
                  comment={currComment}
                  show={!!currComment.body.text}
                />
              );
            }}
            fileId={'test/test.jsx'}
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
