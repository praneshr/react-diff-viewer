import { css } from 'emotion'

const variables = {
  addedBackground: '#E1FBDA',
  addedColor: '#1B7C0E',
  removedBackground: '#F5C9CF',
  removedColor: '#A02A3B',
  wordAddedBackground: '#97C391',
  wordRemovedBackground: '#F48D8D',
}

export const diffContainer = css({
  'pre': {
    margin: 0,
    padding: 0,
    whiteSpace: 'pre-wrap',
  },
})

export const column = css({
  width: '50%',
  float: 'left',
})

export const diffRemoved = css({
  background: variables.removedBackground,
  color: variables.removedColor,
  pre: {
    color: variables.removedColor,
  },
})

export const diffAdded = css({
  background: variables.addedBackground,
  color: variables.addedColor,
  pre: {
    color: variables.addedColor,
  },
})

export const marker = css({
  marginTop: -4,
  userSelect: 'none',
})

export const gutter = css({
  minWidth: 40,
  display: 'flex',
  marginRight: 20,
  justifyContent: 'space-between',
})

export const lineNumber = css({
  opacity: 0.3,
  userSelect: 'none',
})

export const clearFix = css({
  '&:after': {
    content: '" "',
    display: 'table',
    clear: 'both',
  }
})

export const line = css({
  display: 'flex',
  padding: '2px 0',
})

export const wordDiff = css({
  padding: 2,
})

export const wordAdded = css({
  background: variables.wordAddedBackground,
})

export const wordRemoved = css({
  background: variables.wordRemovedBackground,
})
