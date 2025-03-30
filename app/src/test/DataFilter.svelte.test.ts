import { render, fireEvent, getAllByRole } from '@testing-library/svelte';
import DataFilter from '../lib/components/DataFilter.svelte';
import { describe, it, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';
import { filter } from '$lib/index.svelte';
import { getAll } from 'three/examples/jsm/libs/tween.module.js';


describe('DataFilter', () => {
  it('load all components', () => {
    const { getByText } = render(DataFilter);
    expect(getByText('Visualization interval')).toBeTruthy(); 
    expect(getByText('Show average plane')).toBeTruthy();
    expect(getByText('Values lower than the global average')).toBeTruthy(); 
    expect(getByText('Values higher than the global average')).toBeTruthy(); 
    expect(getByText('Visualization reset')).toBeTruthy(); 
  });
  it('set avgFilter to 1 when click the Lower than average button', async () => {
    const { getByText } = render(DataFilter);
    const buttonLabel = getByText('Lower than average');
    const button = buttonLabel.closest('button');
    expect(filter.avgFilter).toBe(0);
    await fireEvent.click(button!);
    expect(filter.avgFilter).toBe(1);
  });
  it('set avgFilter and avgEnabled to 0 when click the Reset button', async () => {
    const { getByText } = render(DataFilter);
    const buttonLabel = getByText('Reset');
    const button = buttonLabel.closest('button');
    await fireEvent.click(button!);
    expect(filter.avgFilter).toBe(0);
    expect(filter.avgEnabled).toBe(false);
  });
  it('set avgFilter to 2 when click the Grater than average button', async () => {
    const { getByText } = render(DataFilter);
    const buttonLabel = getByText('Grater than average');
    const button = buttonLabel.closest('button');
    expect(filter.avgFilter).toBe(0);
    await fireEvent.click(button!);
    expect(filter.avgFilter).toBe(2);
  });
  it('check if checbox is chekable and set value of avgEnabled', async () => {
    const { getByText } = render(DataFilter);
    const labelEl = getByText('Show average plane');
    const container = labelEl.closest('.tp-lblv');
    expect(container).not.toBeNull();
    const checkbox = container!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    expect(checkbox.checked).toBe(false);
    expect(filter.avgEnabled).toBe(false);
    await fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(filter.avgEnabled).toBe(true);
    await fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
    expect(filter.avgEnabled).toBe(false);
  });
});

