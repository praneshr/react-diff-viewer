require('./style.scss')
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ReactDiff from '../../lib/index'

const oldJson = require('./diff/json/old.json')
const newJson = require('./diff/json/new.json')

interface IExampleState {
  splitView?: boolean;
  highlightLine?: string[];
}

const P = (window as any).Prism

class Example extends React.Component<{}, IExampleState> {

  constructor(props: any) {
    super(props)
    this.state = {
      splitView: true,
      highlightLine: [],
    }
  }

  onChange = () => this.setState({ splitView: !this.state.splitView })

  onLineNumberClick = (id: string, e: React.MouseEvent<HTMLTableCellElement>) => {
    let highlightLine = [id]
    if (e.shiftKey && this.state.highlightLine.length === 1) {
      const [dir, oldId] = this.state.highlightLine[0].split('-')
      const [newDir, newId] = id.split('-')
      if (dir === newDir) {
        highlightLine = []
        const lowEnd = Math.min(Number(oldId), Number(newId))
        const highEnd = Math.max(Number(oldId), Number(newId))
        for (var i = lowEnd; i <= highEnd; i++) {
          highlightLine.push(`${dir}-${i}`)
        }
      }
    }
    this.setState({
      highlightLine,
    })
  }

  syntaxHighlight = (str: string) =>  <pre
    style={{ display: 'inline' }}
    dangerouslySetInnerHTML={{ __html: P.highlight(str, P.languages.json, 'json')}}
  />

  render() {
    return (
      <div>
        <label>
          <input type="checkbox" name="toggle" id="toggle" onChange={this.onChange} checked={this.state.splitView}/> Split View
        </label>
        <ReactDiff
          renderContent={this.syntaxHighlight}
          mode="json"
          highlightLines={this.state.highlightLine}
          onLineNumberClick={this.onLineNumberClick}
          oldValue={oldJson}
          splitView={this.state.splitView}
          newValue={newJson}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <Example/>,
  document.getElementById('app'),
)

