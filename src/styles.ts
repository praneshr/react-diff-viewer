import { css, cx } from 'emotion';
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
}

export default (
  styleOverride: ReactDiffViewerStylesOverride,
  useDarkTheme = false,
): ReactDiffViewerStyles => {
  const {
    variables: overrideVariables = {},
    ...styles
  } = styleOverride;

  const themeVariables = {
    light: {
      ...{
        diffViewerBackground: '#fff',
        diffViewerColor: '212529',
        addedBackground: '#e6ffed',
        addedColor: '#24292e',
        removedBackground: '#ffeef0',
        removedColor: '#24292e',
        wordAddedBackground: '#acf2bd',
        wordRemovedBackground: '#fdb8c0',
        addedGutterBackground: '#cdffd8',
        removedGutterBackground: '#ffdce0',
        gutterBackground: '#f7f7f7',
        gutterBackgroundDark: '#f3f1f1',
        highlightBackground: '#fffbdd',
        highlightGutterBackground: '#fff5b1',
        codeFoldGutterBackground: '#dbedff',
        codeFoldBackground: '#f1f8ff',
        emptyLineBackground: '#fafbfc',
        gutterColor: '#212529',
        addedGutterColor: '#212529',
        removedGutterColor: '#212529',
        codeFoldContentColor: '#212529',
        diffViewerTitleBackground: '#fafbfc',
        diffViewerTitleColor: '#212529',
        diffViewerTitleBorderColor: '#eee',
      },
      ...(overrideVariables.light || {}),
    },
    dark: {
      ...{
        diffViewerBackground: '#2e303c',
        diffViewerColor: '#FFF',
        addedBackground: '#044B53',
        addedColor: 'white',
        removedBackground: '#632F34',
        removedColor: 'white',
        wordAddedBackground: '#055d67',
        wordRemovedBackground: '#7d383f',
        addedGutterBackground: '#034148',
        removedGutterBackground: '#632b30',
        gutterBackground: '#2c2f3a',
        gutterBackgroundDark: '#262933',
        highlightBackground: '#2a3967',
        highlightGutterBackground: '#2d4077',
        codeFoldGutterBackground: '#21232b',
        codeFoldBackground: '#262831',
        emptyLineBackground: '#363946',
        gutterColor: '#464c67',
        addedGutterColor: '#8c8c8c',
        removedGutterColor: '#8c8c8c',
        codeFoldContentColor: '#555a7b',
        diffViewerTitleBackground: '#2f323e',
        diffViewerTitleColor: '#555a7b',
        diffViewerTitleBorderColor: '#353846',
      },
      ...(overrideVariables.dark || {}),
    },
  };

  const variables = useDarkTheme ? themeVariables.dark : themeVariables.light;

  const diffContainer = css({
    width: '100%',
    background: variables.diffViewerBackground,
    pre: {
      margin: 0,
      whiteSpace: 'pre-wrap',
      lineHeight: '25px',
    },
    label: 'diff-container',
    borderCollapse: 'collapse',
  });

  const codeFoldContent = css({
    color: variables.codeFoldContentColor,
    label: 'code-fold-content',
  });

  const titleBlock = css({
    color: variables.diffViewerTitleColor,
    background: variables.diffViewerTitleBackground,
    padding: 10,
    borderBottom: `1px solid ${variables.diffViewerTitleBorderColor}`,
    label: 'title-block',
    ':last-child': {
      borderLeft: `1px solid ${variables.diffViewerTitleBorderColor}`,
    },
  });

  const content = css({
    width: '50%',
    label: 'content',
  });

  const contentText = css({
    color: variables.diffViewerColor,
    label: 'content-text',
  });

  const lineNumber = css({
    color: variables.gutterColor,
    label: 'line-number',
  });

  const diffRemoved = css({
    background: variables.removedBackground,
    color: variables.removedColor,
    pre: {
      color: variables.removedColor,
    },
    [`.${lineNumber}`]: {
      color: variables.removedGutterColor,
    },
    label: 'diff-removed',
  });

  const diffAdded = css({
    background: variables.addedBackground,
    color: variables.addedColor,
    pre: {
      color: variables.addedColor,
    },
    [`.${lineNumber}`]: {
      color: variables.addedGutterColor,
    },
    label: 'diff-added',
  });

  const wordDiff = css({
    padding: 2,
    display: 'inline-flex',
    borderRadius: 1,
    label: 'word-diff',
  });

  const wordAdded = css({
    background: variables.wordAddedBackground,
    label: 'word-added',
  });

  const wordRemoved = css({
    background: variables.wordRemovedBackground,
    label: 'word-removed',
  });

  const codeFoldGutter = css({
    backgroundColor: variables.codeFoldGutterBackground,
    label: 'code-fold-gutter',
  });

  const codeFold = css({
    backgroundColor: variables.codeFoldBackground,
    height: 40,
    fontSize: 14,
    fontWeight: 700,
    label: 'code-fold',
    a: {
      textDecoration: 'underline !important',
      cursor: 'pointer',
      pre: {
        display: 'inline',
      },
    },
  });

  const emptyLine = css({
    backgroundColor: variables.emptyLineBackground,
    label: 'empty-line',
  });

  const marker = css({
    width: 25,
    paddingLeft: 10,
    userSelect: 'none',
    label: 'marker',
    [`&.${diffAdded}`]: {
      pre: {
        color: variables.addedColor,
      },
    },
    [`&.${diffRemoved}`]: {
      pre: {
        color: variables.removedColor,
      },
    },
  });

  const highlightedLine = css({
    background: variables.highlightBackground,
    label: 'highlighted-line',
    [`.${wordAdded}, .${wordRemoved}`]: {
      backgroundColor: 'initial',
    },
  });

  const highlightedGutter = css({
    label: 'highlighted-gutter',
  });

  const gutter = css({
    userSelect: 'none',
    minWidth: 50,
    padding: '0 10px',
    label: 'gutter',
    textAlign: 'right',
    background: variables.gutterBackground,
    '&:hover': {
      cursor: 'pointer',
      background: variables.gutterBackgroundDark,
      pre: {
        opacity: 1,
      },
    },
    pre: {
      opacity: 0.5,
    },
    [`&.${diffAdded}`]: {
      background: variables.addedGutterBackground,
    },
    [`&.${diffRemoved}`]: {
      background: variables.removedGutterBackground,
    },
    [`&.${highlightedGutter}`]: {
      background: variables.highlightGutterBackground,
      '&:hover': {
        background: variables.highlightGutterBackground,
      },
    },
  });

  const emptyGutter = css({
    '&:hover': {
      background: variables.gutterBackground,
      cursor: 'initial',
    },
    label: 'empty-gutter',
  });

  const line = css({
    verticalAlign: 'baseline',
    label: 'line',
  });

  const defaultStyles: any = {
    diffContainer,
    diffRemoved,
    diffAdded,
    marker,
    highlightedGutter,
    highlightedLine,
    gutter,
    line,
    wordDiff,
    wordAdded,
    wordRemoved,
    codeFoldGutter,
    codeFold,
    emptyGutter,
    emptyLine,
    lineNumber,
    contentText,
    content,
    codeFoldContent,
    titleBlock,
  };

  const computerOverrideStyles: ReactDiffViewerStyles = Object.keys(styles)
    .reduce((acc, key): ReactDiffViewerStyles => ({
      ...acc,
      ...{
        [key]: css((styles as any)[key]),
      },
    }), {});

  return Object.keys(defaultStyles)
    .reduce((acc, key): ReactDiffViewerStyles => ({
      ...acc,
      ...{
        [key]: computerOverrideStyles[key]
          ? cx(defaultStyles[key], computerOverrideStyles[key])
          : defaultStyles[key],
      },
    }), {});
};
