require('./style.scss')
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ReactDiff from '../../lib/index'

const oldJson = require('./diff/json/old.json')
const newJson = require('./diff/json/new.json')
const oldXml = require('./diff/xml/old.xml')
const newXml = require('./diff/xml/new.xml')
const oldJs = require('./diff/javascript/old.rjs')
const newJs = require('./diff/javascript/new.rjs')

interface IExampleState {
  splitView?: boolean;
  highlightLine?: string[];
  language?: string;
  enableSyntaxHighlighting?: boolean;
}

const P = (window as any).Prism

class Example extends React.Component<{}, IExampleState> {

  constructor(props: any) {
    super(props)
    this.state = {
      splitView: true,
      highlightLine: [],
      language: 'javascript',
      enableSyntaxHighlighting: true,
    }
  }

  toggleSyntaxHighlighting = () => this.setState({
    enableSyntaxHighlighting: !this.state.enableSyntaxHighlighting,
  })

  onChange = () => this.setState({ splitView: !this.state.splitView })

  onLanguageChange = (e: any) => this.setState({ language: e.target.value })

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

  syntaxHighlight = (str: string) => {
    let language
    switch (this.state.language) {
      case 'xml':
        language = P.highlight(str, P.languages.markup, 'xml')
        break
      case 'json':
        language = P.highlight(str, P.languages.json, 'json')
        break
      case 'javascript':
        language = P.highlight(str, P.languages.javascript, 'javascript')
        break
      default:
        break
    }
    return <pre
      style={{ display: 'inline' }}
      dangerouslySetInnerHTML={{ __html: language }}
    />
  }

  render() {

    let oldValue
    let newValue

    switch (this.state.language) {
      case 'xml':
        oldValue = oldXml
        newValue = newXml
        break
      case 'json':
        oldValue = JSON.stringify(oldJson, null, 4)
        newValue = JSON.stringify(newJson, null, 4)
        break
      case 'javascript':
        oldValue = oldJs
        newValue = newJs
        break
      default:
        break
    }
    return (
      <div className="react-diff-viewer-example">
        <div className="banner">
          <h1>React Diff Viewer</h1>
          <p>
            A simple and beautiful text diff viewer made
            with <a href="https://github.com/kpdecker/jsdiff" target="_blank">Diff </a>
            and <a href="https://reactjs.org" target="_blank">React JS </a>
            featuring split view, unified view and line highlight.
          </p>
          <div className="cta">
            <button
              type="button"
              className="btn btn-primary btn-lg"
            >
              Documentation
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
            >
              Github
            </button>
          </div>
        </div>
        <div className="controls">
          <select
            name="language"
            id="language"
            onChange={this.onLanguageChange}
            value={this.state.language}
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="javascript">Javascript</option>
          </select>
          <span>
            <label>
              <input
                type="checkbox"
                name="toggle-2"
                id="toggle-2"
                onChange={this.toggleSyntaxHighlighting}
                checked={this.state.enableSyntaxHighlighting} /> Syntax Highlighting
            </label>
            <label>
              <input
                type="checkbox"
                name="toggle-1"
                id="toggle-1"
                onChange={this.onChange}
                checked={this.state.splitView} /> Split View
            </label>
          </span>
        </div>
        <div className="diff-viewer">
          <ReactDiff
            highlightLines={this.state.highlightLine}
            onLineNumberClick={this.onLineNumberClick}
            oldValue={oldValue}
            splitView={this.state.splitView}
            newValue={newValue}
            renderContent={this.state.enableSyntaxHighlighting && this.syntaxHighlight}
          />
        </div>
        <footer>
          Made with 💓 by <a href="https://praneshravi.in" target="_blank">Pranesh Ravi</a>
        </footer>
      </div>
    )
  }
}

ReactDOM.render(
  <Example/>,
  document.getElementById('app'),
)

