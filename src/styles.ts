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
  accessTag?: string;
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
  accessTag?: Interpolation;
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

  const interpolateClassname = (classname: string): string => `.${classname}`;

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
    position: 'relative',
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
    height: min(100%, 20px);
    min-width: 25px;
    font-family: Monospace, sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: #f15832;
    //color: #fff;
    //border: none;
    //background: rgba(0, 164, 219, 0.7);
    background: rgba(241, 88, 50, 0.2);
    border: 1px solid rgba(241, 88, 50, 0.5);
    opacity: 1;
    //opacity: 0.7;
    border-radius: 5px;
    padding: 0 5px;
    cursor: pointer;
    transform: translateX(0);
    transition: 0.2s;

    &:last-of-type {
      z-index: 9;
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:not(:first-of-type) {
      margin-left: 3px;
    }

    &:not(:last-of-type) {
      opacity: 0;
      transform: translateX(30px);
      pointer-events: none;
    }

    &:hover {
      //background: rgb(0, 164, 219);
      background: rgba(241, 88, 50, 0.5);
      color: #fff;
    }

    &:focus {
      outline: 0;
    }

    &._urgent {
      color: #fff;
      font-weight: 700;
      background: rgba(255, 0, 0, 0.7);
      border: 1px solid rgba(255, 0, 0, 0);

      &:hover {
        background: rgba(255, 0, 0, 1);
      }
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
      ${interpolateClassname(viewCommentButton)} {
        &:last-of-type {
          &::after {
            z-index: 9;
            position: absolute;
            left: -20px;
            bottom: 2px;
            content: attr(data-hidden-comments-count);
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 10px;
            background: #fff;
            opacity: 1;
            color: #00a4db;
            font-size: 8px;
            font-weight: 800;
            border: 1px solid #00a4db;
            border-radius: 2px;
            padding: 1px 2px;
            transform: translateX(0);
            transition: 0.2s;
          }
        }
      }

      &._urgent {
        ${interpolateClassname(viewCommentButton)} {
          &:last-of-type {
            &:not(._urgent) {
              &::after {
                //color: red;
                color: #fff;
                background: rgba(255, 0, 0, 0.94);
                border: 1px solid red;
              }
            }
          }
        }
      }
    }

    &:hover {
      ${interpolateClassname(viewCommentButton)} {
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);

        &:last-of-type {
          &::after {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      }
    }
  `;

  const accessTag = css`
    position: absolute;
    right: 20px;
    top: calc(50% - 8px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: monospace, sans-serif;
    font-size: 10px;
    opacity: 0.7;
    color: #fff;
    border-radius: 5px;
    padding: 2px 7px 4px 7px;

    &._readonly {
      background: #b8b3b3;
    }

    &._readwrite {
      background: #00a4db;
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
    accessTag,
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
