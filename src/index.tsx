import * as React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classnames';

import {
  computeLineInformation,
  LineInformation,
  DiffInformation,
  DiffType,
  DiffMethod,
} from './compute-lines';
import computeStyles, {
  ReactDiffViewerStylesOverride,
  ReactDiffViewerStyles,
} from './styles';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const m = require('memoize-one');

const memoize = m.default || m;

export enum LineNumberPrefix {
  LEFT = 'L',
  RIGHT = 'R',
}

interface LineData {
  lineNumberText?: string | React.ReactNode;
  additionalLineNumberText?: string | React.ReactNode;
}

export interface ReactDiffViewerProps {
  // Old value to compare.
  oldValue: string;
  // New value to compare.
  newValue: string;
  // Enable/Disable split view.
  splitView?: boolean;
  // Set line Offset
  linesOffset?: number;
  // Enable/Disable word diff.
  disableWordDiff?: boolean;
  // JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
  compareMethod?: DiffMethod;
  // Number of unmodified lines surrounding each line diff.
  extraLinesSurroundingDiff?: number;
  // Show/hide line number.
  hideLineNumbers?: boolean;
  // Enables the line selection feature
  canSelectLines?: {
    L: boolean;
    R: boolean;
  };
  // Show only diff between the two values.
  showDiffOnly?: boolean;
  // Render prop to format final string before displaying them in the UI.
  renderContent?: (source: string) => JSX.Element;
  // Render prop to format code fold message.
  codeFoldMessageRenderer?: (
    totalFoldedLines: number,
    leftStartLineNumber: number,
    rightStartLineNumber: number,
  ) => JSX.Element;
  // Event handler for line number click.
  onLineNumberClick?: (
    lineId: string,
    isNewSelection: boolean,
    prefix: string,
    event: React.MouseEvent<HTMLTableCellElement>,
  ) => void;
  // Comments for the left and right panels
  comments?: {
    L: Record<string, any>[];
    R: Record<string, any>[];
  };
  // Event handler for comment click.
  onCommentClick?: (
    comment: Record<string, any>,
    commentLines: string[],
    prefix: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  // Event handler for initialing the process for adding a new comment click.
  onAddNewCommentStart?: (
    selectedLines: string[],
    prefix: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  // Array of line ids to highlight lines.
  highlightLines?: string[];
  /** Event handler for when the clear button is clicked.
   * Expected to trigger a wipe for `highlightLines`.
   */
  onClearHighlights?: () => void;
  /** Event handler triggered when lines are highlighted in a batch,
   * such as when a comment that references a set of lines is clicked.
   * @param highlightedLines array of line Ids of the highlighted lines
   * @param prefix prefix for the direction of the viewer the highlights were from.
   */
  onHighlightLines?: (highlightedLines: string[], prefix: string) => void;
  // Style overrides.
  styles?: ReactDiffViewerStylesOverride;
  // Use dark theme.
  useDarkTheme?: boolean;
  // Title for left column
  leftTitle?: string | JSX.Element;
  // Title for left column
  rightTitle?: string | JSX.Element;
}

export interface ReactDiffViewerState {
  // Array holding the expanded code folding.
  expandedBlocks?: number[];
  // Object holding additional data for each rendered line.
  lineData?: Record<string, LineData>;
  // Object holding additional data for each rendered line.
  sortedHighlightLines?: {
    L: string[];
    R: string[];
  };
  // Object holding additional data for each rendered line.
  canAddNewComment?: boolean;
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
    canSelectLines: {
      L: true,
      R: true,
    },
    comments: {
      L: [],
      R: [],
    },
    extraLinesSurroundingDiff: 3,
    showDiffOnly: true,
    useDarkTheme: false,
    linesOffset: 0,
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
    canSelectLines: PropTypes.objectOf(PropTypes.bool),
    showDiffOnly: PropTypes.bool,
    highlightLines: PropTypes.arrayOf(PropTypes.string),
    leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    linesOffset: PropTypes.number,
  };

  public constructor(props: ReactDiffViewerProps) {
    super(props);

    this.state = {
      expandedBlocks: [],
      lineData: {},
      sortedHighlightLines: {
        L: [],
        R: [],
      },
      canAddNewComment: true,
    };
  }

  public componentDidMount() {
    this.sortAndStoreHighlightLinesByPrefix(this.props.highlightLines);
  }

  public componentDidUpdate(
    prevProps: Readonly<ReactDiffViewerProps>,
    prevState: Readonly<ReactDiffViewerState>,
    snapshot?: any,
  ) {
    if (prevProps.highlightLines.length !== this.props.highlightLines.length) {
      this.sortAndStoreHighlightLinesByPrefix(this.props.highlightLines);
    }
  }

  private filterLinesByPrefix = (lineIdArray: string[], prefix: string) => (
    lineIdArray.filter((lineId): boolean => lineId.startsWith(prefix))
  );

  private arrangeSelectedLines = (lineIdArray: string[]) => (
    /* create a sorted array of unique lineIds */
    [
      ...new Set(
        lineIdArray.sort((a, b) => {
          const aLineNumber = +a.match(/\d+/g)[0];
          const bLineNumber = +b.match(/\d+/g)[0];
          if (aLineNumber > bLineNumber) return 1;
          return -1;
        }),
      ),
    ]
  );

  private sortAndStoreHighlightLinesByPrefix = (highlightLines: string[]) => {
    this.setState({
      sortedHighlightLines: {
        L: this.arrangeSelectedLines(
          this.filterLinesByPrefix(highlightLines, 'L'),
        ),
        R: this.arrangeSelectedLines(
          this.filterLinesByPrefix(highlightLines, 'R'),
        ),
      },
    });
  }

  /**
	 * Resets code block expand to the initial stage. Will be exposed to the parent component via
	 * refs.
	 */
  public resetCodeBlocks = (): boolean => {
    if (this.state.expandedBlocks.length > 0) {
      this.setState({
        expandedBlocks: [],
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
      expandedBlocks: prevState,
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
    useDarkTheme: boolean,
  ) => ReactDiffViewerStyles = memoize(computeStyles);

  /**
	 * Returns a function with highlighted lines in the closure.
     * Returns an no-op function when no onCommentClick handler is supplied.
	 *
	 * @param selectedLines the line ids of the lines to attribute the comment to.
	 * @param prefix the line id prefix indication what half of the split view triggered the event.
	 */
  private onAddNewCommentProxy = (selectedLines: string[], prefix: string): any => {
    if (this.props.onAddNewCommentStart) {
      return (e: React.MouseEvent<HTMLButtonElement>): void => {
        const {
          onAddNewCommentStart,
          splitView,
        } = this.props;

        if (splitView) {
          onAddNewCommentStart(selectedLines, prefix, e);
        }
      };
    }
    return (): void => {};
  };

  /**
	 * Returns a function with clicked comment data in the closure.
     * Returns an no-op function when no onCommentClick handler is supplied.
	 *
	 * @param comment the comment data object bound to the clicked button.
	 * @param prefix the line id prefix indication what half of the split view triggered the event.
	 */
  private onCommentClickProxy = (comment: Record<string, any>, prefix: string): any => {
    if (this.props.onCommentClick) {
      return (e: React.MouseEvent<HTMLButtonElement>): void => {
        const {
          onCommentClick,
          splitView,
        } = this.props;

        this.setState({
          canAddNewComment: false,
        });

        if (splitView) {
          onCommentClick(comment, comment.commentLines, prefix, e);
        }
      };
    }
    return (): void => {};
  };

  /**
	 * Returns a function with clicked line number in the closure. Returns an no-op function when no
	 * onLineNumberClick handler is supplied.
	 *
	 * @param id Line id of a line.
	 */
  private onLineNumberClickProxy = (id: string, prefix: string): any => {
    if (this.props.onLineNumberClick) {
      return (e: any): void => {
        const {
          highlightLines,
          canSelectLines,
          onLineNumberClick,
        } = this.props;

        const linePrefix = id[0] as keyof typeof canSelectLines;

        if (canSelectLines[linePrefix]) {
          this.setState({
            canAddNewComment: true,
          });

          const isNewSelection = !highlightLines.includes(id);
          onLineNumberClick(id, isNewSelection, prefix, e);
        }
      };
    }
    return (): void => {};
  };

  /**
	 * Updates the state with the lineData of the hovered lineNumber's line.
     * Returns an no-op function when no onCommentClick handler is supplied.
	 *
	 * @param lineId id of the line.
	 * @param lineNumber number id of the line.
	 * @param isMouseEnter whether or not the hover event is a mouseenter event.
	 * @param isAdditionalLineNumber whether or not the hovered number is an additional line number.
	 */
  private onLineNumberHover = (
    lineId: string,
    lineNumber: number,
    isMouseEnter: boolean,
    isAdditionalLineNumber: boolean): (() => void
    ) => {
    const {
      canSelectLines,
      highlightLines,
    } = this.props;

    const linePrefix = lineId[0] as keyof typeof canSelectLines;

    if (canSelectLines[linePrefix]) {
      return (): void => {
        let lineNumberText: string | React.ReactNode;

        if (isMouseEnter) {
          const isLineHighlighted = highlightLines.includes(lineId);

          lineNumberText = (
            <span className={cn(this.styles.lineSelectButton, {
              _add: !isLineHighlighted,
              _remove: isLineHighlighted,
            })}>
              { isLineHighlighted ? '-' : '+'}
            </span>
          );
        } else {
          lineNumberText = `${lineNumber}`;
        }

        const textType = isAdditionalLineNumber ? 'additionalLineNumberText' : 'lineNumberText';

        this.setState((prevState: Readonly<ReactDiffViewerState>): ReactDiffViewerState => ({
          lineData: {
            ...prevState.lineData,
            [lineId]: {
              ...prevState.lineData[lineId],
              [textType]: lineNumberText,
            },
          },
        }));
      };
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
    renderer?: (chunk: string) => JSX.Element,
  ): JSX.Element[] => {
    return diffArray.map(
      (wordDiff, i): JSX.Element => {
        return (
          <span
            key={i}
            className={cn(this.styles.wordDiff, {
              [this.styles.wordAdded]: wordDiff.type === DiffType.ADDED,
              [this.styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
            })}>
            {renderer ? renderer(wordDiff.value as string) : wordDiff.value}
          </span>
        );
      },
    );
  };

  /**
	 * Maps over the line diff and constructs the required react elements to show line diff.
     * It calls renderWordDiff when encountering word diff. This takes care of both inline and
     * split view line renders.
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
    additionalLineNumber?: number,
    additionalPrefix?: LineNumberPrefix,
  ): JSX.Element => {
    const {
      highlightLines,
      splitView,
      canSelectLines,
      onClearHighlights,
      comments,
    } = this.props;

    const {
      sortedHighlightLines,
      lineData,
      canAddNewComment,
    } = this.state;

    const lineNumberTemplate = `${prefix}-${lineNumber}`;
    const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
    const highlightLine = highlightLines.includes(lineNumberTemplate)
      || highlightLines.includes(additionalLineNumberTemplate);
    const added = type === DiffType.ADDED;
    const removed = type === DiffType.REMOVED;

    let isLastHighlightLine: boolean;
    let lineComments: Record<string, any>[];

    if (splitView) {
      isLastHighlightLine = lineNumber
        && sortedHighlightLines[prefix]
        && (sortedHighlightLines[prefix][sortedHighlightLines[prefix]
          .length - 1] === lineNumberTemplate);

      lineComments = comments && comments[prefix].filter((comment): boolean => (
        comment.commentLines[0] === lineNumberTemplate
      ));
    }

    let content: React.ReactNode | string;

    if (Array.isArray(value)) {
      content = this.renderWordDiff(value, this.props.renderContent);
    } else if (this.props.renderContent) {
      content = this.props.renderContent(value);
    } else {
      content = value;
    }

    const renderedLineNumber = lineData[lineNumberTemplate]
      && lineData[lineNumberTemplate].lineNumberText
      ? lineData[lineNumberTemplate].lineNumberText
      : lineNumber;

    const renderedAdditionalLineNumber = lineData[additionalLineNumberTemplate]
      && lineData[additionalLineNumberTemplate].additionalLineNumberText
      ? lineData[additionalLineNumberTemplate].additionalLineNumberText
      : additionalLineNumber;

    return (
      <React.Fragment>
        {!this.props.hideLineNumbers && (
          <td
            onClick={lineNumber && canSelectLines[prefix]
              ? this.onLineNumberClickProxy(lineNumberTemplate, prefix)
              : (): void => {}
            }
            onMouseEnter={lineNumber && canSelectLines[prefix]
              ? this.onLineNumberHover(
                lineNumberTemplate,
                lineNumber,
                true,
                false,
              )
              : (): void => {}
            }
            onMouseLeave={lineNumber && canSelectLines[prefix]
              ? this.onLineNumberHover(
                lineNumberTemplate,
                lineNumber,
                false,
                false,
              )
              : (): void => {}
            }
            className={cn(this.styles.gutter, {
              [this.styles.emptyGutter]: !lineNumber,
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine,
            })}>
            <pre className={this.styles.lineNumber}>
              { renderedLineNumber }
            </pre>
          </td>
        )}

        {!this.props.splitView && !this.props.hideLineNumbers && (
          <td
            onClick={additionalLineNumber && canSelectLines[prefix]
              ? this.onLineNumberClickProxy(
                additionalLineNumberTemplate,
                additionalPrefix,
              )
              : (): void => {}
            }
            onMouseEnter={additionalLineNumber && canSelectLines[prefix]
              ? this.onLineNumberHover(
                additionalLineNumberTemplate,
                additionalLineNumber,
                true,
                true,
              )
              : (): void => {}
            }
            onMouseLeave={additionalLineNumber && canSelectLines[prefix]
              ? this.onLineNumberHover(
                additionalLineNumberTemplate,
                additionalLineNumber,
                false,
                true,
              )
              : (): void => {}
            }
            className={cn(this.styles.gutter, {
              [this.styles.emptyGutter]: !additionalLineNumber,
              [this.styles.diffAdded]: added,
              [this.styles.diffRemoved]: removed,
              [this.styles.highlightedGutter]: highlightLine,
            })}>
            <pre className={this.styles.lineNumber}>
              { renderedAdditionalLineNumber }
            </pre>
          </td>
        )}

        <td
          className={cn(this.styles.marker, {
            [this.styles.emptyLine]: !content,
            [this.styles.diffAdded]: added,
            [this.styles.diffRemoved]: removed,
            [this.styles.highlightedLine]: highlightLine,
          })}>
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
            [this.styles.highlightedLine]: highlightLine,
          })}>
          <pre className={this.styles.contentText}>{content}</pre>

          { canSelectLines && isLastHighlightLine && (
            <div className={cn(this.styles.highlightActionButtons)}>
              { canAddNewComment && (
                <button
                  className={cn(this.styles.addCommentButton)}
                  onClick={this.onAddNewCommentProxy(highlightLines, prefix)}
                >
                  + Add comment
                </button>
              )}

              <button
                className={cn(this.styles.addCommentButton, this.styles.clearHighlightButton)}
                onClick={onClearHighlights}
              >
                Clear
              </button>
            </div>
          )}

          { !!lineComments && !!lineComments.length && (
            <div className={cn(this.styles.commentActionButtons, {
              _stacked: lineComments.length > 1,
              _urgent: lineComments.some((comment): boolean => comment.isUrgent),
            })}>
              { lineComments.map((comment, id): React.ReactNode => (
                <button
                  key={id}
                  className={cn(this.styles.viewCommentButton, {
                    _urgent: comment.isUrgent,
                  })}
                  data-hidden-comments-count={`+${lineComments.length - 1}`}
                  onClick={this.onCommentClickProxy(comment, prefix)}
                >
                  { comment.commentLabel }
                </button>
              ))}
            </div>
          )}
        </td>
      </React.Fragment>
    );
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
              LineNumberPrefix.RIGHT,
            )}
          </tr>
          <tr className={this.styles.line}>
            {this.renderLine(
              null,
              right.type,
              LineNumberPrefix.RIGHT,
              right.value,
              right.lineNumber,
              LineNumberPrefix.RIGHT,
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
        LineNumberPrefix.RIGHT,
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
        LineNumberPrefix.RIGHT,
      );
    }

    return (
      <tr key={index} className={this.styles.line}>
        {content}
      </tr>
    );
  };

  /**
	 * Returns a function with clicked block number in the closure.
	 *
	 * @param id Cold fold block id.
	 */
  private onBlockClickProxy = (id: number): any => (): void => this.onBlockExpand(id);

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
    rightBlockLineNumber: number,
  ): JSX.Element => {
    const { hideLineNumbers, splitView } = this.props;
    const message = this.props.codeFoldMessageRenderer ? (
      this.props.codeFoldMessageRenderer(
        num,
        leftBlockLineNumber,
        rightBlockLineNumber,
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
        className={this.styles.codeFold}>
        {!hideLineNumbers && <td className={this.styles.codeFoldGutter} />}
        <td
          className={cn({
            [this.styles.codeFoldGutter]: isUnifiedViewWithoutLineNumbers,
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
      compareMethod,
      linesOffset,
    } = this.props;
    const { lineInformation, diffLines } = computeLineInformation(
      oldValue,
      newValue,
      disableWordDiff,
      compareMethod,
      linesOffset,
    );
    const extraLines = this.props.extraLinesSurroundingDiff < 0
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

        if (currentPosition === extraLines && skippedLines.length > 0) {
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
  };

  public render = (): JSX.Element => {
    const {
      oldValue,
      newValue,
      useDarkTheme,
      leftTitle,
      rightTitle,
      splitView,
      hideLineNumbers,
    } = this.props;

    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
      throw Error('"oldValue" and "newValue" should be strings');
    }

    this.styles = this.computeStyles(this.props.styles, useDarkTheme);
    const nodes = this.renderDiff();
    const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
    const colSpanOnInlineView = hideLineNumbers ? 2 : 4;

    const title = (leftTitle || rightTitle) && (
      <tr>
        <td
          colSpan={splitView ? colSpanOnSplitView : colSpanOnInlineView}
          className={this.styles.titleBlock}>
          <pre className={this.styles.contentText}>{leftTitle}</pre>
        </td>
        {splitView && (
          <td colSpan={colSpanOnSplitView} className={this.styles.titleBlock}>
            <pre className={this.styles.contentText}>{rightTitle}</pre>
          </td>
        )}
      </tr>
    );

    return (
      <table
        className={cn(this.styles.diffContainer, {
          [this.styles.splitView]: splitView,
        })}>
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
