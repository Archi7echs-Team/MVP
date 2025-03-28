import { render } from '@testing-library/svelte';
import DataFilter from '../lib/components/DataFilter.svelte';
import { describe, it, expect } from 'vitest';

describe('DataFilter', () => {
  it('load all components', () => {
    const { getByText } = render(DataFilter);
    expect(getByText('Visualization interval')).toBeTruthy(); 
    expect(getByText('Values ​​lower than the global average')).toBeTruthy(); 
    expect(getByText('Values higher than the global average')).toBeTruthy(); 
    expect(getByText('Visualization reset')).toBeTruthy(); 
  });
});

