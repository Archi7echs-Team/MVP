import { Mesh, Raycaster, Vector3 } from 'three';
import type { Writable } from 'svelte/store';

let spacing = $state(2);

let fecthedData = $state([
	[2, 3, 5, 2, 2],
	[1, 4, 6, 3, 1],
	[2, 5, 7, 4, 8],
	[3, 2, 4, 1, 5],
	[1, 3, 2, 6, 4]
]);

// data.computed are the values that are computed from the fetched datas and aren't editable by the user
let data = $derived({
	values: fecthedData,
	computed: {
	  // Media totale di tutti i dati
	  average: fecthedData.flat().reduce((a, b) => a + b, 0) / fecthedData.flat().length,
	  // Media per ogni riga: ogni elemento dell'array è la media dei valori della corrispondente riga
	  averageRows: fecthedData.map(row => row.reduce((a, b) => a + b, 0) / row.length),
	  // Media per ogni colonna: ogni elemento è la media dei valori nella stessa posizione in tutte le righe
	  averageCols: Array.from({ length: fecthedData[0].length }, (_, colIndex) => fecthedData.map(row => row[colIndex]).reduce((a, b) => a + b, 0) / fecthedData.length),
	  minmax: [Math.min(...fecthedData.flat()), Math.max(...fecthedData.flat())],
	  max: Math.max(...fecthedData.flat()),
	  min: Math.min(...fecthedData.flat()),
	  rows: fecthedData.length,
	  cols: fecthedData[0].length,
	  defaultTarget: [
		(fecthedData.length * spacing) / 2 - spacing / 2,
		(Math.max(...fecthedData.flat()) - 1) / 2,
		(fecthedData[0].length * spacing) / 2 - spacing / 2
	  ],
	  defaultPosition: new Vector3(15, 7.5, 15)
	}
  });

export const getData = () => {
	return data;
};

export const getValueFromId = (id: string) => {
	return data.values[parseInt(id.split('-')[0])][parseInt(id.split('-')[1])];
};

export function resetTarget(targetStore: Writable<number[]>, utils: { defaultTarget: number[] }) {
	targetStore.set(utils.defaultTarget);
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
	//rangeValue: { min: $state.snapshot(data.computed.min), max: $state.snapshot(data.computed.max) },
	colorSelection: 2,
	avgFilter: 0,
	avgEnabled: false,
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

//funzione per troncare il testo se troppo lungo
export function truncateText(text: string, maxLength: number = 20) {
	return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function takeScreenshot(renderer: any, scene: any, camera: any) {
    renderer.render(scene, camera.current);
    const dataUrl = renderer.domElement.toDataURL('image/png');
	renderer.setClearColor('#0e1625');
    downloadImage(dataUrl);
}

export function downloadImage(dataUrl: string) {
    const link = document.createElement('a');
    link.download = `Screenshot_${new Date().toLocaleDateString()}.png`;
    link.href = dataUrl;
    link.click();
}

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
            camera.current.position.copy(data.computed.defaultPosition);
            if (resetTarget) resetTarget();
        }
    }
}

export function setBarFilterSelection(value: number) {
	if ([0, 1, 2, 3].includes(value)) {
		filter.barFilterSelection = value;
	}
}

export function resetBarSelection() {
	filter.selection.clear();
}

export function hideBarFilterPane() {
	filter.displayBarFilter = false;
}

export const isInRange = (height: number) => {
    return height >= filter.rangeValue.min && height <= filter.rangeValue.max;
};

// Funzione per applicare il filtro
export const passesBarFilter = (id: string, height: number) => {
    const lv = filter.selection.lastValue();
    const isSelected = filter.selection.check(id);

    if (filter.avgFilter === 1 && height > data.computed.average) return false;
    if (filter.avgFilter === 2 && height < data.computed.average) return false;

    if (filter.barFilterSelection === 1 && !isSelected) return false;

    if (filter.barFilterSelection === 2) {
        return height > lv && !isSelected;
    }

    if (filter.barFilterSelection === 3) {
        return height < lv && !isSelected;
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
        let normalized = (height - filter.rangeValue.min) / (filter.rangeValue.max - filter.rangeValue.min || 1);
        let hue = 240 - normalized * 240;
        return `hsl(${hue}, 80%, 50%)`;
    }
    return '#ffffff';
};

export const isFirstIntersected = (e: any, raycaster: Raycaster, mesh: Mesh | undefined, scene: any): boolean => {
    raycaster.setFromCamera(e.pointer, e.camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.length > 0 && hits[0].object === mesh;
};

export const isFirstTextIntersected = (e: any, raycaster: Raycaster, text: any, scene: any): boolean => {
    raycaster.setFromCamera(e.pointer, e.camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.length > 0 && hits[0].object === text;
};

export const handleTextClick = (e: any, id: string, filter: any, raycaster: Raycaster, text: any, scene: any) => {
    if (isFirstTextIntersected(e, raycaster, text, scene)) {
        if (e.nativeEvent.detail === 1) {
            filter.selection.toggle(id);
        } else {
            filter.selection.set([id]);
        }
    }
};