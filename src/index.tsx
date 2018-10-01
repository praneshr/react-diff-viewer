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

class DiffViewer extends React.PureComponent<DiffViewerProps, DiffViewerState> {

  splitView = (diffArray: any[]) => {
    let leftLineNumber = 0
    let rightLineNumber = 0

    return () => diffArray.map((obj: diff.IDiffResult, i) => {
      return <div className={styles.diffContainer}>
        <div className={styles.column}>
          {
            !obj.added
            && obj.value.split('\n')
            .filter(ch => ch.length > 0)
            .map((ch, num) => {
              rightLineNumber = rightLineNumber + 1
              let content: any = ch
              // if (obj.removed && diffArray[i + 1] && diffArray[i + 1].added) {
              //   const nextVal = diffArray[i + 1].value
              //     .split('\n')
              //     .filter(ch => ch.length > 0)[num]
              //   content = nextVal ? this.wordDiff(ch, nextVal, 'added') : ch
              // }
              return <div className={cn(styles.line, { [styles.diffRemoved]: obj.removed })}>
                <span>
                  {rightLineNumber}
                  {obj.removed && <span>-</span>}
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
              // if (obj.added && diffArray[i - 1] && diffArray[i - 1].removed) {
              //   const preValue = diffArray[i - 1].value
              //     .split('\n')
              //     .filter(ch => ch.length > 0)[num]
              //   content = preValue ? this.wordDiff(preValue, ch, 'removed') : ch
              // }
              return <div className={cn(styles.line, { [styles.diffAdded]: obj.added })}>
                <span>
                  {leftLineNumber}
                  {obj.added && <span>+</span>}
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
