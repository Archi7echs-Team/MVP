import { render } from '@testing-library/svelte';
import Color from '../lib/components/Color.svelte';
import { describe, it, expect } from 'vitest';

describe('Color', () => {
  it('load all components', () => {
    const { getByText } = render(Color);
    expect(getByText('Color type')).toBeTruthy();
    expect(getByText('colonne')).toBeInTheDocument();
    expect(getByText('righe')).toBeInTheDocument();
    expect(getByText('valori')).toBeInTheDocument();
  });
});


