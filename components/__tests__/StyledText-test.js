import React from 'react'
import renderer from 'react-test-renderer'

import { MonoText } from '../StyledText'

it('renders correctly', () => {
  let tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON()

  expect(tree).toMatchSnapshot()
})
