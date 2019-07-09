> This is an alpha version. Not ready for production yet. Please report any bug if discovered.

# React Diff Viewer

[![Build Status](https://travis-ci.com/praneshr/react-diff-viewer.svg?branch=master)](https://travis-ci.com/praneshr/react-diff-viewer)
 [![npm version](https://badge.fury.io/js/react-diff-viewer.svg)](https://badge.fury.io/js/react-diff-viewer)
 [![GitHub license](https://img.shields.io/github/license/praneshr/react-diff-viewer.svg)](https://github.com/praneshr/react-diff-viewer/blob/master/LICENSE)

A simple and beautiful text diff viewer made with [Diff](https://github.com/kpdecker/jsdiff) and [React](https://reactjs.org).

Inspired from Github's diff viewer, it includes features like split view, unified view, word diff and line highlight. It is highly customizable and it supports almost all languages.  Check out the [demo](https://praneshravi.in/react-diff-viewer/).

## Install

```bash
yarn add react-diff-viewer@alpha

# or

npm i react-diff-viewer@alpha
```

## Usage

```javascript
import React, { PureComponent } from 'react'
import ReactDiffViewer from 'react-diff-viewer'

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`

class Diff extends PureComponent {
  render = () => {
    return (
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
      />
    )
  }
}
```

## Props
|Prop              |Type           |Default       |Description                                   |
|------------------|---------------|--------------|----------------------------------------------|
|oldValue          |`string`       |`''`          |Old value as string.                          |
|newVlaue          |`string`       |`''`          |New value as string.                          |
|splitView         |`boolean`      |`true`        |Switch between `unified` and `split` view.    |
|disableWordDiff   |`boolean`      |`false`       |Show and hide word diff in a diff line.       |
|hideLineNumbers   |`boolean`      |`false`       |Show and hide line numbers.                   |
|renderContent     |`function`     |`undefined`   |Render Prop API to render code in the diff viewer. Helpful for [syntax highlighting](#syntax-highlighting)   |
|onLineNumberClick |`function`     |`undefined`   |Event handler for line number click. `(lineId: string) => void`          |
|hightlightLines   |`array[string]`|`[]`          |List of lines to be highlighted. Works together with `onLineNumberClick`. Line number are prefixed with `L` and `R` for the left and right section of the diff viewer, respectively. For example, `L-20` means 20th line in the left pane. To highlight a range of line numbers, pass the prefixed line number as an array. For example, `[L-2, L-3, L-4, L-5]` will highlight the lines `2-5` in the left pane.   |
|showDiffOnly      |`boolean`      |`true`        |Shows only the diffed lines and folds the unchanged lines|
|extraLinesSurroundingDiff|`number`|`3`           |Number of extra unchanged lines surrounding the diff. Works along with `showDiffOnly`.|
|codeFoldMessageRenderer|`function`|`Expand {number} of lines ...`   |Render Prop API to render code fold message.|
|styles            |`object`       |`{}`          |To override style variables and styles. Learn more about [overriding styles](#overriding-styles)  |

## Syntax Highlighting

Syntax highlighting is a bit tricky when combined with diff. Here, React Diff Viewer provides a simple render prop API to handle syntax highlighting. Use `renderContent(content: string) => JSX.Element` and your favorite syntax highlighting library to acheive this.

An example using [Prism JS](https://prismjs.com)

```html
// Load Prism CSS
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.css" />

// Load Prism JS
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.js"></script>
```

```javascript
import React, { PureComponent } from 'react'
import ReactDiffViewer from 'react-diff-viewer'

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`

class Diff extends PureComponent {
  highlightSyntax = str => <pre
    style={{ display: 'inline' }}
    dangerouslySetInnerHTML={{ __html: Prism.highlight(str, Prism.languages.javascript) }}
  />

  render = () => {
    return (
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        renderContent={this.highlightSyntax}
      />
    )
  }
}
```


## Overriding Styles

React Diff Viewer uses [emotion](https://emotion.sh/) for styling. It also offers a simple way to override styles and style variables.

Below are the default style variables and style object keys.

```javascript

// Default variables and style keys

const defaultStyles = {
  variables: {
    addedBackground: '#e6ffed',
    addedColor: '#24292e',
    removedBackground: '#ffeef0',
    removedColor: '#24292e',
    wordAddedBackground: '#acf2bd',
    wordRemovedBackground: '#fdb8c0',
    addedGutterBackground: '#cdffd8',
    removedGutterBackground: '#ffdce0',
    gutterBackground: '#f7f7f7',
    gutterBackgroundDark: '#f3f1f1',
    highlightBackground: '#fffbdd',
    highlightGutterBackground: '#fff5b1',
    codeFoldGutterBackground: '#dbedff',
    codeFoldBackground: '#f1f8ff',
    emptyLineBackground: '#fafbfc',
  },
  diffContainer?: {}; //style object
  diffRemoved?: {}; //style object
  diffAdded?: {}; //style object
  marker?: {}; //style object
  highlightedLine?: {}; //style object
  highlightedGutter?: {}; //style object
  gutter?: {}; //style object
  line?: {}; //style object
  wordDiff?: {}; //style object
  wordAdded?: {}; //style object
  wordRemoved?: {}; //style object
  codeFoldGutter?: {}; //style object
  emptyLine?: {}; //style object
}
```

To override any style, just pass the new style object to the `styles` prop. New style will be computed using `Object.assign(default, override)`.

For keys other than `variables`, the value can either be an object or string interpolation.

```javascript
import React, { PureComponent } from 'react'
import ReactDiffViewer from 'react-diff-viewer'

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`

class Diff extends PureComponent {

  highlightSyntax = str => <pre
    style={{ display: 'inline' }}
    dangerouslySetInnerHTML={{ __html: Prism.highlight(str, Prism.languages.javascript) }}
  />

  render = () => {

    const newStyles = {
      variables: {
        highlightBackground: '#fefed5',
        highlightGutterBackground: '#ffcd3c',
      },
      line: {
        padding: '10px 2px',
        '&:hover': {
          background: '#a26ea1',
        },
      },
    }

    return (
      <ReactDiffViewer
        styles={newStyles}
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        renderContent={this.highlightSyntax}
      />
    )
  }
}

```

## License

MIT
