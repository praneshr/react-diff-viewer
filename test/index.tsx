import { shallow } from 'enzyme'
import * as React from 'react'
import * as expect from 'expect'

import DiffViewer from '../lib/index'

const oldCode = `
const a = 123
const b = 456
const c = () => {
  console.log('c')
}
`

const newCode = `
const aa = 123
const bb = 456
`

describe('Testing react diff viewer', () => {
  it('It should render a table', () => {
    const node = shallow(<DiffViewer
      oldValue={oldCode}
      newValue={newCode}
      splitView={true}
    />)
    expect(node.find('table').length).toEqual(1)
  })
})
