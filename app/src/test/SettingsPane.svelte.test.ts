import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SettingsPane from '../lib/components/SettingsPane.svelte';

vi.mock('@threlte/core', () => ({
    useThrelte: () => ({
      camera: {
        current: {
          quaternion: {
            toArray: () => [0, 0, 0, 1]
          }
        }
      }
    }),
    T: {}
  }))

describe('SettingsPane', () => {
  it('renders without crashing', () => {
    const { container } = render(SettingsPane);
    expect(container).toBeTruthy();
  });

  it('load all compotents', () => {
    const { getByText } = render(SettingsPane);
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Camera')).toBeInTheDocument();
    expect(getByText('Source')).toBeInTheDocument();
    expect(getByText('Filter')).toBeInTheDocument();
    expect(getByText('Color')).toBeInTheDocument();
    expect(getByText('Export')).toBeInTheDocument();
  });
});