import { render } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BarPane from '../lib/components/BarPane.svelte'
import {filter} from '$lib/index.svelte'
import * as store from '$lib/index.svelte';
import { screen, fireEvent } from '@testing-library/svelte';
import { Vector3 } from 'three';

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

    it('renders BarPane when displayBarFilter is true', async () => {
      filter.displayBarFilter = true;

      const { getByText } = render(BarPane);

      expect(getByText('Selection info & filter')).toBeInTheDocument();
    });

    it('does not render BarPane when displayBarFilter is false', async () => {
      filter.displayBarFilter = false;

      const { queryByText } = render(BarPane);

      expect(queryByText('Selection info & filter')).not.toBeInTheDocument();
    });

});

describe('BarPane info rendering', () => {
	beforeEach(() => {
		store.filter.displayBarFilter = true;

		vi.spyOn(store, 'getSelectedBarInfo').mockReturnValue({
			row: 2,
			column: 3,
			height: 12.34
		});
  });

  it('renders the correct info values', () => {
    render(BarPane);

    expect(screen.getByText('Row')).toBeInTheDocument();
    expect(screen.getByText('Column')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('Avg X (row)')).toBeInTheDocument();
    expect(screen.getByText('Avg Z (column)')).toBeInTheDocument();
    expect(screen.getByText('Avg Global')).toBeInTheDocument();
  });
});