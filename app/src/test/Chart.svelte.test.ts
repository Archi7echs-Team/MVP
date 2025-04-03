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
  });

  it('should truncate text longer than the max length', () => {
    const longText = 'This is a very long text that needs to be truncated';
    const maxLength = 20;

    const { component: instance } = render(Chart, { props: {} });
    const result = instance.truncateText(longText, maxLength);

    expect(result).toBe('This is a very long ...');
  });

  it('should not truncate text shorter than the max length', () => {
    const shortText = 'Short text';
    const maxLength = 20;

    const { component: instance } = render(Chart, { props: {} });
    const result = instance.truncateText(shortText, maxLength);

    expect(result).toBe('Short text');
  });

  
})

