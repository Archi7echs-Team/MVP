import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CameraSettings from '../lib/components/CameraSettings.svelte';
import { cameraUtils } from '$lib/index.svelte';

vi.mock('$lib/index.svelte', () => ({
  cameraUtils: {
    resetCamera: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
  },
}));

vi.mock('@threlte/core', () => ({
  useThrelte: () => ({
    camera: {
      current: {
        position: {
          copy: vi.fn(),
          add: vi.fn()
        },
        getWorldDirection: vi.fn(() => ({
          multiplyScalar: vi.fn().mockReturnThis()
        })),
        quaternion: {
          toArray: () => [0, 0, 0, 1]
        }
      }
    }
  }),
  T: {}
}))

describe('CameraSettings', () => {
  let resetTarget: any;

  beforeEach(() => {
    resetTarget = vi.fn();
  });

  beforeEach(() => {
    resetTarget = vi.fn();
    vi.clearAllMocks();
  });

  it('loads all components', () => {
    const { getByText } = render(CameraSettings, { props: { resetTarget } });
    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Zoom In')).toBeInTheDocument();
    expect(getByText('Zoom Out')).toBeInTheDocument();
  });

  it('calls resetPosition on "Reset" click', async () => {
    const { getByText } = render(CameraSettings, { props: { resetTarget } });
    await fireEvent.click(getByText('Reset'));
    expect(cameraUtils.resetCamera).toHaveBeenCalledTimes(1);
    expect(cameraUtils.resetCamera).toHaveBeenCalledWith(expect.anything(), resetTarget);
  });

  it('calls zoomIn on "Zoom In" click', async () => {
    const { getByText } = render(CameraSettings, { props: { resetTarget } });
    await fireEvent.click(getByText('+'));
    expect(cameraUtils.zoomIn).toHaveBeenCalledTimes(1);
    expect(cameraUtils.zoomIn).toHaveBeenCalledWith(expect.anything());
  });

  it('calls zoomOut on "Zoom Out" click', async () => {
    const { getByText } = render(CameraSettings, { props: { resetTarget } });
    await fireEvent.click(getByText('-'));
    expect(cameraUtils.zoomOut).toHaveBeenCalledTimes(1);
    expect(cameraUtils.zoomOut).toHaveBeenCalledWith(expect.anything());
  });
});
