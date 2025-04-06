import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Export from '../lib/components/Export.svelte';

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
  it('renders without crashing', () => {
    const { container } = render(Export);
    expect(container).toBeTruthy();
  });

  it('load all compotents', () => {
    const { getByText } = render(Export);
    expect(getByText('Export as image')).toBeInTheDocument();
    expect(getByText('Screenshot')).toBeInTheDocument();
  });

});