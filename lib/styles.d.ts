import { Interpolation } from 'create-emotion';
export interface ReactDiffViewerStyles {
    diffContainer?: string;
    diffRemoved?: string;
    diffAdded?: string;
    line?: string;
    highlightedGutter?: string;
    contentText?: string;
    gutter?: string;
    highlightedLine?: string;
    lineNumber?: string;
    marker?: string;
    wordDiff?: string;
    wordAdded?: string;
    wordRemoved?: string;
    codeFoldGutter?: string;
    emptyGutter?: string;
    emptyLine?: string;
    codeFold?: string;
    titleBlock?: string;
    content?: string;
    splitView?: string;
    [key: string]: string | undefined;
}
export interface ReactDiffViewerStylesVariables {
    diffViewerBackground?: string;
    diffViewerTitleBackground?: string;
    diffViewerColor?: string;
    diffViewerTitleColor?: string;
    diffViewerTitleBorderColor?: string;
    addedBackground?: string;
    addedColor?: string;
    removedBackground?: string;
    removedColor?: string;
    wordAddedBackground?: string;
    wordRemovedBackground?: string;
    addedGutterBackground?: string;
    removedGutterBackground?: string;
    gutterBackground?: string;
    gutterBackgroundDark?: string;
    highlightBackground?: string;
    highlightGutterBackground?: string;
    codeFoldGutterBackground?: string;
    codeFoldBackground?: string;
    emptyLineBackground?: string;
    gutterColor?: string;
    addedGutterColor?: string;
    removedGutterColor?: string;
    codeFoldContentColor?: string;
}
export interface ReactDiffViewerStylesOverride {
    variables?: {
        dark?: ReactDiffViewerStylesVariables;
        light?: ReactDiffViewerStylesVariables;
    };
    diffContainer?: Interpolation;
    diffRemoved?: Interpolation;
    diffAdded?: Interpolation;
    marker?: Interpolation;
    emptyGutter?: Interpolation;
    highlightedLine?: Interpolation;
    lineNumber?: Interpolation;
    highlightedGutter?: Interpolation;
    contentText?: Interpolation;
    gutter?: Interpolation;
    line?: Interpolation;
    wordDiff?: Interpolation;
    wordAdded?: Interpolation;
    wordRemoved?: Interpolation;
    codeFoldGutter?: Interpolation;
    emptyLine?: Interpolation;
    content?: Interpolation;
    titleBlock?: Interpolation;
    splitView?: Interpolation;
}
declare const _default: (styleOverride: ReactDiffViewerStylesOverride, useDarkTheme?: boolean) => ReactDiffViewerStyles;
export default _default;
