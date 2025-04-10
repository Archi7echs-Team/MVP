import { Mesh, Raycaster, Vector3 } from 'three';

import { getDbData, getExternalData, uploadCsvFile } from '$lib/data.svelte';

// row of matrix are the xValues (a zLabel for each row)
// column of matrix are the zValues (a xLabel for each column)
// e.g. xLabel A refer to first column

export let fetchedData = $state({
	values: [
		[2, 3, 5, 2, 2],
		[1, 4, 6, 3, 1],
		[2, 5, 7, 4, 8],
		[3, 2, 4, 1, 5],
		[1, 3, 2, 6, 4]
	],
	spacing: 2,
	xLabels: ['A', 'B', 'C', 'D', 'E'],
	zLabels: ['1', '2', '3', '4', '5']
});

// set fetchedData to the data fetched from the server
export const fetchDb = async () => {
	let tmp = await getDbData();
	if (!tmp) {
		//alert('Error fetching data from the server');
		return;
	}
	fetchedData.values = tmp.yValues;
	fetchedData.xLabels = tmp.xLabels;
	fetchedData.zLabels = tmp.zLabels;
	resetFilter();
};

export const fetchExternal = async () => {
	let tmp = await getExternalData();
	if (!tmp) {
		//alert('Error fetching data from the server');
		return;
	}
	fetchedData.values = tmp.yValues;
	fetchedData.xLabels = tmp.xLabels;
	fetchedData.zLabels = tmp.zLabels;
	resetFilter();
};

export const uploadFile = async (file: any) => {
	try {
		let tmp = await uploadCsvFile(file);
		if (!tmp) {
			return;
		}
		fetchedData.values = tmp.yValues;
		fetchedData.xLabels = tmp.xLabels;
		fetchedData.zLabels = tmp.zLabels;
		resetFilter();
	} catch (error) {
		console.error('Error uploading file:', error);
	}
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

// sort the data by value without repetition
export const sortAscData = (data: number[][]) => {
	let sorted = data.flat().sort((a, b) => a - b);
	let unique = [...new Set(sorted)];
	return unique;
};

export const sortDescData = (data: number[][]) => {
	let sorted = data.flat().sort((a, b) => b - a);
	let unique = [...new Set(sorted)];
	return unique;
};

const sortedData = $derived({
	asc: sortAscData(data),
	desc: sortDescData(data)
});

export const getLength = (data: number[][]) => {
	let unique = [...new Set(data.flat())];
	return unique.length;
};

const length = $derived(getLength(data));

/*export const getMaxNValue = (value: number, n: number) => {
	const filtered = sortedData.desc.slice(0, n); 
	return filtered.includes(value);
};

export const getMinNvalue = (value: number, n: number) => {
	const filtered = sortedData.asc.slice(0, n); 
	return filtered.includes(value);
};*/

export const getValueFromId = (id: string) => {
	return data[parseInt(id.split('-')[0])][parseInt(id.split('-')[1])];
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
};

let selection = new Selection();

export const filter = $state({
	spacing: 2,
	rangeValue: { min: 0, max: 0 },
	colorSelection: 2,
	avgFilter: 0,
	avgEnabled: false,
	nValuemin: 0,
	nValuemax: 0,
	barFilterSelection: 0,
	displayBarFilter: false,
	selectedOpacity: 100, // predefinito (100)
	showRowAvgPlane: false,
	showColAvgPlane: false,
	selection: selection
});

export const getSelectedBarInfo = () => {
	if (!selection.active()) return null;

	const lastId = selection.selected.at(-1);
	const [row, col] = lastId.split('-').map(Number);
	const value = getValueFromId(lastId);

	return { row: row + 1, column: col + 1, height: value };
};

export function takeScreenshot(renderer: any, scene: any, camera: any) {
	renderer.render(scene, camera.current);
	const dataUrl = renderer.domElement.toDataURL('image/png');
	renderer.setClearColor('#0e1625');
	downloadImage(dataUrl);
};

export function downloadImage(dataUrl: string) {
	const link = document.createElement('a');
	link.download = `Screenshot_${new Date().toLocaleDateString()}.png`;
	link.href = dataUrl;
	link.click();
};

export const cameraUtils = {
	zoomStep: 2,
	zoomValue: 5,

	zoomIn(camera: any) {
		this.updateCamera(camera, this.zoomStep);
	},

	zoomOut(camera: any) {
		this.updateCamera(camera, -this.zoomStep);
	},

	updateCamera(camera: any, step: number) {
		if (camera?.current) {
			const direction = new Vector3();
			camera.current.getWorldDirection(direction); // Ottiene la direzione attuale della camera
			direction.multiplyScalar(step); // Scala il vettore di zoomStep
			camera.current.position.add(direction);
		}
	},

	resetCamera(camera: any, resetTarget: () => void) {
		if (camera?.current) {
			camera.current.position.copy(utils.defaultPosition);
			if (resetTarget) resetTarget();
		}
	}
};

export function setBarFilterSelection(value: number) {
	if ([0, 1, 2, 3].includes(value)) {
		filter.barFilterSelection = value;
	}
	if (value === 0) {
		filter.selection.clear();
	}
};

export function resetBarSelection() {
	filter.selection.clear();
};

export function hideBarFilterPane() {
	filter.displayBarFilter = false;
};

export const isInRange = (height: number) => {
	return height >= filter.rangeValue.min && height <= filter.rangeValue.max;
};

// Funzione per applicare il filtro
export const passesBarFilter = (id: string, height: number) => {
	if (!isInRange(height)) return false;
	const lv = filter.selection.lastValue();
	const isSelected = filter.selection.check(id);

	if (filter.avgFilter === 1 && height > utils.average) return false;
	if (filter.avgFilter === 2 && height < utils.average) return false;

	if (filter.barFilterSelection === 1 && !isSelected) return false;

	if (filter.barFilterSelection === 2) {
		return height > lv && !isSelected;
	}

	if (filter.barFilterSelection === 3) {
		return height < lv && !isSelected;
	}
	if (filter.nValuemax != 0 && !getMaxNValue(height, filter.nValuemax)) {
		return false;
	}

	if (filter.nValuemin != 0 && !getMinNvalue(height, filter.nValuemin)){
		return false;
	}
	return true;
};

// Funzione per calcolare il colore della barra
export const getBarColor = (coordinates: [number, number, number], height: number) => {
	if (filter.colorSelection === 1) {
		return `hsl(${(coordinates[2] * 50) % 360}, 80%, 60%)`;
	} else if (filter.colorSelection === 2) {
		return `hsl(${(coordinates[0] * 50) % 360}, 80%, 60%)`;
	} else if (filter.colorSelection === 3) {
		let normalized =
			(height - filter.rangeValue.min) / (filter.rangeValue.max - filter.rangeValue.min || 1);
		let hue = 240 - normalized * 240;
		return `hsl(${hue}, 80%, 50%)`;
	}
	return '#ffffff';
};

export const isFirstIntersected = (
	e: any,
	raycaster: Raycaster,
	mesh: Mesh | undefined,
	scene: any
): boolean => {
	raycaster.setFromCamera(e.pointer, e.camera);
	const hits = raycaster.intersectObjects(scene.children, true);
	return hits.length > 0 && hits[0].object === mesh;
};

export const isFirstTextIntersected = (
	e: any,
	raycaster: Raycaster,
	text: any,
	scene: any
): boolean => {
	raycaster.setFromCamera(e.pointer, e.camera);
	const hits = raycaster.intersectObjects(scene.children, true);
	return hits.length > 0 && hits[0].object === text;
};

export const handleTextClick = (
	e: any,
	id: string,
	filter: any,
	raycaster: Raycaster,
	text: any,
	scene: any
) => {
	if (isFirstTextIntersected(e, raycaster, text, scene)) {
		if (e.nativeEvent.detail === 1) {
			filter.selection.toggle(id);
		} else {
			filter.selection.set([id]);
		}
	}
};

export const resetFilter = () => {
	filter.rangeValue.min = 0;
	filter.rangeValue.max = utils.max;
	filter.nValuemin = 0;
	filter.nValuemax = 0;
	//filter.colorSelection = 2;
	filter.avgFilter = 0;
	filter.avgEnabled = false;
	filter.barFilterSelection = 0;
	filter.displayBarFilter = false;
	filter.selectedOpacity = 100;
	filter.showRowAvgPlane = false;
	filter.showColAvgPlane = false;
	filter.selection.clear();
};
