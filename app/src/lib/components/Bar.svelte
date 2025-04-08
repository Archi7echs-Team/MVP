<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { interactivity, Text } from '@threlte/extras';
	import { Raycaster, Mesh } from 'three';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fetchedData, filter, getMaxNValue, getMinNvalue } from '$lib/index.svelte';
	import { Vector3 } from 'three';

	let { id, coordinates, height, currentCameraQuaternionArray } = $props();

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
	const { scene } = useThrelte();

	// Raycaster e variabili per il mouse
	const raycaster = new Raycaster();

	// Opacità della barra

	let nMax = $derived(filter.nValuemax);
	let nMin = $derived(filter.nValuemin);

	let visible = $derived.by(() => {
		if (!(height >= filter.rangeValue.min && height <= filter.rangeValue.max)) {
			return false;
		}
		let lv = filter.selection.lastValue();
		if (filter.avgFilter === 1 && height > utils.average) {
			return false;
		} else if (filter.avgFilter === 2 && height < utils.average) {
			return false;
		}

		if (filter.barFilterSelection === 2 && height < lv) {
			return false;
		} else if (filter.barFilterSelection === 3 && height > lv) {
			return false;
		}

		if (filter.barFilterSelection === 1 && !filter.selection.check(id)) {
			return false;
		}

		if (filter.nValuemax != 0 && !getMaxNValue(height, nMax)){
			return false;
		}

		if (filter.nValuemin != 0 && !getMinNvalue(height, nMin)){
			return false;
		}

		return true;
	});

	// Controllo per opacizzazione
	let opacity = $derived(visible ? 1 : 0.2);

	// Riferimento al mesh della barra
	let mesh = $state<Mesh | undefined>(undefined);
	let text = $state<any>(undefined);

	let hover = new Tween(0, {
		duration: 100,
		easing: cubicOut
	});

	interactivity();

	const isFirstIntersected = (e: any) => {
		raycaster.setFromCamera(e.pointer, e.camera);
		const hits = raycaster.intersectObjects(scene.children, true);
		return hits.length > 0 && hits[0].object === mesh;
	};

	const isFirstTextIntersected = (e: any) => {
		raycaster.setFromCamera(e.pointer, e.camera);
		const hits = raycaster.intersectObjects(scene.children, true);
		return hits.length > 0 && hits[0].object === text;
	};

	// Applicazione filtro colorazione
	function getBarColor() {
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
	}
</script>

<T.Mesh
	bind:ref={mesh}
	onpointermove={(e: any) => {
		hover.target = isFirstIntersected(e) ? 1 : 0;
	}}
	onpointerleave={() => {
		hover.target = 0;
	}}
	onclick={(e: any) => {
		if (isFirstIntersected(e)) {
			if (e.nativeEvent.detail === 1) {
				filter.selection.toggle(id);
			} else {
				filter.selection.set([id]);
			}
		}
	}}
	position={coordinates as [number, number, number]}
	scale={[1, height, 1]}
>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={getBarColor()} transparent={true} {opacity} />
</T.Mesh>

<Text
	position={[coordinates[0], height + 0.25, coordinates[2]]}
	text={height.toFixed(2)}
	color="black"
	anchorX="center"
	anchorY="middle"
	quaternion={currentCameraQuaternionArray}
	fontSize={0.2}
	fillOpacity={hover.current}
	bind:ref={text}
	onclick={(e: any) => {
		if (isFirstTextIntersected(e)) {
			if (e.nativeEvent.detail === 1) {
				filter.selection.toggle(id);
			} else {
				filter.selection.set([id]);
			}
		}
	}}
/>
