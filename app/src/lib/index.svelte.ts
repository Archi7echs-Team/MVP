import { Vector3 } from 'three';

import { getDbData, getExternalData } from '$lib/data.svelte';

export let fetchedData = $state({
	values: [
		[2, 3, 5, 2, 2],
		[1, 4, 6, 3, 1],
		[2, 5, 7, 4, 8],
		[3, 2, 4, 1, 5],
		[1, 3, 2, 6, 4]
	],
	spacing: 2,
	xLabels : ['A', 'B', 'C', 'D', 'E'],
	zLabels : ['1', '2', '3', '4', '5'],
});

// set fetchedData to the data fetched from the server
export const fetchDb = () => {
	let tmp = getDbData();
	fetchedData.values = tmp.yValues;
	fetchedData.xLabels = tmp.xLabels;
	fetchedData.zLabels = tmp.zLabels;
};

export const fetchExternal = () => {
	let tmp = getExternalData();
	fetchedData.values = tmp.yValues;
	fetchedData.xLabels = tmp.xLabels;
	fetchedData.zLabels = tmp.zLabels;
};

// data.computed are the values that are computed from the fetched datas and aren't editable by the user
let data = $derived(fetchedData.values);

const utils = $derived({
	average: data.flat().reduce((a, b) => a + b, 0) / data.flat().length,
	minmax: [Math.min(...data.flat()), Math.max(...data.flat())],
	max: Math.max(...data.flat()),
	min: Math.min(...data.flat()),
	rows: data.length,
	cols: data[0].length,
	defaultTarget: [
		(data.length * fetchedData.spacing) / 2 - fetchedData.spacing / 2,
		(Math.max(...data.flat()) - 1) / 2,
		(data[0].length * fetchedData.spacing) / 2 - fetchedData.spacing / 2
	],
	defaultPosition: new Vector3(15, 7.5, 15)
});

export const getValueFromId = (id: string) => {
	return data[parseInt(id.split('-')[0])][parseInt(id.split('-')[1])];
};

export const getMaxNValue = (value: number, n: string) => {
	let num = parseInt(n);
	let filtered = fetchedData.values
		.flat()
		.sort((a, b) => b - a)
		.slice(0, num);
	return filtered.includes(value);
};

export const getMinNvalue = (value: number, n: string) => {
	let num = parseInt(n);
	let filtered = fetchedData.values
		.flat()
		.sort((a, b) => a - b)
		.slice(0, num);
	return filtered.includes(value);
};

class Selection {
	selected: any[] = $state([]);

	constructor() {
		this.selected = [];
	}
	add = (id: any) => {
		// add the bar to the selecgted array if it is not already there
		if (!this.selected.includes(id)) this.selected.push(id);
	};
	remove = (id: any) => {
		this.selected = this.selected.filter((b) => b !== id);
	};
	clear = () => {
		this.selected = [];
	};
	set = (ids: any[]) => {
		this.selected = ids;
	};
	check = (id: any) => {
		return this.selected.includes(id);
	};
	active = () => {
		return this.selected.length > 0;
	};
	toggle = (id: any) => {
		if (this.check(id)) {
			this.remove(id);
		} else {
			this.add(id);
		}
	};
	lastValue = () => {
		return this.active() ? getValueFromId(selection.selected.at(-1)) : 0;
	};
}

let selection = new Selection();

export const filter = $state({
	spacing: 2,
	rangeValue: { min: 0, max: 0 },
	colorSelection: 2,
	avgFilter: 0,
	avgEnabled: false,
	barFilterSelection: 0,
	displayBarFilter: false,
	selection: selection,
	nValuemin: '0',
	nValuemax: '0'
});
