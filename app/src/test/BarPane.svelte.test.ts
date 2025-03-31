import { render, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BarPane from '../lib/components/BarPane.svelte'

vi.mock('@threlte/core', () => ({
    useThrelte: () => ({
      scene: {
        children: []
      }
    }),
    T: {}
  }))

  vi.mock('@threlte/extras', () => ({
    interactivity: vi.fn(),
    Text: () => ({ $$render: () => '<text />' })
  }))

let mockAverage = 10
let lastValue = 5
let barIdCheck = true
let filterSettings = {
  rangeValue: { min: 0, max: 20 },
  avgFilter: 0,
  barFilterSelection: 0
}

describe('Bar component', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      filterSettings.avgFilter = 0
      filterSettings.barFilterSelection = 0
      lastValue = 5
      mockAverage = 10
      barIdCheck = true
    })
  
    it('renders without crashing', () => {
      const { container } = render(BarPane)
      expect(container).toBeTruthy()
    })

});