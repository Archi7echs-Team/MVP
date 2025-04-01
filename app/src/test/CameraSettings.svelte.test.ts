import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CameraSettings from '../lib/components/CameraSettings.svelte';

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

describe('CameraSettings', () => {
  it('renders without crashing', () => {
    const { container } = render(CameraSettings);
    expect(container).toBeTruthy();
  });

  it('load all compotents', () => {
    const { getByText } = render(CameraSettings);
    expect(getByText('Resetta')).toBeInTheDocument();
    expect(getByText('Zoom In')).toBeInTheDocument();
    expect(getByText('Zoom Out')).toBeInTheDocument();
  });

});