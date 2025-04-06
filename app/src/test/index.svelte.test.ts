import { getData, getValueFromId, filter, getSelectedBarInfo } from '../lib/index.svelte';
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

    it("filter initializes with default values", () => {
        expect(filter.rangeValue).toEqual({ min: 0, max: 0 });
        expect(filter.colorSelection).toBe(2);
        expect(filter.avgFilter).toBe(0);
        expect(filter.avgEnabled).toBe(false);
        expect(filter.barFilterSelection).toBe(0);
        expect(filter.displayBarFilter).toBe(false);
        expect(filter.selectedOpacity).toBe(100);
        expect(filter.showRowAvgPlane).toBe(false);
        expect(filter.showColAvgPlane).toBe(false);
    });
    
    it("filter rangeValue is updated correctly", () => {
        filter.rangeValue = { min: 1, max: 10 };
        expect(filter.rangeValue).toEqual({ min: 1, max: 10 });
    });
    
    it("filter avgEnabled toggle works correctly", () => {
        filter.avgEnabled = true;
        expect(filter.avgEnabled).toBe(true);
        filter.avgEnabled = false;
        expect(filter.avgEnabled).toBe(false);
    });
    
    it("filter colorSelection updates correctly", () => {
        filter.colorSelection = 3;
        expect(filter.colorSelection).toBe(3);
    });

    it("getSelectedBarInfo returns null when no bars are selected", () => {
        const sel = filter.selection;
        sel.clear();
        const result = getSelectedBarInfo();
        expect(result).toBeNull();
    });
    
    it("getSelectedBarInfo returns correct bar info when a bar is selected", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        
        const result = getSelectedBarInfo();
        expect(result).toEqual({
            row: 2,
            column: 2,
            height: 4,
        });
    });
});