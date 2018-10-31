import { css } from 'emotion'

export const variables = {
  addedBackground: '#e6ffed',
  addedColor: '#24292e',
  removedBackground: '#ffeef0',
  removedColor: '#24292e',
  wordAddedBackground: '#acf2bd',
  wordRemovedBackground: '#fdb8c0',
}

export const diffContainer = css({
  'pre': {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '25px',
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
  minWidth: 30,
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

export const lineNumber = css({
  userSelect: 'none',
  minWidth: 30,
  padding: '0 5px',
  label: 'line-number',
  cursor: 'pointer',
  pre: {
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
    },
  }
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
