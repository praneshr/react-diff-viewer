import * as React from 'react'
import * as diff from 'diff'
import cn from 'classnames'

import * as styles from './styles'

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  beautify?: (source: string) => string;
  splitView?: boolean;
  worddiff?: boolean;
}

interface DiffViewerState {

}

const beautifyValue = (source: string, customBeautify: (source: string) => string ) => {
  if (customBeautify) {
    console.log(source);
    return customBeautify(source)
  }

  try {
    return JSON.stringify(JSON.parse(source), null, 4)
  } catch (e) {
    return source
  }
}

const determineLineNumbers = (str: string) => str.split('\n').length

const wordDiff = (str1: string, str2: string, hideType: string) => {
  const charDiff = diff.diffWordsWithSpace(str1, str2)
  return charDiff.map((obj: any, i) => {
    if (obj[hideType]) return undefined
    return <span className={cn(styles.wordDiff, { [styles.wordAdded]: obj.added, [styles.wordRemoved]: obj.removed })} key={i}>{obj.value}</span>
  })
}
class DiffViewer extends React.PureComponent<DiffViewerProps, DiffViewerState> {

  splitView = (diffArray: any[]) => {
    let leftLineNumber = 0
    let rightLineNumber = 0

    return () => diffArray.map((obj: diff.IDiffResult, i) => {
      const islineNumberNotEqual = obj.added
        && diffArray[i - 1]
        && diffArray[i - 1].removed
        && (determineLineNumbers(diffArray[i - 1].value) !== determineLineNumbers(obj.value))
      return <div className={cn({ [styles.clearFix]: islineNumberNotEqual })} key={i}>
        <div className={styles.column}>
          {
            !obj.added
            && obj.value.split('\n')
            .filter(ch => ch.length > 0)
            .map((ch, num) => {
              rightLineNumber = rightLineNumber + 1
              let content: any = ch
              if (obj.removed && diffArray[i + 1] && diffArray[i + 1].added) {
                const nextVal = diffArray[i + 1].value
                  .split('\n')
                  .filter((ch: string) => ch.length > 0)[num]
                content = nextVal ? wordDiff(ch, nextVal, 'added') : ch
              }
              return <div className={cn(styles.line, { [styles.diffRemoved]: obj.removed })} key={num}>
                <span className={styles.gutter}>
                  <span className={styles.lineNumber}>
                    <pre>
                      {rightLineNumber}
                    </pre>
                  </span>
                  {obj.removed && <span className={styles.marker}>-</span>}
                </span>
                <pre>{content}</pre>
              </div>
            })
          }
        </div>
        <div className={styles.column}>
          {
            !obj.removed
            && obj.value.split('\n')
            .filter(ch => ch.length > 0)
            .map((ch, num) => {
              leftLineNumber = leftLineNumber + 1
              let content: any = ch
              if (obj.added && diffArray[i - 1] && diffArray[i - 1].removed) {
                const preValue = diffArray[i - 1].value
                  .split('\n')
                  .filter((ch: string) => ch.length > 0)[num]
                content = preValue ? wordDiff(preValue, ch, 'removed') : ch
              }
              return <div className={cn(styles.line, { [styles.diffAdded]: obj.added })} key={num}>
                <span className={styles.gutter}>
                  <span className={styles.lineNumber}>
                    <pre>
                      {leftLineNumber}
                    </pre>
                  </span>
                  {obj.added && <span className={styles.marker}>+</span>}
                </span>
                <pre>{content}</pre>
              </div>
            })
          }
        </div>
      </div>
    })
  }

  inlineView = (diffArray: diff.IDiffResult[]) => {
    let leftLineNumber = 0
    let rightLineNumber = 0
    return () => {
      return diffArray.map(diffObj => {
        return diffObj.value.split('\n')
          .filter(ch => ch.length > 0)
          .map((ch, num) => {
            if (diffObj.added) {
              rightLineNumber = rightLineNumber + 1
            } else if (diffObj.removed) {
              leftLineNumber = leftLineNumber + 1
            } else {
              rightLineNumber = rightLineNumber + 1
              leftLineNumber = leftLineNumber + 1
            }
            return <div className={cn(styles.line, { [styles.diffAdded]: diffObj.added }, { [styles.diffRemoved]: diffObj.removed })} key={ch}>
              <span className={styles.gutter}>
                <span className={styles.lineNumber}>
                  <pre style={{minWidth: 20}}>
                    {
                      !diffObj.added
                      && leftLineNumber
                    }
                  </pre>
                  <pre style={{minWidth: 20}}>
                    {
                      !diffObj.removed
                      && rightLineNumber
                    }
                  </pre>
                </span>
                {diffObj.added && <span className={styles.marker}>+</span>}
                {diffObj.removed && <span className={styles.marker}>-</span>}
              </span>
              <pre>
                {ch}
              </pre>
            </div>
          })
      })
    }
  }

  render = () => {
    const {
      oldValue,
      newValue,
      beautify,
      splitView,
    } = this.props

    const oldValueBeautified = beautifyValue(oldValue, beautify)
    const newValueBeautified = beautifyValue(newValue, beautify)
    const diffLines = diff.diffLines(oldValueBeautified, newValueBeautified)
    const nodes = splitView
      ? this.splitView(diffLines)()
      : this.inlineView(diffLines)()
    return (
      <div className={styles.diffContainer}>
        {nodes}
      </div>
    )
  }
}

export default DiffViewer
