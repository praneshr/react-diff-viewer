import { cx } from 'emotion'
import * as React from 'react'
import cn from 'classnames'

import * as styles from './styles'


interface ICommon {
  leftLineNumber?: number | boolean;
  rightLineNumber?: number | boolean;
  added?: boolean;
  removed?: boolean;
  onLineNumberClick: (lineId: string, event: React.MouseEvent<HTMLTableDataCellElement>) => void;
  renderContent?: (source: string) => JSX.Element;
  hightlightLines?: string[];
}
interface IInlineLine extends ICommon {
  content?: string | JSX.Element | JSX.Element[];
}

interface IDefaultLine extends ICommon {
  leftContent?: string | JSX.Element | JSX.Element[];
  rightContent?: string | JSX.Element | JSX.Element[];
}

interface ILineNumber {
  prefix: string;
  lineNumber: number;
}

const rightLineNumberPrefix = 'R'
const leftLineNumberPrefix = 'L'
const onLineNumberClickProxy = (onLineNumberClick: (lineId: string, event: React.MouseEvent<HTMLTableDataCellElement>) => void, id: string) =>
  (e: React.MouseEvent<HTMLTableDataCellElement>) => onLineNumberClick(id, e)

const LineNumber = ({ prefix, lineNumber }: ILineNumber) => {
  return <pre
    id={`${prefix}-${lineNumber}`}
  >
    {lineNumber}
  </pre>
}

export const InlineLine = ({
  leftLineNumber,
  rightLineNumber,
  added,
  removed,
  content,
  onLineNumberClick = () => { },
  renderContent,
  hightlightLines = [],
}: IInlineLine) => {
  const hightlightLine = (leftLineNumber !== true || rightLineNumber !== true)
    && (
      hightlightLines.includes(`${leftLineNumberPrefix}-${leftLineNumber}`)
    || hightlightLines.includes(`${rightLineNumberPrefix}-${rightLineNumber}`)
  )
  return <tr className={styles.line}>
    <td className={cn(
      styles.lineNumber,
      {
        [styles.diffAdded]: added,
        [styles.diffRemoved]: removed,
        [styles.hightlightedGutter]: hightlightLine,
      })}
      onClick={onLineNumberClickProxy(onLineNumberClick, `${leftLineNumberPrefix}-${leftLineNumber}`)}
    >
      {
        leftLineNumber !== true
        && <LineNumber
          lineNumber={leftLineNumber as number}
          prefix={leftLineNumberPrefix}
        />
      }
    </td>
    <td className={cn(
      styles.lineNumber,
      {
        [styles.diffAdded]: added,
        [styles.diffRemoved]: removed,
        [styles.hightlightedGutter]: hightlightLine,
      })}
      onClick={onLineNumberClickProxy(onLineNumberClick, `${rightLineNumberPrefix}-${rightLineNumber}`)}
    >
      {
        rightLineNumber !== true
        && <LineNumber
          lineNumber={rightLineNumber as number}
          prefix={rightLineNumberPrefix}
        />
      }
    </td>
    <td className={cx(
      styles.marker,
      {
        [styles.diffAdded]: added,
        [styles.diffRemoved]: removed,
        [styles.hightlightedLine]: hightlightLine,
      })}>
      {added && <pre>+</pre>}
      {removed && <pre>-</pre>}
    </td>
    <td className={cx({
      [styles.diffAdded]: added,
      [styles.diffRemoved]: removed,
      [styles.hightlightedLine]: hightlightLine,
    })}>
      {
        renderContent && typeof content === 'string'
          ? renderContent(content)
          : <pre>
            {content}
          </pre>
      }
    </td>
  </tr>
}


export const DefaultLine = ({
  leftLineNumber,
  rightLineNumber,
  onLineNumberClick,
  rightContent,
  leftContent,
  added,
  removed,
  renderContent,
  hightlightLines = [],
}: IDefaultLine) => {
  const hightlightLeftLine = leftLineNumber !== true
    && hightlightLines.includes(`${leftLineNumberPrefix}-${leftLineNumber}`)
  const hightlightRightLine = rightLineNumber !== true
    && hightlightLines.includes(`${rightLineNumberPrefix}-${rightLineNumber}`)

  return <tr className={styles.line}>
    <td className={cn(
      styles.lineNumber,
      {
        [styles.diffRemoved]: removed,
        [styles.hightlightedGutter]: hightlightLeftLine,
      },
    )}
      onClick={onLineNumberClickProxy(onLineNumberClick, `${leftLineNumberPrefix}-${leftLineNumber}`)}
    >
      {
        leftLineNumber
        && <LineNumber
          lineNumber={leftLineNumber as number}
          prefix={leftLineNumberPrefix}
        />
      }
    </td>
    <td className={cx({
      [cx(styles.marker, styles.diffRemoved)]: removed,
      [styles.hightlightedLine]: hightlightLeftLine,
    })}>
      {
        removed
        && <pre>-</pre>
      }
    </td>
    <td className={cx({
      [styles.diffRemoved]: removed,
      [styles.hightlightedLine]: hightlightLeftLine,
    })}>
      {
        renderContent && typeof leftContent === 'string'
          ? renderContent(leftContent)
          : leftContent
      }
    </td>
    <td className={cn(
      styles.lineNumber,
      {
        [styles.diffAdded]: added,
        [styles.hightlightedGutter]: hightlightRightLine,
      },
    )}
      onClick={onLineNumberClickProxy(onLineNumberClick, `${rightLineNumberPrefix}-${rightLineNumber}`)}
    >
      <LineNumber
        lineNumber={rightLineNumber as number}
        prefix={rightLineNumberPrefix}
      />
    </td>
    <td className={cx(
      styles.marker,
      {
        [styles.diffAdded]: added,
        [styles.hightlightedLine]: hightlightRightLine,
      },
    )}>
      {
        added
        && <pre>+</pre>
      }
    </td>
    <td className={cx({
      [styles.diffAdded]: added,
      [styles.hightlightedLine]: hightlightRightLine,
    })}>
      {
        renderContent && typeof rightContent === 'string'
          ? renderContent(rightContent)
          : rightContent
      }
    </td>
  </tr>
}
