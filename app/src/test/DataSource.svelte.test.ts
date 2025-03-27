import { render } from '@testing-library/svelte';
import DataSource from '../lib/components/DataSource.svelte';
import { describe, it, expect } from 'vitest';

describe('DataSource', () => {
  it('load all components', () => {
    const { getByText } = render(DataSource);
    expect(getByText('External API')).toBeTruthy();
    expect(getByText('DB1')).toBeTruthy();
    expect(getByText('File CSV')).toBeTruthy();
  });
});
