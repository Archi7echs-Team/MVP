import { render } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Bar from '../lib/components/Bar.svelte'
import {filter } from '$lib/index.svelte';

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

describe('Bar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    filterSettings.avgFilter = 0
    filterSettings.avgFilter = 1
    filterSettings.barFilterSelection = 0
    lastValue = 5
    mockAverage = 10
    barIdCheck = true
  })

  it('renders without crashing', () => {
    const props = {
      id: 'bar-1',
      coordinates: [0, 0, 0],
      height: 8,
      currentCameraQuaternionArray: [0, 0, 0, 1]
    }

    const { container } = render(Bar, { props })
    expect(container).toBeTruthy()
  })
})
