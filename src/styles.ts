import { css, cx } from 'emotion'
import { Interpolation } from 'create-emotion'


export interface IReactDiffViewerStyles {
  diffContainer?: string;
  diffRemoved?: string;
  diffAdded?: string;
  line?: string;
  hightlightedGutter?: string;
  gutter?: string;
  hightlightedLine?: string;
  marker?: string;
  wordDiff?: string;
  wordAdded?: string;
  wordRemoved?: string;
  leftGutter?: string;
  rightGutter?: string;
}

export interface IReactDiffViewerStylesOverride {
  variables?: {
    addedBackground?: string,
    addedColor?: string,
    removedBackground?: string,
    removedColor?: string,
    wordAddedBackground?: string,
    wordRemovedBackground?: string,
    addedGutterBackground?: string,
    removedGutterBackground?: string,
    gutterBackground?: string,
    gutterBackgroundDark?: string,
    highlightBackground?: string,
    highlightGutterBackground?: string,
  },
  diffContainer?: Interpolation;
  diffRemoved?: Interpolation;
  diffAdded?: Interpolation;
  marker?: Interpolation;
  hightlightedLine?: Interpolation;
  hightlightedGutter?: Interpolation;
  gutter?: Interpolation;
  line?: Interpolation;
  wordDiff?: Interpolation;
  wordAdded?: Interpolation;
  wordRemoved?: Interpolation;
  leftGutter?: Interpolation;
  rightGutter?: Interpolation;
}

export default (styleOverride: IReactDiffViewerStylesOverride) => {
  const {
    variables: overrideVariables,
    ...styles
  } = styleOverride

  const variables = {
    ...{
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
    },
    ...overrideVariables
  }

  const diffContainer = css({
    width: '100%',
    'pre': {
      margin: 0,
      whiteSpace: 'pre-wrap',
      lineHeight: '25px',
    },
    'tbody': {
      tr: {
        '&:first-child': {
          td: {
            paddingTop: 15,
          },
        },
        '&:last-child': {
          td: {
            paddingBottom: 15,
          },
        },
      },
    },
    label: 'diff-container',
  })

  const diffRemoved = css({
    background: variables.removedBackground,
    color: variables.removedColor,
    pre: {
      color: variables.removedColor,
    },
    label: 'diff-removed',
  })

  const diffAdded = css({
    background: variables.addedBackground,
    color: variables.addedColor,
    pre: {
      color: variables.addedColor,
    },
    label: 'diff-added',
  })

  const marker = css({
    minWidth: 50,
    paddingLeft: 10,
    userSelect: 'none',
    label: 'marker',
    [`&.${diffAdded}`]: {
      pre: {
        color: variables.addedColor,
      }
    },
    [`&.${diffRemoved}`]: {
      pre: {
        color: variables.removedColor,
      }
    }
  })

  const hightlightedLine = css({
    background: variables.highlightBackground,
    label: 'hightlighted-line',
  })

  const hightlightedGutter = css({
    label: 'hightlighted-gutter',
  })

  const gutter = css({
    userSelect: 'none',
    minWidth: 40,
    padding: '0 10px',
    label: 'gutter',
    cursor: 'pointer',
    textAlign: 'right',
    background: variables.gutterBackground,
    '&:hover': {
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
    [`&.${hightlightedGutter}`]: {
      background: variables.highlightGutterBackground,
      '&:hover': {
        background: variables.highlightGutterBackground,
      },
    },
  })

  const line = css({
    verticalAlign: 'baseline',
    label: 'line',
  })

  const wordDiff = css({
    padding: 2,
    display: 'inline-flex',
    borderRadius: 1,
    label: 'word-diff',
  })

  const wordAdded = css({
    background: variables.wordAddedBackground,
    label: 'word-added',
  })

  const wordRemoved = css({
    background: variables.wordRemovedBackground,
    label: 'word-removed',
  })

  const leftGutter = css({
    label: 'left-gutter',
  })

  const rightGutter = css({
    label: 'right-gutter',
  })

  const defaultStyles: any = {
    diffContainer,
    diffRemoved,
    diffAdded,
    marker,
    hightlightedGutter,
    hightlightedLine,
    gutter,
    line,
    wordDiff,
    wordAdded,
    wordRemoved,
    leftGutter,
    rightGutter,
  }

  const computerOverrideStyles: any = Object.keys(styles)
    .reduce((acc, key) => ({
      ...acc,
      ...{
        [key]: css((styles as any)[key]),
      }
    }), {})

  return Object.keys(defaultStyles)
    .reduce((acc, key) => ({
      ...acc,
      ...{
        [key]: computerOverrideStyles[key]
          ? cx(defaultStyles[key], computerOverrideStyles[key])
          : defaultStyles[key],
      },
    }), {})
}
