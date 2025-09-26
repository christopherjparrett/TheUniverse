import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

const SimpleComponent = () => <div>Hello World</div>

describe('Simple JSX Test', () => {
  it('should render JSX', () => {
    render(<SimpleComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
