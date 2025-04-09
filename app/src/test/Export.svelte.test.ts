import { fireEvent, render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Export from '../lib/components/Export.svelte';
import { takeScreenshot } from '$lib/index.svelte';

vi.mock('$lib/index.svelte', () => ({
	takeScreenshot: vi.fn(),
}));

vi.mock('@threlte/core', () => {
	return {
		useThrelte: () => ({
			renderer: {
				render: vi.fn(),
				domElement: {
					toDataURL: vi.fn(() => 'data:image/png;base64,FAKE'),
				},
			},
			scene: {},
			camera: { current: {} },
		}),
	};
});

describe('Export', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	  });

  it('renders without crashing', () => {
    const { container } = render(Export);
    expect(container).toBeTruthy();
  });

  it('load all compotents', () => {
    const { getByText } = render(Export);
    expect(getByText('Export as image')).toBeInTheDocument();
    expect(getByText('Screenshot')).toBeInTheDocument();
  });

  it('calls handleScreenshot on "Screenshot" click', async () => {
    const { getByText } = render(Export);
    await fireEvent.click(getByText('Screenshot'));
	expect(takeScreenshot).toHaveBeenCalledTimes(1);
  });

});