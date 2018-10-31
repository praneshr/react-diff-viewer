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
  return <tr className={styles.line}>
    <td className={cn(styles.lineNumber, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {
        leftLineNumber !== true
        && <pre
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
    <td className={cn(styles.lineNumber, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {
        rightLineNumber
        && <pre
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
    <td className={cn(styles.marker, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {added && <pre>+</pre>}
      {removed && <pre>-</pre>}
    </td>
    <td className={cn({ [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      <pre>
        {content}
      </pre>
    </td>
  </tr>
}
