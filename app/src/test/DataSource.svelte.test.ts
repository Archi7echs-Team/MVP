import { render, fireEvent, waitFor } from '@testing-library/svelte';
import DataSource from '../lib/components/DataSource.svelte';
import { describe, it, expect, vi } from 'vitest';
import { cameraUtils, fetchDb, fetchExternal, uploadFile } from '$lib/index.svelte';


vi.mock('$lib/index.svelte', async () => {
  const actual = await vi.importActual('$lib/index.svelte');
  return {
    uploadFile: vi.fn(),
    fetchDb: vi.fn(),
    fetchExternal: vi.fn(),
    cameraUtils: {
      resetCamera: vi.fn(),
    }
  };
});

vi.mock('@threlte/core', () => ({
  useThrelte: () => ({ camera: {} }),
}));

describe('DataSource', () => {
  it('load all components', () => {
    const { getByText } = render(DataSource);
    expect(getByText('External API')).toBeTruthy();
    expect(getByText('DB1')).toBeTruthy();
    expect(getByText('File')).toBeTruthy();
    expect(getByText('Send file CSV')).toBeTruthy();
  });

  it('calls fetchExternal and resetCamera on "Select API" click', async () => {
    const { getByText } = render(DataSource);
    await fireEvent.click(getByText('Select API'));
    await waitFor(() => {
      expect(fetchExternal).toHaveBeenCalledTimes(1);
      expect(cameraUtils.resetCamera).toHaveBeenCalledTimes(1);
    });
  });

  it('calls fetchDb and resetCamera on "Select DB1" click', async () => {
    const { getByText } = render(DataSource);
    await fireEvent.click(getByText('Select DB1'));
    await waitFor(() => {
      expect(fetchDb).toHaveBeenCalledTimes(1);
      expect(cameraUtils.resetCamera).toHaveBeenCalledTimes(1);
    });
  });

  it('calls uploadFile on "Select CSV" click', async () => {
    const { getByText } = render(DataSource);
    await fireEvent.click(getByText('Select CSV'));
    expect(uploadFile).toHaveBeenCalledTimes(1);
  });
});
