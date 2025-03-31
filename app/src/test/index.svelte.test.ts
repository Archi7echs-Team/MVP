import { getData, getValueFromId, filter } from '../lib/index.svelte';
import { describe, it, expect } from 'vitest';

describe('Index', () => {
    it("getData() return the correct data", () => { 
        const data = getData();
        expect(data.values.length).toBe(5);
        expect(data.computed.rows).toBe(5);
        expect(data.computed.cols).toBe(5);
        expect(data.computed.average).toBeGreaterThan(0); 
    });

    it("getValueFromId() return the correct value", () => {
        expect(getValueFromId('0-0')).toBe(2);
        expect(getValueFromId('2-2')).toBe(7);
    });

    it("selectionToggle add and remove the id from the selected array", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        expect(sel.check('1-1')).toBe(true);
        sel.toggle('1-1');
        expect(sel.check('1-1')).toBe(false);
    });

    it("load the correct default value", () => {  
        expect(filter.spacing).toBe(2);
        expect(filter.avgEnabled).toBe(false);
        expect(filter.colorSelection).toBe(2);
    });

    it("lastValue return 0 if there aren't any selected bars", () => {
        const sel = filter.selection;
        sel.clear();
        expect(sel.lastValue()).toBe(0);
    });

    it("lastValue return the last selected value", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        expect(sel.lastValue()).toBe(4);
    });

    it("set replace all selection", () => {
        const sel = filter.selection;
        sel.set(['0-0', '1-1']);
        expect(sel.selected).toEqual(['0-0', '1-1']);
        sel.set(['3-2']);
        expect(sel.selected).toEqual(['3-2']);
    });

    it("set with empty array clear the selection", () => {
        const sel = filter.selection;
        sel.set(['2-2']);
        expect(sel.selected).toEqual(['2-2']);
        sel.set([]);
        expect(sel.selected).toEqual([]);
    });
});