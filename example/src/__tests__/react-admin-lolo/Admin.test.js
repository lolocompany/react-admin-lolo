import React from 'react'
import {render, screen} from '@testing-library/react'
import {Admin} from '@inclusivedot/react-admin-lolo'

describe('test Admin suite', () => {
  test('render Admin Component', () => {
    render(<Admin />)
    screen.debug()
  })
})