import { act, render } from '@testing-library/svelte'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import Chart from '../lib/components/Chart.svelte'

let activeSelection = false
let mockValues = [1, 2, 3]
let mockRows = ['A', 'B']
let mockCols = ['X', 'Y']


vi.mock('@threlte/core', () => ({
  useThrelte: () => ({
    camera: {
      current: {
        quaternion: {
          toArray: () => [0, 0, 0, 1]
        }
      }
    }
  }),
  T: {}
}))

vi.mock('@threlte/extras', () => ({
  Text: {}
}))


vi.mock('$lib/index.svelte', () => ({
  getData: () => ({
    values: [],
    computed: {
        rows: mockRows,
        cols: mockCols
      }
  }),
  filter: {
    spacing: 1,
    displayBarFilter: false,
    selection: {
      active: () => false
    }
  }
}))

describe('Chart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(Chart);
    expect(container).toBeTruthy()
  })
})

