import * as React from 'react'
import * as diff from 'diff'
import cn from 'classnames'

import * as styles from './styles'

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  beautify?: (source: string) => string;
  splitView?: boolean;
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
  return charDiff.map((obj: any) => {
    if (obj[hideType]) return undefined
    return <span className={cn(styles.wordDiff, { [styles.wordAdded]: obj.added, [styles.wordRemoved]: obj.removed })}>{obj.value}</span>
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
      return <div className={cn(styles.diffContainer, { [styles.clearFix]: islineNumberNotEqual })}>
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
              return <div className={cn(styles.line, { [styles.diffRemoved]: obj.removed })}>
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
              return <div className={cn(styles.line, { [styles.diffAdded]: obj.added })}>
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

  render = () => {
    const {
      oldValue,
      newValue,
      beautify,
      splitView,
    } = this.props

    const oldValueBeautified = beautifyValue(oldValue, beautify)
    const newValueBeautified = beautifyValue(newValue, beautify)
    const nodes = splitView ? this.splitView(diff.diffLines(oldValueBeautified, newValueBeautified))() : <span>hello</span>
    return (
      <div>
        {nodes}
      </div>
    )
  }
}

export default DiffViewer
