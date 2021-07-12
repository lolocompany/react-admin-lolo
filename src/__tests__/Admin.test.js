import React from 'react'
import {render, screen} from '@testing-library/react'
import {Admin} from '../Admin'

describe('test Admin suite', () => {
  test('render Admin Component', () => {
    render(<Admin />)
    screen.debug()
  })
})