import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Planets from '../src/pages/Planets'

describe('Planets Import Test', () => {
  it('should import Planets component', () => {
    expect(Planets).toBeDefined()
  })
})
