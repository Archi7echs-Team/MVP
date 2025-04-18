import { render } from '@testing-library/svelte';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import App from '../lib/components/App.svelte';

// Mock globale di `fecthedData` e `spacing`
const mockSpacing = 2;
const mockFecthedData = [
  [2, 3, 5, 2, 2],
  [1, 4, 6, 3, 1],
  [2, 5, 7, 4, 8],
  [3, 2, 4, 1, 5],
  [1, 3, 2, 6, 4],
];

// Calcolo di `defaultTarget` basato su `fecthedData` e `spacing`
const mockDefaultTarget = [
  (mockFecthedData.length * mockSpacing) / 2 - mockSpacing / 2,
  (Math.max(...mockFecthedData.flat()) - 1) / 2,
  (mockFecthedData[0].length * mockSpacing) / 2 - mockSpacing / 2,
];

// Mock di `utils`
const mockUtils = {
  defaultTarget: mockDefaultTarget,
};

vi.mock('$lib/index.svelte', async () => {
    const actual = await vi.importActual('$lib/index.svelte');
    return {
      createUtils: vi.fn(() => ({
        average: 10,
        averageRows: [5, 10, 15],
        averageCols: [8, 12],
        minmax: [1, 20],
        max: 20,
        min: 1,
        rows: 3,
        cols: 2,
        defaultTarget: [
            (mockFecthedData.length * mockSpacing) / 2 - mockSpacing / 2,
            (Math.max(...mockFecthedData.flat()) - 1) / 2,
            (mockFecthedData[0].length * mockSpacing) / 2 - mockSpacing / 2
          ],
      })),
    };
  });


// Mock di `@threlte/core`
vi.mock('@threlte/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    Canvas: () => '<div data-testid="mock-canvas">Mocked Canvas</div>',
  };
});

// Mock di `@threlte/extras`
vi.mock('@threlte/extras', () => ({
  Text: {},
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reset the target to utils.defaultTarget', async () => {
    const { component } = render(App);
    component.resetTarget();
    expect(component.getTarget()).toEqual(mockDefaultTarget);
  });
});