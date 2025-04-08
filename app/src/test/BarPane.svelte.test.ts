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

    vi.spyOn(store, 'getData').mockReturnValue({
      values: [[1, 2], [3, 4], [5, 6]],
      computed: {
          averageRows: [1.11, 2.22, 3.33],
          averageCols: [4.44, 5.55, 6.66],
          average: 9.99,
          minmax: [0, 10], 
          max: 10, 
          min: 0, 
          rows: 3, 
          cols: 3, 
          defaultTarget: [0, 0, 0], 
          defaultPosition: new Vector3(0, 0, 0) 
      }
    });
  });

  it('renders the correct info values', () => {
    render(BarPane);

    expect(screen.getByText('Row')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();

    expect(screen.getByText('Column')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();

    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.34')).toBeInTheDocument();

    expect(screen.getByText('Avg X (row)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2.22')).toBeInTheDocument();

    expect(screen.getByText('Avg Z (column)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6.66')).toBeInTheDocument();

    expect(screen.getByText('Avg Global')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9.99')).toBeInTheDocument();
  });
});