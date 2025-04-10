import { render } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BarPane from '../lib/components/BarPane.svelte'
import {filter} from '$lib/index.svelte'
import * as store from '$lib/index.svelte';
import { screen, fireEvent } from '@testing-library/svelte';

vi.mock('$lib/index.svelte', async () => {
  const actual = await vi.importActual('$lib/index.svelte');
  return {
    filter: {
      spacing: 2,
      rangeValue: { min: 0, max: 0 },
      colorSelection: 2,
      avgFilter: 0,
      avgEnabled: false,
      nValuemin: 0,
      nValuemax: 0,
      barFilterSelection: 0,
      displayBarFilter: false,
      selectedOpacity: 100,
      showRowAvgPlane: false,
      showColAvgPlane: false,
      selection: Selection,
    },
    createUtils: vi.fn(() => ({
      average: 10,
      averageRows: [5, 10, 15],
      averageCols: [8, 12],
      minmax: [1, 20],
      max: 20,
      min: 1,
      rows: 3,
      cols: 2,
      defaultTarget: [5, 10, 15],
    })),
    setBarFilterSelection: vi.fn(),
    resetBarSelection: vi.fn(),
    hideBarFilterPane: vi.fn(),
    getSelectedBarInfo: vi.fn(),
  };
});

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

describe('Interactions', () => {
  it('calls resetBarSelection when "Reset selection" is clicked', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Reset selection'));
    expect(store.resetBarSelection).toHaveBeenCalledTimes(1);
  });

  it('calls hideBarFilterPane when "Close" is clicked', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Close'));
    expect(store.hideBarFilterPane).toHaveBeenCalledTimes(1);
  });

  it('calls setBarFilterSelection when "Display" is clicked', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Display'));
    expect(store.setBarFilterSelection).toHaveBeenCalledTimes(1);
  });

  it('calls setBarFilterSelection when "Filter higher', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Filter higher'));
    expect(store.setBarFilterSelection).toHaveBeenCalledTimes(1);
  });

  it('calls setBarFilterSelection when "Filter lower', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Filter lower'));
    expect(store.setBarFilterSelection).toHaveBeenCalledTimes(1);
  });

  it('calls setBarFilterSelection when "Reset filter" is clicked', async () => {
    const { getByText } = render(BarPane);
    await fireEvent.click(getByText('Reset filter'));
    expect(store.setBarFilterSelection).toHaveBeenCalledTimes(1);
  });
});
