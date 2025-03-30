import { render, fireEvent } from '@testing-library/svelte';
import DataFilter from '../lib/components/DataFilter.svelte';
import { describe, it, expect } from 'vitest';
import {Button} from 'svelte-tweakpane-ui';
import { filter } from '$lib/index.svelte';


describe('DataFilter', () => {
  it('load all components', () => {
    const { getByText } = render(DataFilter);
    expect(getByText('Visualization interval')).toBeTruthy(); 
    expect(getByText('Show average plane')).toBeTruthy();
    expect(getByText('Values lower than the global average')).toBeTruthy(); 
    expect(getByText('Values higher than the global average')).toBeTruthy(); 
    expect(getByText('Visualization reset')).toBeTruthy(); 
  });
  it('should update the value on click', async () => {
    const { getByText } = render(Button, { label: 'Values lower than the global average', title: 'Filter' });
    expect(filter.avgFilter).toBe(0);
    const button = getByText('Values lower than the global average');
    await fireEvent.click(button);
    expect(filter.avgFilter).toBe(1);
  });
});

