import { render, fireEvent } from '@testing-library/svelte';
import Color from '../lib/components/Color.svelte';
import { describe, it, expect } from 'vitest';
import { filter } from '$lib/index.svelte';

describe('Color', () => {
  it('load all components', () => {
    const { getByText } = render(Color);
    expect(getByText('Color type')).toBeTruthy();
  });
  it('change option when it is selected and set the value of variable', async () => {
    const { getByText } = render(Color);
    const label = getByText('Color type');
    const container = label.closest('.tp-lblv');
    expect(container).not.toBeNull();
    const col = getByText('colonne');
    await fireEvent.click(col);
    const row = getByText('righe'); 
    await fireEvent.click(row);
    expect(getByText('righe')).toBeInTheDocument();
    const val = getByText('valori'); 
    await fireEvent.click(val);
    expect(getByText('valori')).toBeInTheDocument();
  });
});


