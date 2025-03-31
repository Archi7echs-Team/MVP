import { render } from '@testing-library/svelte'
import { describe, it, vi, beforeEach, expect } from 'vitest'
import Page from '../routes/+page.svelte'

vi.mock('@threlte/core', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    Canvas: () => '<div data-testid="mock-canvas">Mocked Canvas</div>',
  };
});

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(Page);
    expect(container).toBeTruthy()
  })
})