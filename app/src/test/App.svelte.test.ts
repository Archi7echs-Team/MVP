import { render } from '@testing-library/svelte'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import App from '../lib/components/App.svelte'

vi.mock('@threlte/core', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Canvas: () => '<div data-testid="mock-canvas">Mocked Canvas</div>',
  };
});
vi.mock('@threlte/extras', () => ({
  Text: {}
}))

describe('Chart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(App);
    expect(container).toBeTruthy()
  })
})
