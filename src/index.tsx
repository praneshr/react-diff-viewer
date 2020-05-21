import * as React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classnames';

import {
  computeLineInformation,
  LineInformation,
  DiffInformation,
  DiffType,
  DiffMethod
} from './compute-lines';
import computeStyles, {
  ReactDiffViewerStylesOverride,
  ReactDiffViewerStyles
} from './styles';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const m = require('memoize-one');

const memoize = m.default || m;

export enum LineNumberPrefix {
  LEFT = 'L',
  RIGHT = 'R'
}

interface Comment {
  lineId: string;
  body: string;
  [key: string]: any;
}

export interface ReactDiffViewerProps {
  // Old value to compare.
  oldValue: string;
  // New value to compare.
  newValue: string;
  // Enable/Disable split view.
  splitView?: boolean;
  // Enable/Disable word diff.
  disableWordDiff?: boolean;
  // JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
  compareMethod?: DiffMethod;
  // Number of unmodified lines surrounding each line diff.
  extraLinesSurroundingDiff?: number;
  // Show/hide line number.
  hideLineNumbers?: boolean;
  // Show only diff between the two values.
  showDiffOnly?: boolean;
  // Render prop to format final string before displaying them in the UI.
  renderContent?: (source: string, uniqueLineId: string) => JSX.Element;
  // Render prop to format commentBlock component
  renderCommentBlock?: (lineNumber: string) => JSX.Element;
  // Render prop to format code fold message.
  codeFoldMessageRenderer?: (
    totalFoldedLines: number,
    leftStartLineNumber: number,
    rightStartLineNumber: number
  ) => JSX.Element;
  // Event handler for line number click.
  onLineNumberClick?: (
    lineId: string,
    uniqueLineId: string,
    event: React.MouseEvent<HTMLTableCellElement>
  ) => void;
  // Function return uniqueLineId
  getLineId?: (lineId: string) => void;
  // Array of line ids to highlight lines.
  highlightLines?: string[];
  // Style overrides.
  styles?: ReactDiffViewerStylesOverride;
  // Use dark theme.
  useDarkTheme?: boolean;
  // Title for left column
  leftTitle?: string | JSX.Element;
  // Title for left column
  rightTitle?: string | JSX.Element;
  // id target commit
  afterCommit: string;
  // id source commit
  beforeCommit: string;
  // comments
  comments?: Comment[];
  // commentBlock
  commentBlock?: JSX.Element;
  // filePath
  fileId: string;
  // plusBtn className
  plusBtnClassName: string;
}

export interface ReactDiffViewerState {
  // Array holding the expanded code folding.
  expandedBlocks?: number[];
  lineIdPlusShown?: string;
}

class DiffViewer extends React.Component<
  ReactDiffViewerProps,
  ReactDiffViewerState
> {
  private styles: ReactDiffViewerStyles;

  public static defaultProps: ReactDiffViewerProps = {
    oldValue: '',
    newValue: '',
    splitView: true,
    highlightLines: [],
    disableWordDiff: false,
    compareMethod: DiffMethod.CHARS,
    styles: {},
    hideLineNumbers: false,
    extraLinesSurroundingDiff: 3,
    showDiffOnly: true,
    useDarkTheme: false,
    afterCommit: '',
    beforeCommit: '',
    comments: undefined,
    fileId: '',
    plusBtnClassName: ''
  };

  public static propTypes = {
    oldValue: PropTypes.string.isRequired,
    newValue: PropTypes.string.isRequired,
    splitView: PropTypes.bool,
    disableWordDiff: PropTypes.bool,
    compareMethod: PropTypes.oneOf(Object.values(DiffMethod)),
    renderContent: PropTypes.func,
    onLineNumberClick: PropTypes.func,
    extraLinesSurroundingDiff: PropTypes.number,
    styles: PropTypes.object,
    hideLineNumbers: PropTypes.bool,
    showDiffOnly: PropTypes.bool,
    highlightLines: PropTypes.arrayOf(PropTypes.string),
    leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    afterCommit: PropTypes.string.isRequired,
    beforeCommit: PropTypes.string.isRequired,
    fileId: PropTypes.string.isRequired,
    plusBtnClassName: PropTypes.string
  };

  public constructor(props: ReactDiffViewerProps) {
    super(props);

    this.state = {
      expandedBlocks: [],
      lineIdPlusShown: ''
    };
  }

  /**
   * Resets code block expand to the initial stage. Will be exposed to the parent component via
   * refs.
   */
  public resetCodeBlocks = (): boolean => {
    if (this.state.expandedBlocks.length > 0) {
      this.setState({
        expandedBlocks: []
      });
      return true;
    }
    return false;
  };

  /**
   * Pushes the target expanded code block to the state. During the re-render,
   * this value is used to expand/fold unmodified code.
   */
  private onBlockExpand = (id: number): void => {
    const prevState = this.state.expandedBlocks.slice();
    prevState.push(id);

    this.setState({
      expandedBlocks: prevState
    });
  };

  /**
   * Computes final styles for the diff viewer. It combines the default styles with the user
   * supplied overrides. The computed styles are cached with performance in mind.
   *
   * @param styles User supplied style overrides.
   */
  private computeStyles: (
    styles: ReactDiffViewerStylesOverride,
    useDarkTheme: boolean
  ) => ReactDiffViewerStyles = memoize(computeStyles);

  /**
   * Returns a function with clicked line number in the closure. Returns an no-op function when no
   * onLineNumberClick handler is supplied.
   *
   * @param id Line id of a line.
   */
  private onLineNumberClickProxy = (id: string, uniqueLineId: string): any => {
    if (this.props.onLineNumberClick) {
      return (e: any): void =>
        this.props.onLineNumberClick(id, uniqueLineId, e);
    }
    return (): void => {};
  };

  /**
   * Maps over the word diff and constructs the required React elements to show word diff.
   *
   * @param diffArray Word diff information derived from line information.
   * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
   */
  private renderWordDiff = (
    diffArray: DiffInformation[],
    lineId: string,
    renderer?: (chunk: string, lineId: string) => JSX.Element
  ): JSX.Element[] => {
    return diffArray.map(
      (wordDiff, i): JSX.Element => {
        return (
          <span
            key={i}
            className={cn(this.styles.wordDiff, {
              [this.styles.wordAdded]: wordDiff.type === DiffType.ADDED,
              [this.styles.wordRemoved]: wordDiff.type === DiffType.REMOVED
            })}
          >
            {renderer
              ? renderer(wordDiff.value as string, lineId)
              : wordDiff.value}
          </span>
        );
      }
    );
  };

  /**
   * Maps over the line diff and constructs the required react elements to show line diff. It calls
   * renderWordDiff when encountering word diff. This takes care of both inline and split view line
   * renders.
   *
   * @param lineNumber Line number of the current line.
   * @param type Type of diff of the current line.
   * @param prefix Unique id to prefix with the line numbers.
   * @param value Content of the line. It can be a string or a word diff array.
   * @param additionalLineNumber Additional line number to be shown. Useful for rendering inline
   *  diff view. Right line number will be passed as additionalLineNumber.
   * @param additionalPrefix Similar to prefix but for additional line number.
   */
  private renderLine = (
    lineNumber: number,
    type: DiffType,
    prefix: LineNumberPrefix,
    value: string | DiffInformation[],
    uniqueLineId: string,
    additionalLineNumber?: number,
    additionalPrefix?: LineNumberPrefix
  ): JSX.Element => {
    const lineNumberTemplate = `${prefix}-${lineNumber}`;
    const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
    const highlightLine =
      this.props.highlightLines.includes(lineNumberTemplate) ||
      this.props.highlightLines.includes(additionalLineNumberTemplate);
    const added = type === DiffType.ADDED;
    const removed = type === DiffType.REMOVED;
    let content;

    if (Array.isArray(value)) {
      content = this.renderWordDiff(
        value,
        uniqueLineId,
        this.props.renderContent
      );
    } else if (this.props.renderContent) {
      content = this.props.renderContent(value, uniqueLineId);
    } else {
      content = value;
    }

    const showPlusBtn = (e: React.MouseEvent) => {
      if (added || removed) {
        this.handleHoverLineNumber(uniqueLineId);
      }
    };

    return (
      <React.Fragment>
        {!this.props.hideLineNumbers && (
          <td
            onClick={
              lineNumber &&
              this.onLineNumberClickProxy(lineNumberTemplate, uniqueLineId)
            }
            className={cn(this.styles.gutter, {
              [this.styles.emptyGutter]: !lineNumber,
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine
            })}
          >
            <span className={this.styles.lineNumber}>{lineNumber}</span>
          </td>
        )}
        {!this.props.splitView && !this.props.hideLineNumbers && (
          <td
            onClick={
              additionalLineNumber &&
              this.onLineNumberClickProxy(
                additionalLineNumberTemplate,
                uniqueLineId
              )
            }
            className={cn(this.styles.gutter, {
              [this.styles.emptyGutter]: !additionalLineNumber,
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine
            })}
          >
            <pre className={this.styles.lineNumber}>{additionalLineNumber}</pre>
          </td>
        )}
        <td
          className={cn(this.styles.marker, {
            [this.styles.emptyLine]: !content,
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.highlightedLine]: highlightLine
          })}
          onMouseEnter={showPlusBtn}
          onMouseLeave={showPlusBtn}
        >
          <pre>
            {added && '+'}
            {removed && '-'}
          </pre>
        </td>
        <td
          className={cn(this.styles.content, {
            [this.styles.emptyLine]: !content,
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.highlightedLine]: highlightLine
          })}
          onMouseEnter={showPlusBtn}
          onMouseLeave={showPlusBtn}
        >
          <pre className={this.styles.contentText}>{content}</pre>
          {this.renderPlusButton(
            this.state.lineIdPlusShown === uniqueLineId &&
              !this.props.comments.find(
                comment => comment.lineId === uniqueLineId
              ),
            uniqueLineId
          )}
        </td>
      </React.Fragment>
    );
  };

  /**
   *
   * shows and hides plus btn
   *
   * @param uniqueLineId unique line id(prefix, lineNumber, beforeCommit, afterCommit, fileId) of the current line .
   *
   */
  private handleHoverLineNumber = (uniqueLineId: string) => {
    if (this.props.comments) {
      this.setState(prevState => {
        if (prevState.lineIdPlusShown === uniqueLineId) {
          return {
            ...prevState,
            lineIdPlusShown: ''
          };
        } else {
          return {
            ...prevState,
            lineIdPlusShown: uniqueLineId
          };
        }
      });
    }
  };

  /**
   *
   * renders plusBtn
   *
   * @param isShown boolean hide/show
   * @param uniqueLineId unique line id(prefix, lineNumber, beforeCommit, afterCommit, fileId) of the current line .
   *
   */
  private renderPlusButton = (
    isShown: boolean,
    uniqueLineId: string
  ): JSX.Element => {
    if (!isShown) {
      return null;
    }
    return (
      <button
        className={this.props.plusBtnClassName || this.styles.plusBtn}
        onClick={this.getUniqueLineIdProxy(uniqueLineId)}
      >
        +
      </button>
    );
  };

  /**
   *
   * returns uniqueLineId to client
   *
   * @param uniqueLineId unique line id(prefix, lineNumber, beforeCommit, afterCommit, fileId) of the current line .
   *
   */
  private getUniqueLineIdProxy = (uniqueLineId: string) => {
    if (this.props.getLineId) {
      return (): void => this.props.getLineId(uniqueLineId);
    }
    return (): void => {};
  };

  private generateUniqueLineId = (
    lineNumber: number,
    specifier: string,
    prefix: string
  ) => {
    return `${prefix}-${lineNumber}-${specifier}-${this.props.fileId}`;
  };

  /**
   *
   * helper that return Array with uniqueLineIds (comment.lineId)
   *
   * @param arr Array with comments
   *
   */

  private getlineIdsArray = (arr: Comment[]) => {
    return arr.reduce((acc: Array<string>, comment) => {
      acc.push(comment.lineId);
      return acc;
    }, []);
  };

  /**
   *
   * renders comment block (split view)
   *
   * @param leftId left line unique line id
   * @param rightId right line unique line id
   *
   */
  private renderSplitCommentBlockProxy = (leftId: string, rightId: string) => {
    const lineIdsArray = this.props.comments
      ? this.getlineIdsArray(this.props.comments)
      : [];

    if (lineIdsArray.includes(leftId) || lineIdsArray.includes(rightId)) {
      return (
        <tr>
          <td colSpan={3}>
            {lineIdsArray.includes(leftId) &&
              this.props.renderCommentBlock(leftId)}
          </td>
          <td colSpan={3}>
            {lineIdsArray.includes(rightId) &&
              this.props.renderCommentBlock(rightId)}
          </td>
        </tr>
      );
    }

    return null;
  };

  /**
   *
   * renders comment block (inline view)
   *
   * @param uniqueLineId unique line id
   *
   */
  private renderInlineCommentBlockProxy = (uniqueLineId: string) => {
    const lineIdsArray = this.getlineIdsArray(this.props.comments);
    if (lineIdsArray.includes(uniqueLineId)) {
      return (
        <tr>
          <td colSpan={6}>{this.props.renderCommentBlock(uniqueLineId)}</td>
        </tr>
      );
    }

    return null;
  };

  /**
   * Generates lines for split view.
   *
   * @param obj Line diff information.
   * @param obj.left Life diff information for the left pane of the split view.
   * @param obj.right Life diff information for the right pane of the split view.
   * @param index React key for the lines.
   */
  private renderSplitView = (
    { left, right }: LineInformation,
    index: number
  ): JSX.Element => {
    const leftId = this.generateUniqueLineId(
      left.lineNumber,
      `${this.props.beforeCommit}-${this.props.afterCommit}`,
      LineNumberPrefix.LEFT
    );
    const rightId = this.generateUniqueLineId(
      right.lineNumber,
      `${this.props.beforeCommit}-${this.props.afterCommit}`,
      LineNumberPrefix.RIGHT
    );
    return (
      <React.Fragment key={index}>
        <tr className={this.styles.line}>
          {this.renderLine(
            left.lineNumber,
            left.type,
            LineNumberPrefix.LEFT,
            left.value,
            leftId
          )}
          {this.renderLine(
            right.lineNumber,
            right.type,
            LineNumberPrefix.RIGHT,
            right.value,
            rightId
          )}
        </tr>
        {this.renderSplitCommentBlockProxy(leftId, rightId)}
      </React.Fragment>
    );
  };

  /**
   * Generates lines for inline view.
   *
   * @param obj Line diff information.
   * @param obj.left Life diff information for the added section of the inline view.
   * @param obj.right Life diff information for the removed section of the inline view.
   * @param index React key for the lines.
   */
  public renderInlineView = (
    { left, right }: LineInformation,
    index: number
  ): JSX.Element => {
    let content;

    const leftId = this.generateUniqueLineId(
      left.lineNumber,
      `${this.props.beforeCommit}-${this.props.afterCommit}`,
      LineNumberPrefix.LEFT
    );
    const rightId = this.generateUniqueLineId(
      right.lineNumber,
      `${this.props.beforeCommit}-${this.props.afterCommit}`,
      LineNumberPrefix.RIGHT
    );

    let currLineId = '';

    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
      return (
        <React.Fragment key={index}>
          <tr className={this.styles.line}>
            {this.renderLine(
              left.lineNumber,
              left.type,
              LineNumberPrefix.LEFT,
              left.value,
              leftId,
              null
            )}
          </tr>
          {this.renderInlineCommentBlockProxy(leftId)}
          <tr className={this.styles.line}>
            {this.renderLine(
              null,
              right.type,
              LineNumberPrefix.RIGHT,
              right.value,
              rightId,
              right.lineNumber
            )}
          </tr>
          {this.renderInlineCommentBlockProxy(rightId)}
        </React.Fragment>
      );
    }
    if (left.type === DiffType.REMOVED) {
      content = this.renderLine(
        left.lineNumber,
        left.type,
        LineNumberPrefix.LEFT,
        left.value,
        leftId,
        null
      );
      currLineId = leftId;
    }
    if (left.type === DiffType.DEFAULT) {
      content = this.renderLine(
        left.lineNumber,
        left.type,
        LineNumberPrefix.LEFT,
        left.value,
        leftId,
        right.lineNumber,
        LineNumberPrefix.RIGHT
      );
      currLineId = leftId;
    }
    if (right.type === DiffType.ADDED) {
      content = this.renderLine(
        null,
        right.type,
        LineNumberPrefix.RIGHT,
        right.value,
        rightId,
        right.lineNumber
      );
      currLineId = rightId;
    }

    return (
      <>
        <tr key={index} className={this.styles.line}>
          {content}
        </tr>
        {this.renderInlineCommentBlockProxy(currLineId)}
      </>
    );
  };

  /**
   * Returns a function with clicked block number in the closure.
   *
   * @param id Cold fold block id.
   */
  private onBlockClickProxy = (id: number): any => (): void =>
    this.onBlockExpand(id);

  /**
   * Generates cold fold block. It also uses the custom message renderer when available to show
   * cold fold messages.
   *
   * @param num Number of skipped lines between two blocks.
   * @param blockNumber Code fold block id.
   * @param leftBlockLineNumber First left line number after the current code fold block.
   * @param rightBlockLineNumber First right line number after the current code fold block.
   */
  private renderSkippedLineIndicator = (
    num: number,
    blockNumber: number,
    leftBlockLineNumber: number,
    rightBlockLineNumber: number
  ): JSX.Element => {
    const { hideLineNumbers, splitView } = this.props;
    const message = this.props.codeFoldMessageRenderer ? (
      this.props.codeFoldMessageRenderer(
        num,
        leftBlockLineNumber,
        rightBlockLineNumber
      )
    ) : (
      <pre className={this.styles.codeFoldContent}>Expand {num} lines ...</pre>
    );
    const content = (
      <td>
        <a onClick={this.onBlockClickProxy(blockNumber)} tabIndex={0}>
          {message}
        </a>
      </td>
    );
    const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
    return (
      <tr
        key={`${leftBlockLineNumber}-${rightBlockLineNumber}`}
        className={this.styles.codeFold}
      >
        {!hideLineNumbers && <td className={this.styles.codeFoldGutter} />}
        <td
          className={cn({
            [this.styles.codeFoldGutter]: isUnifiedViewWithoutLineNumbers
          })}
        />

        {/* Swap columns only for unified view without line numbers */}
        {isUnifiedViewWithoutLineNumbers ? (
          <React.Fragment>
            <td />
            {content}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {content}
            <td />
          </React.Fragment>
        )}

        <td />
        <td />
      </tr>
    );
  };

  /**
   * Generates the entire diff view.
   */
  private renderDiff = (): JSX.Element[] => {
    const {
      oldValue,
      newValue,
      splitView,
      disableWordDiff,
      compareMethod
    } = this.props;
    const { lineInformation, diffLines } = computeLineInformation(
      oldValue,
      newValue,
      disableWordDiff,
      compareMethod
    );
    const extraLines =
      this.props.extraLinesSurroundingDiff < 0
        ? 0
        : this.props.extraLinesSurroundingDiff;
    let skippedLines: number[] = [];
    return lineInformation.map(
      (line: LineInformation, i: number): JSX.Element => {
        const diffBlockStart = diffLines[0];
        const currentPosition = diffBlockStart - i;
        if (this.props.showDiffOnly) {
          if (currentPosition === -extraLines) {
            skippedLines = [];
            diffLines.shift();
          }
          if (
            line.left.type === DiffType.DEFAULT &&
            (currentPosition > extraLines ||
              typeof diffBlockStart === 'undefined') &&
            !this.state.expandedBlocks.includes(diffBlockStart)
          ) {
            skippedLines.push(i + 1);
            if (i === lineInformation.length - 1 && skippedLines.length > 1) {
              return this.renderSkippedLineIndicator(
                skippedLines.length,
                diffBlockStart,
                line.left.lineNumber,
                line.right.lineNumber
              );
            }
            return null;
          }
        }

        const diffNodes = splitView
          ? this.renderSplitView(line, i)
          : this.renderInlineView(line, i);

        if (currentPosition === extraLines && skippedLines.length > 0) {
          const { length } = skippedLines;
          skippedLines = [];
          return (
            <React.Fragment key={i}>
              {this.renderSkippedLineIndicator(
                length,
                diffBlockStart,
                line.left.lineNumber,
                line.right.lineNumber
              )}
              {diffNodes}
            </React.Fragment>
          );
        }
        return diffNodes;
      }
    );
  };

  public render = (): JSX.Element => {
    const {
      oldValue,
      newValue,
      useDarkTheme,
      leftTitle,
      rightTitle,
      splitView
    } = this.props;

    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
      throw Error('"oldValue" and "newValue" should be strings');
    }

    this.styles = this.computeStyles(this.props.styles, useDarkTheme);
    const nodes = this.renderDiff();

    const title = (leftTitle || rightTitle) && (
      <tr>
        <td colSpan={splitView ? 3 : 5} className={this.styles.titleBlock}>
          <pre className={this.styles.contentText}>{leftTitle}</pre>
        </td>
        {splitView && (
          <td colSpan={3} className={this.styles.titleBlock}>
            <pre className={this.styles.contentText}>{rightTitle}</pre>
          </td>
        )}
      </tr>
    );

    return (
      <table
        className={cn(this.styles.diffContainer, {
          [this.styles.splitView]: splitView
        })}
      >
        <tbody>
          {title}
          {nodes}
        </tbody>
      </table>
    );
  };
}

export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };
