import { css } from 'emotion'

export const variables = {
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
}

export const diffContainer = css({
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

export const column = css({
  width: '50%',
  float: 'left',
  label: 'column',
})

export const diffRemoved = css({
  background: variables.removedBackground,
  color: variables.removedColor,
  pre: {
    color: variables.removedColor,
  },
  label: 'diff-removed',
})

export const diffAdded = css({
  background: variables.addedBackground,
  color: variables.addedColor,
  pre: {
    color: variables.addedColor,
  },
  label: 'diff-added',
})

export const marker = css({
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

export const gutter = css({
  display: 'flex',
  marginRight: 40,
  justifyContent: 'space-between',
  label: 'gutter',
})

export const hightlightedLine = css({
  background: variables.highlightBackground,
  label: 'hightlighted-line',
})

export const hightlightedGutter = css({
  label: 'hightlighted-gutter',
})

export const lineNumber = css({
  userSelect: 'none',
  minWidth: 40,
  padding: '0 10px',
  label: 'line-number',
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

export const clearFix = css({
  '&:after': {
    content: '" "',
    display: 'table',
    clear: 'both',
  },
  label: 'clearfix',
})

export const line = css({
  verticalAlign: 'baseline',
  label: 'line',
})

export const wordDiff = css({
  padding: 2,
  display: 'inline',
  borderRadius: 1,
  label: 'word-diff',
})

export const wordAdded = css({
  background: variables.wordAddedBackground,
  label: 'word-added',
})

export const wordRemoved = css({
  background: variables.wordRemovedBackground,
  label: 'word-removed',
})
