import { cx } from 'emotion'
import * as React from 'react'
import cn from 'classnames'

import * as styles from './styles'


interface ICommon {
  leftLineNumber?: number | boolean;
  rightLineNumber?: number | boolean;
  added?: boolean;
  removed?: boolean;
  onLineNumberClick?: (lineId: string) => void;
  renderContent?: (source: string) => JSX.Element;
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
  onLineNumberClick: (lineId: string) => void;
}

const LineNumber = ({ prefix, lineNumber, onLineNumberClick }: ILineNumber) => {
  const onLineNumberClickProxy = (e: any) => onLineNumberClick(e.currentTarget.id)
  return <pre
    id={`${prefix}-${lineNumber}`}
    onClick={onLineNumberClickProxy}
  >
    {lineNumber}
  </pre>
}

export const InlineLine =  ({ leftLineNumber, rightLineNumber, added, removed, content, onLineNumberClick = () => { }, renderContent }: IInlineLine) => {
  return <tr className={styles.line}>
    <td className={cn(styles.lineNumber, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {
        leftLineNumber !== true
        && <LineNumber
          lineNumber={leftLineNumber as number}
          prefix="L"
          onLineNumberClick={onLineNumberClick}
        />
      }
    </td>
    <td className={cn(styles.lineNumber, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {
        rightLineNumber !== true
        && <LineNumber
          lineNumber={rightLineNumber as number}
          prefix="R"
          onLineNumberClick={onLineNumberClick}
        />
      }
    </td>
    <td className={cx(styles.marker, { [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
      {added && <pre>+</pre>}
      {removed && <pre>-</pre>}
    </td>
    <td className={cx({ [styles.diffAdded]: added, [styles.diffRemoved]: removed })}>
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
}: IDefaultLine) => {
  return <tr className={styles.line}>
    <td className={cn(styles.lineNumber, { [styles.diffRemoved]: removed })}>
      {
        leftLineNumber
        && <LineNumber
          lineNumber={leftLineNumber as number}
          prefix="L"
          onLineNumberClick={onLineNumberClick}
        />
      }
    </td>
    <td className={cx({ [cx(styles.marker, styles.diffRemoved)]: removed })}>
      {
        removed
        && <pre>-</pre>
      }
    </td>
    <td className={cx({[styles.diffRemoved]: removed })}>
      {
        renderContent && typeof leftContent === 'string'
          ? renderContent(leftContent)
          : leftContent
      }
    </td>
    <td className={cn(styles.lineNumber, { [styles.diffAdded]: added })}>
      <LineNumber
        lineNumber={rightLineNumber as number}
        prefix="R"
        onLineNumberClick={onLineNumberClick}
      />
    </td>
    <td className={cx(styles.marker, { [styles.diffAdded]: added })}>
      {
        added
        && <pre>+</pre>
      }
    </td>
    <td className={cx({ [styles.diffAdded]: added })}>
      {
        renderContent && typeof rightContent === 'string'
          ? renderContent(rightContent)
          : rightContent
      }
    </td>
  </tr>
}
