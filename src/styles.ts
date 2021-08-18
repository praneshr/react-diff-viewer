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
  splitView?: string;
  lineSelectButton?: string;
  highlightActionButtons?: string;
  addCommentButton?: string;
  clearHighlightButton?: string;
  commentActionButtons?: string;
  viewCommentButton?: string;
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
  lineSelectButton?: Interpolation;
  highlightActionButtons?: Interpolation;
  addCommentButton?: Interpolation;
  clearHighlightButton?: Interpolation;
  commentActionButtons?: Interpolation;
  viewCommentButton?: Interpolation;
}

export default (
  styleOverride: ReactDiffViewerStylesOverride,
  useDarkTheme = false,
): ReactDiffViewerStyles => {
  const { variables: overrideVariables = {}, ...styles } = styleOverride;

  const themeVariables = {
    light: {
      ...{
        diffViewerBackground: '#fff',
        diffViewerColor: '#212529',
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

  const content = css({
    position: 'relative',
    width: '100%',
    label: 'content',
  });

  const splitView = css({
    [`.${content}`]: {
      width: '50%',
    },
    label: 'split-view',
  });

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

  const contentText = css({
    color: variables.diffViewerColor,
    label: 'content-text',
  });

  const titleBlock = css({
    background: variables.diffViewerTitleBackground,
    padding: 10,
    borderBottom: `1px solid ${variables.diffViewerTitleBorderColor}`,
    label: 'title-block',
    ':last-child': {
      borderLeft: `1px solid ${variables.diffViewerTitleBorderColor}`,
    },
    [`.${contentText}`]: {
      color: variables.diffViewerTitleColor,
    },
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
    paddingRight: 10,
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

  const lineSelectButton = css({
    label: 'line-select-button',
    position: 'relative',
    left: '3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    width: '15px',
    height: '15px',
    lineHeight: '5px',
    borderRadius: '5px',
    marginLeft: 'auto',
    '&._add': {
      background: '#5840bf',
    },
    '&._remove': {
      background: '#de3838',
    },
  });

  const highlightActionButtons = css({
    label: 'highlight-action-buttons',
    zIndex: 9,
    position: 'absolute',
    top: 'calc(100% + 3px)',
    right: '3px',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  });

  const addCommentButton = css({
    label: 'add-comment-button',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20px',
    lineHeight: '10px',
    fontFamily: 'Monospace, sans-serif',
    color: '#fff',
    fontSize: '10px',
    background: '#5840bf',
    border: 'none',
    borderRadius: '5px',
    padding: '0 7px 3px 7px',
    marginLeft: '5px',
    cursor: 'pointer',
    transition: '0.1s',
    '&:hover': {
      background: 'purple',
    },
    '&:focus': {
      outline: 0,
    },
  });

  const clearHighlightButton = css`
    ${addCommentButton};
    label: clear-highlight-button;
    background: #de3838;
    &:hover {
      background: #bf0f0f;
    }
  ,
  `;

  const viewCommentButton = css`
    label: view-comment-button;
    z-index: 8;
    position: relative;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(100%, 25px);
    width: 30px;
    font-family: Monospace, sans-serif;
    font-size: 10px;
    color: #fff;
    border: none;
    background: #00a4db;
    opacity: 0.7;
    border-radius: 5px;
    cursor: pointer;
    transform: translateX(0);
    transition: 0.2s;

    &:last-of-type {
      z-index: 9;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:not(:first-of-type) {
      margin-left: 3px;
    }

    &:not(:last-of-type) {
      //display: none;
      position: absolute;
      opacity: 0;
      transform: translateX(-10px);
      pointer-events: none;
    }

    &:hover {
      opacity: 1 !important;
    }
    
    &:focus {
      outline: 0;
    }
  `;

  const commentActionButtons = css`
    label: view-comment-button;
    z-index: 8;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    padding-right: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    will-change: padding-right;
    transition: 0.2s;
    
    &._stacked {
      .${viewCommentButton} {
        &:last-of-type {
          //border-top-right-radius: 5px;
          //border-bottom-right-radius: 5px;
          //box-shadow: -2px -2px 0 rgba(17, 65, 82, 0.7), -4px -4px 0 rgba(17, 65, 82, 0.7);
          &::after {
            position: absolute;
            right: 0;
            bottom: -7px;
            content: attr(data-hidden-comments-count);
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 10px;
            height: 10px;
            opacity: 1;
            color: #00a4db;
            font-size: 8px;
            font-weight: 800;
            border: 1px solid #00a4db;
            border-radius: 2px;
            background-color: #fff;
            padding: 0 2px;
            transform: translateX(0);
            transition: 0.2s;
          }
        }
      }
    }

    &:hover {
      .${viewCommentButton} {
        //display: flex;
        position: relative;
        opacity: 0.7;
        pointer-events: all;
        transform: translateX(0);

        &:last-of-type {
          //border-top-right-radius: 5px;
          //border-bottom-right-radius: 5px;
          //box-shadow: 0 0 0 rgba(0,0,0,0.3), 0 0 0 rgba(0,0,0,0.3);
          
          &::after {
            opacity: 0;
            transform: translateX(5px);
          }
        }
      }
    }
  `;

  const defaultStyles: ReactDiffViewerStyles = {
    diffContainer,
    diffRemoved,
    diffAdded,
    splitView,
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
    lineSelectButton,
    highlightActionButtons,
    addCommentButton,
    clearHighlightButton,
    commentActionButtons,
    viewCommentButton,
  };

  const computerOverrideStyles: ReactDiffViewerStyles = Object.keys(
    styles,
  ).reduce(
    (acc, key): ReactDiffViewerStyles => ({
      ...acc,
      [key]: css((styles as Record<string, Interpolation>)[key]),
    }),
    {},
  );

  return Object.keys(defaultStyles).reduce(
    (acc, key): ReactDiffViewerStyles => ({
      ...acc,
      [key]: computerOverrideStyles[key]
        ? cx(defaultStyles[key], computerOverrideStyles[key])
        : defaultStyles[key],
    }),
    {},
  );
};
