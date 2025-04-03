import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CameraSettings from '../lib/components/CameraSettings.svelte';


vi.mock('@threlte/core', async () => {
  const actual = await vi.importActual('@threlte/core');
  return {
    ...actual,
    useThrelte: () => ({
      camera: {
        current: {
          getWorldDirection: (target: any) => {
            target.set(0, 0, -1);
            return target;
          },
          position: {
            add: vi.fn(), 
            copy: vi.fn(), 
          },
        }
      }
    })
  };
});



describe('CameraSettings', () => {
  let resetTarget: any;

  it('renders without crashing', () => {
    const { container } = render(CameraSettings, { props: { resetTarget } });
    expect(container).toBeTruthy();
  });

  it('loads all components', () => {
    const { getByText } = render(CameraSettings, { props: { resetTarget } });
    expect(getByText('Resetta')).toBeInTheDocument();
    expect(getByText('Zoom In')).toBeInTheDocument();
    expect(getByText('Zoom Out')).toBeInTheDocument();
  });
});
