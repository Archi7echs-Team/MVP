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

describe('Bar pane', () => {
    it('renders without crashing', () => {
      const { container } = render(BarPane)
      expect(container).toBeTruthy()
    })

});