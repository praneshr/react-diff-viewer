import * as React from 'react';
import * as diff from 'diff';
import * as PropTypes from 'prop-types';
import cn from 'classnames';

import computeLines, {
  LineInformation,
  DiffInformation,
  DiffType,
} from './compute-lines';
import computeStyles, {
  IReactDiffViewerStylesOverride,
  IReactDiffViewerStyles,
} from './styles';

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
  hideLineNumbers?: boolean;
  showDiffOnly?: boolean;
  renderContent?: (source: string) => JSX.Element;
  onLineNumberClick?: (
    lineId: string,
    event: React.MouseEvent<HTMLTableCellElement>,
  ) => void;
  highlightLines?: string[];
  styles?: IReactDiffViewerStylesOverride;
}

class DiffViewer extends React.Component<ReactDiffViewerProps, {}> {
  private styles: IReactDiffViewerStyles;

  public static defaultProps: ReactDiffViewerProps = {
    oldValue: '',
    newValue: '',
    splitView: true,
    highlightLines: [],
    disableWordDiff: false,
    styles: {},
    hideLineNumbers: false,
    showDiffOnly: false,
  };

  public static propTypes = {
    oldValue: PropTypes.string.isRequired,
    newValue: PropTypes.string.isRequired,
    splitView: PropTypes.bool,
    disableWordDiff: PropTypes.bool,
    renderContent: PropTypes.func,
    onLineNumberClick: PropTypes.func,
    styles: PropTypes.object,
    hideLineNumbers: PropTypes.bool,
    showDiffOnly: PropTypes.bool,
    highlightLines: PropTypes.arrayOf(PropTypes.string),
  };

  private computeStyles = memoize(computeStyles);

  private onLineNumberClickProxy = (id: string): any => {
    if (this.props.onLineNumberClick) {
      return (e: any): void => this.props.onLineNumberClick(id, e);
    }
    return (): void => {};
  };

  private renderLine = (
    lineNumber: number,
    type: DiffType,
    prefix: LineNumberPrefix,
    value: string,
    additionalLineNumber?: number,
  ): JSX.Element => {
    const lineNumberTemplate = `${prefix}-${lineNumber}`;
    const highlightLine = this.props.highlightLines.includes(
      lineNumberTemplate,
    );
    // if (this.props.showDiffOnly && type === DiffType.DEFAULT) {
    //   return null;
    // }
    const added = type === DiffType.ADDED;
    const removed = type === DiffType.REMOVED;
    return (
      <React.Fragment>
        <td
          onClick={this.onLineNumberClickProxy(lineNumberTemplate)}
          className={cn(this.styles.gutter, {
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.hightlightedGutter]: highlightLine,
          })}
        >
          <pre>{lineNumber}</pre>
        </td>
        {!this.props.splitView && (
          <td
            onClick={this.onLineNumberClickProxy(lineNumberTemplate)}
            className={cn(this.styles.gutter, {
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.hightlightedGutter]: highlightLine,
            })}
          >
            <pre>{additionalLineNumber}</pre>
          </td>
        )}
        <td
          className={cn(this.styles.marker, {
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.hightlightedLine]: highlightLine,
          })}
        >
          <pre>
            {added && '+'}
            {removed && '-'}
          </pre>
        </td>
        <td
          className={cn({
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.hightlightedLine]: highlightLine,
          })}
        >
          <pre>
            {this.props.renderContent ? this.props.renderContent(value) : value}
          </pre>
        </td>
      </React.Fragment>
    );
  };

  private renderSplitView = (
    { left, right }: LineInformation,
    index: number,
    diffIndexes?: number[],
  ): JSX.Element => {
    return (
      <tr key={index}>
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
    diffIndexes?: number[],
  ): JSX.Element => {
    let content;
    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
      content = (
        <React.Fragment>
          {this.renderLine(
            left.lineNumber,
            left.type,
            LineNumberPrefix.LEFT,
            left.value,
            null,
          )}
          {this.renderLine(
            null,
            right.type,
            LineNumberPrefix.LEFT,
            right.value,
            right.lineNumber,
          )}
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

    return <tr key={index}>{content}</tr>;
  };

  private renderSkippedLineIndicator = (
    num: number,
    i: number,
  ): JSX.Element => {
    return (
      <tr
        key={Math.round(100).toString()}
        style={{ background: '#f1f8ff', fontSize: 14 }}
      >
        <td />
        <td />
        <td>Skipped {num} lines...</td>
        <td />
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

    const { lineInformation, diffLines } = computeLines(diffArray);
    let skippedLineCounter = 0;
    const nodes = lineInformation.map(
      (line: LineInformation, i: number): JSX.Element => {
        const firstDiffLine = diffLines[0];
        const diffPosition = firstDiffLine - i;
        if (this.props.showDiffOnly) {
          if (diffPosition === -3) {
            skippedLineCounter = 0;
            diffLines.shift();
          }
          if (
            line.left.type === DiffType.DEFAULT &&
            (diffPosition > 3 || typeof firstDiffLine === 'undefined')
          ) {
            skippedLineCounter += 1;
            if (i === lineInformation.length - 1 && skippedLineCounter > 0) {
              return this.renderSkippedLineIndicator(skippedLineCounter, i);
            }
            return null;
          }
        }

        const diffNodes = splitView
          ? this.renderSplitView(line, i)
          : this.renderInlineView(line, i);

        if (diffPosition === 3 && skippedLineCounter > 0) {
          return (
            <React.Fragment key={i}>
              {this.renderSkippedLineIndicator(skippedLineCounter, i)}
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
export { IReactDiffViewerStylesOverride };
