import { render } from '@testing-library/svelte'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import Chart from '../lib/components/Chart.svelte'

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

describe('Chart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(Chart);
    expect(container).toBeTruthy()
  })
})

