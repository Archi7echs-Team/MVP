<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { interactivity, Text } from '@threlte/extras';
	import { Raycaster, Mesh } from 'three';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import {
		filter,
		passesBarFilter,
		getBarColor,
		isFirstTextIntersected,
		isFirstIntersected,
		handleTextClick
	} from '$lib/index.svelte';

	let { id, coordinates, height, currentCameraQuaternionArray } = $props();

	const { scene } = useThrelte();

	// Raycaster e variabili per il mouse
	const raycaster = new Raycaster();

	let passesFilter = $derived(passesBarFilter(id, height));

	// Controllo per opacizzazione
	let opacity = $derived(
		passesFilter ? (filter.selection.check(id) ? filter.selectedOpacity / 100 : 1) : 0.2
	);
	// Riferimento al mesh della barra
	let mesh = $state<Mesh | undefined>(undefined);
	let text = $state<any>(undefined);

	let hover = new Tween(0, {
		duration: 100,
		easing: cubicOut
	});

	interactivity();

	const isIntersected = (e: any) => isFirstIntersected(e, raycaster, mesh, scene);
	const isTextIntersected = (e: any) => isFirstTextIntersected(e, raycaster, text, scene);
</script>

<T.Mesh
	bind:ref={mesh}
	onpointermove={(e: any) => {
		hover.target = isFirstIntersected(e, raycaster, mesh, scene) ? 1 : 0;
	}}
	onpointerleave={() => {
		hover.target = 0;
	}}
	onclick={(e: any) => {
		if (isFirstIntersected(e, raycaster, mesh, scene)) {
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
	<T.MeshStandardMaterial color={getBarColor(coordinates, height)} transparent={true} {opacity} />
</T.Mesh>

<Text
	position={[coordinates[0], height + 0.25, coordinates[2]]}
	text={height.toFixed(2)}
	color="white"
	anchorX="center"
	anchorY="middle"
	outlineColor="black"
	outlineWidth={0.01} 
	outlineOpacity={hover.current}
	quaternion={currentCameraQuaternionArray}
	fontSize={0.2}
	fillOpacity={hover.current}
	bind:ref={text}
	onclick={(e: any) => {
		handleTextClick(e, id, filter, raycaster, text, scene);
	}}
/>
