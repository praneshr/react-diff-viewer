import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LineInformation, DiffMethod } from './compute-lines';
import { ReactDiffViewerStylesOverride } from './styles';
export declare enum LineNumberPrefix {
    LEFT = "L",
    RIGHT = "R"
}
export interface ReactDiffViewerProps {
    oldValue: string;
    newValue: string;
    splitView?: boolean;
    linesOffset?: number;
    disableWordDiff?: boolean;
    compareMethod?: DiffMethod;
    extraLinesSurroundingDiff?: number;
    hideLineNumbers?: boolean;
    showDiffOnly?: boolean;
    renderContent?: (source: string) => JSX.Element;
    codeFoldMessageRenderer?: (totalFoldedLines: number, leftStartLineNumber: number, rightStartLineNumber: number) => JSX.Element;
    onLineNumberClick?: (lineId: string, event: React.MouseEvent<HTMLTableCellElement>) => void;
    highlightLines?: string[];
    styles?: ReactDiffViewerStylesOverride;
    useDarkTheme?: boolean;
    leftTitle?: string | JSX.Element;
    rightTitle?: string | JSX.Element;
}
export interface ReactDiffViewerState {
    expandedBlocks?: number[];
}
declare class DiffViewer extends React.Component<ReactDiffViewerProps, ReactDiffViewerState> {
    private styles;
    static defaultProps: ReactDiffViewerProps;
    static propTypes: {
        oldValue: PropTypes.Validator<string>;
        newValue: PropTypes.Validator<string>;
        splitView: PropTypes.Requireable<boolean>;
        disableWordDiff: PropTypes.Requireable<boolean>;
        compareMethod: PropTypes.Requireable<any>;
        renderContent: PropTypes.Requireable<(...args: any[]) => any>;
        onLineNumberClick: PropTypes.Requireable<(...args: any[]) => any>;
        extraLinesSurroundingDiff: PropTypes.Requireable<number>;
        styles: PropTypes.Requireable<object>;
        hideLineNumbers: PropTypes.Requireable<boolean>;
        showDiffOnly: PropTypes.Requireable<boolean>;
        highlightLines: PropTypes.Requireable<string[]>;
        leftTitle: PropTypes.Requireable<string | PropTypes.ReactElementLike>;
        rightTitle: PropTypes.Requireable<string | PropTypes.ReactElementLike>;
        linesOffset: PropTypes.Requireable<number>;
    };
    constructor(props: ReactDiffViewerProps);
    /**
     * Resets code block expand to the initial stage. Will be exposed to the parent component via
     * refs.
     */
    resetCodeBlocks: () => boolean;
    /**
     * Pushes the target expanded code block to the state. During the re-render,
     * this value is used to expand/fold unmodified code.
     */
    private onBlockExpand;
    /**
     * Computes final styles for the diff viewer. It combines the default styles with the user
     * supplied overrides. The computed styles are cached with performance in mind.
     *
     * @param styles User supplied style overrides.
     */
    private computeStyles;
    /**
     * Returns a function with clicked line number in the closure. Returns an no-op function when no
     * onLineNumberClick handler is supplied.
     *
     * @param id Line id of a line.
     */
    private onLineNumberClickProxy;
    /**
     * Maps over the word diff and constructs the required React elements to show word diff.
     *
     * @param diffArray Word diff information derived from line information.
     * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
     */
    private renderWordDiff;
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
    private renderLine;
    /**
     * Generates lines for split view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the left pane of the split view.
     * @param obj.right Life diff information for the right pane of the split view.
     * @param index React key for the lines.
     */
    private renderSplitView;
    /**
     * Generates lines for inline view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the added section of the inline view.
     * @param obj.right Life diff information for the removed section of the inline view.
     * @param index React key for the lines.
     */
    renderInlineView: ({ left, right }: LineInformation, index: number) => JSX.Element;
    /**
     * Returns a function with clicked block number in the closure.
     *
     * @param id Cold fold block id.
     */
    private onBlockClickProxy;
    /**
     * Generates cold fold block. It also uses the custom message renderer when available to show
     * cold fold messages.
     *
     * @param num Number of skipped lines between two blocks.
     * @param blockNumber Code fold block id.
     * @param leftBlockLineNumber First left line number after the current code fold block.
     * @param rightBlockLineNumber First right line number after the current code fold block.
     */
    private renderSkippedLineIndicator;
    /**
     * Generates the entire diff view.
     */
    private renderDiff;
    render: () => JSX.Element;
}
export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };
