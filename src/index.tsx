import * as React from 'react';
import * as diff from 'diff';
import * as PropTypes from 'prop-types';
import cn from 'classnames';

import computeLines, { LineInformation, DiffInformation, DiffType } from './compute-lines';
import computeStyles, { ReactDiffViewerStylesOverride, ReactDiffViewerStyles } from './styles';

const m = require('memoize-one');

const memoize = m.default || m;

export enum LineNumberPrefix {
  LEFT = 'L',
  RIGHT = 'R',
}

export interface ReactDiffViewerProps {
  oldValue: string;
  newValue: string;
  splitView?: boolean;
  disableWordDiff?: boolean;
  extraLinesSurroundingDiff?: number;
  hideLineNumbers?: boolean;
  showDiffOnly?: boolean;
  renderContent?: (source: string) => JSX.Element;
  codeFoldMessageRenderer?: (
    totalFoldedLines: number,
    leftStartLineNumber: number,
    rightStartLineNumber: number,
  ) => JSX.Element;
  onLineNumberClick?: (
    lineId: string,
    event: React.MouseEvent<HTMLTableCellElement>,
  ) => void;
  highlightLines?: string[];
  styles?: ReactDiffViewerStylesOverride;
}

export interface ReactDiffViewerState {
  expandedBlocks?: number[];
}

class DiffViewer extends React.Component<ReactDiffViewerProps, ReactDiffViewerState> {
  private styles: ReactDiffViewerStyles;

  public static defaultProps: ReactDiffViewerProps = {
    oldValue: '',
    newValue: '',
    splitView: true,
    highlightLines: [],
    disableWordDiff: false,
    styles: {},
    hideLineNumbers: false,
    extraLinesSurroundingDiff: 3,
    showDiffOnly: true,
  };

  public static propTypes = {
    oldValue: PropTypes.string.isRequired,
    newValue: PropTypes.string.isRequired,
    splitView: PropTypes.bool,
    disableWordDiff: PropTypes.bool,
    renderContent: PropTypes.func,
    onLineNumberClick: PropTypes.func,
    extraLinesSurroundingDiff: PropTypes.number,
    styles: PropTypes.object,
    hideLineNumbers: PropTypes.bool,
    showDiffOnly: PropTypes.bool,
    highlightLines: PropTypes.arrayOf(PropTypes.string),
  };

  public constructor(props: ReactDiffViewerProps) {
    super(props);

    this.state = {
      expandedBlocks: [],
    };
  }

  private onBlockExpand = (id: number): void => {
    const prevState = this.state.expandedBlocks.slice();
    prevState.push(id);

    this.setState({
      expandedBlocks: prevState,
    });
  };

  private computeStyles: (styles: ReactDiffViewerStylesOverride) => ReactDiffViewerStyles = memoize(computeStyles);

  private onLineNumberClickProxy = (id: string): any => {
    if (this.props.onLineNumberClick) {
      return (e: any): void => this.props.onLineNumberClick(id, e);
    }
    return (): void => { };
  };

  private renderWordDiff = (
    diffArray: DiffInformation[],
    renderer: (chunk: string) => JSX.Element,
  ): JSX.Element[] => {
    return diffArray.map(
      (wordDiff, i): JSX.Element => {
        return (
          <span
            key={i}
            className={cn(this.styles.wordDiff, {
              [this.styles.wordAdded]: wordDiff.type === DiffType.ADDED,
              [this.styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
            })}
          >
            {renderer ? renderer(wordDiff.value as string) : wordDiff.value}
          </span>
        );
      },
    );
  };

  private renderLine = (
    lineNumber: number,
    type: DiffType,
    prefix: LineNumberPrefix,
    value: string | DiffInformation[],
    additionalLineNumber?: number,
    additionalPrefix?: LineNumberPrefix,
  ): JSX.Element => {
    const lineNumberTemplate = `${prefix}-${lineNumber}`;
    const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
    const highlightLine = this.props.highlightLines.includes(lineNumberTemplate)
      || this.props.highlightLines.includes(additionalLineNumberTemplate);
    const added = type === DiffType.ADDED;
    const removed = type === DiffType.REMOVED;
    let content;
    if (Array.isArray(value)) {
      content = this.renderWordDiff(value, this.props.renderContent);
    } else if (this.props.renderContent) {
      content = this.props.renderContent(value);
    } else {
      content = value;
    }

    return (
      <React.Fragment>
        {!this.props.hideLineNumbers && (
          <td
            onClick={
              lineNumber && this.onLineNumberClickProxy(lineNumberTemplate)
            }
            className={cn(this.styles.gutter, {
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine,
            })}
          >
            <pre>{lineNumber}</pre>
          </td>
        )}
        {!this.props.splitView && !this.props.hideLineNumbers && (
          <td
            onClick={
              additionalLineNumber
              && this.onLineNumberClickProxy(additionalLineNumberTemplate)
            }
            className={cn(this.styles.gutter, {
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine,
            })}
          >
            <pre>{additionalLineNumber}</pre>
          </td>
        )}
        <td
          className={cn(this.styles.marker, {
            [this.styles.emptyLine]: !content,
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.highlightedLine]: highlightLine,
          })}
        >
          <pre>
            {added && '+'}
            {removed && '-'}
          </pre>
        </td>
        <td
          className={cn({
            [this.styles.emptyLine]: !content,
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.highlightedLine]: highlightLine,
          })}
        >
          <pre>{content}</pre>
        </td>
      </React.Fragment>
    );
  };

  private renderSplitView = (
    { left, right }: LineInformation,
    index: number,
  ): JSX.Element => {
    return (
      <tr key={index} className={this.styles.line}>
        {this.renderLine(
          left.lineNumber,
          left.type,
          LineNumberPrefix.LEFT,
          left.value,
        )}
        {this.renderLine(
          right.lineNumber,
          right.type,
          LineNumberPrefix.RIGHT,
          right.value,
        )}
      </tr>
    );
  };

  public renderInlineView = (
    { left, right }: LineInformation,
    index: number,
  ): JSX.Element => {
    let content;
    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
      return (
        <React.Fragment key={index}>
          <tr className={this.styles.line}>
            {this.renderLine(
              left.lineNumber,
              left.type,
              LineNumberPrefix.LEFT,
              left.value,
              null,
            )}
          </tr>
          <tr className={this.styles.line}>
            {this.renderLine(
              null,
              right.type,
              LineNumberPrefix.RIGHT,
              right.value,
              right.lineNumber,
            )}
          </tr>
        </React.Fragment>
      );
    }
    if (left.type === DiffType.REMOVED) {
      content = this.renderLine(
        left.lineNumber,
        left.type,
        LineNumberPrefix.LEFT,
        left.value,
        null,
      );
    }
    if (left.type === DiffType.DEFAULT) {
      content = this.renderLine(
        left.lineNumber,
        left.type,
        LineNumberPrefix.LEFT,
        left.value,
        right.lineNumber,
        LineNumberPrefix.RIGHT,
      );
    }
    if (right.type === DiffType.ADDED) {
      content = this.renderLine(
        null,
        right.type,
        LineNumberPrefix.RIGHT,
        right.value,
        right.lineNumber,
      );
    }

    return <tr key={index} className={this.styles.line}>{content}</tr>;
  };

  private onBlockClickProxy = (id: number): any => (): void => this.onBlockExpand(id);

  private renderSkippedLineIndicator = (
    num: number,
    blockNumber: number,
    leftBlockLineNumber: number,
    rightBlockLineNumber: number,
  ): JSX.Element => {
    const { splitView } = this.props;
    const message = this.props.codeFoldMessageRenderer
      ? this.props
        .codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)
      : <pre>Expand {num} lines ...</pre>;
    const content = (
      <td>
        <a onClick={this.onBlockClickProxy(blockNumber)} tabIndex={0}>
          {message}
        </a>
      </td>
    );
    return (
      <tr key={Math.round(100).toString()} className={this.styles.codeFold}>
        {!this.props.hideLineNumbers && (
          <td className={this.styles.codeFoldGutter} />
        )}
        <td className={cn({ [this.styles.codeFoldGutter]: !splitView })} />
        {splitView ? content : <td />}
        {!splitView ? content : <td />}
        <td />
        <td />
      </tr>
    );
  };

  public render = (): JSX.Element => {
    const { oldValue, newValue, splitView } = this.props;

    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
      throw Error('"oldValue" and "newValue" should be strings');
    }

    this.styles = this.computeStyles(this.props.styles);

    const diffArray = diff.diffLines(
      oldValue.trimRight(),
      newValue.trimRight(),
      {
        newlineIsToken: true,
        ignoreWhitespace: false,
        ignoreCase: false,
      },
    );

    const { lineInformation, diffLines } = computeLines(
      diffArray,
      this.props.disableWordDiff,
    );
    const extraLines = this.props.extraLinesSurroundingDiff;
    let skippedLines: number[] = [];
    const nodes = lineInformation.map(
      (line: LineInformation, i: number): JSX.Element => {
        const diffBlockStart = diffLines[0];
        const currentPosition = diffBlockStart - i;
        if (this.props.showDiffOnly) {
          if (currentPosition === -extraLines) {
            skippedLines = [];
            diffLines.shift();
          }
          if (
            line.left.type === DiffType.DEFAULT
            && (currentPosition > extraLines
              || typeof diffBlockStart === 'undefined')
            && !this.state.expandedBlocks.includes(diffBlockStart)
          ) {
            skippedLines.push(i + 1);
            if (i === lineInformation.length - 1 && skippedLines.length > 1) {
              return this.renderSkippedLineIndicator(
                skippedLines.length,
                diffBlockStart,
                line.left.lineNumber,
                line.right.lineNumber,
              );
            }
            return null;
          }
        }

        const diffNodes = splitView
          ? this.renderSplitView(line, i)
          : this.renderInlineView(line, i);

        if (currentPosition === extraLines && skippedLines.length > 1) {
          const { length } = skippedLines;
          skippedLines = [];
          return (
            <React.Fragment key={i}>
              {this.renderSkippedLineIndicator(
                length,
                diffBlockStart,
                line.left.lineNumber,
                line.right.lineNumber,
              )}
              {diffNodes}
            </React.Fragment>
          );
        }
        return diffNodes;
      },
    );

    return (
      <table className={this.styles.diffContainer}>
        <tbody>{nodes}</tbody>
      </table>
    );
  };
}

export default DiffViewer;
export { ReactDiffViewerStylesOverride };
