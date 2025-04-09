import { render, fireEvent } from '@testing-library/svelte';
import DataSource from '../lib/components/DataSource.svelte';
import { describe, it, expect, vi } from 'vitest';
import resetTarget  from '../lib/components/DataSource.svelte';
import { fetchDb, fetchExternal, uploadFile } from '$lib/index.svelte';

// Mocks
vi.mock('$lib/index.svelte', () => ({
  fetchDb: vi.fn(),
  fetchExternal: vi.fn(),
  uploadFile: vi.fn()
}));

vi.mock('$lib/data.svelte', () => ({
  uploadCsvFile: vi.fn()
}));

describe('DataSource', () => {
  it('load all components', () => {
    const { getByText } = render(DataSource);
    expect(getByText('External API')).toBeTruthy();
    expect(getByText('DB1')).toBeTruthy();
    expect(getByText('File')).toBeTruthy();
    expect(getByText('Send file CSV')).toBeTruthy();
  });

  it('calls fetchExternal on "Select API" click', async () => {
    const { getByText } = render(DataSource, { props: { resetTarget } });
    await fireEvent.click(getByText('Select API'));
    expect(fetchExternal).toHaveBeenCalledTimes(1);
  });

  it('calls fetchDb on "Select DB1" click', async () => {
    const { getByText } = render(DataSource, { props: { resetTarget } });
    await fireEvent.click(getByText('Select DB1'));
    expect(fetchDb).toHaveBeenCalledTimes(1);
  });

  it('calls uploadFile on "Select CSV" click', async () => {
    const { getByText } = render(DataSource, { props: { resetTarget } });
    await fireEvent.click(getByText('Select CSV'));
    expect(uploadFile).toHaveBeenCalledTimes(1);
  });
});
