import { css } from 'emotion'

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
  background: 'red',
  // color: 'red',
})

export const diffAdded = css({
  background: 'green',
  // color: 'green',
})

export const line = css({
  display: 'flex',
})
