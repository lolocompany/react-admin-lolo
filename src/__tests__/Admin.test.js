import React from 'react'
import {render} from '@testing-library/react'
import {Admin} from '../Admin'

describe('Admin Test Suite', () => {
  test('renders Admin component', () => {
    render(<Admin />)
  })
})