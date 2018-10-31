import * as React from 'react'
import cn from 'classnames'

import * as styles from './styles'

export interface ILine {
  leftLineNumber?: number | boolean;
  rightLineNumber?: number | boolean;
  added?: boolean;
  removed?: boolean;
  content?: string | JSX.Element | JSX.Element[];
  onLineNumberClick?: (lineId: string) => void;
}

export default ({ leftLineNumber, rightLineNumber, added, removed, content, onLineNumberClick = () => { } }: ILine) => {
  const onLineNumberClickProxy = (e: any) => onLineNumberClick(e.currentTarget.id)
  return <tr className={cn(
      styles.line,
      {
        [styles.diffAdded]: added,
        [styles.diffRemoved]: removed,
      },
    )}>
    <td>
      {
        leftLineNumber
        && <pre
          className={styles.lineNumber}
          {...(
            leftLineNumber !== true
            && {
              id: `L-${leftLineNumber}`,
              onClick: onLineNumberClickProxy,
            }
          )}
        >
          {leftLineNumber}
        </pre>
      }
    </td>
    <td>
      {
        rightLineNumber
        && <pre
          className={styles.lineNumber}
          {...(
            rightLineNumber !== true
            && {
              id: `L-${rightLineNumber}`,
              onClick: onLineNumberClickProxy,
            }
          )}
        >
          {rightLineNumber}
        </pre>
      }
    </td>
    <td className={styles.gutter}>
      {added && <span className={styles.marker}>+</span>}
      {removed && <span className={styles.marker}>-</span>}
    </td>
    <td>
      <pre>
        {content}
      </pre>
    </td>
  </tr>
}
