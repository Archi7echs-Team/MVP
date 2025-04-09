<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import SettingsPane from './SettingsPane.svelte';
	import BarPane from './BarPane.svelte';
	import { fetchedData } from '$lib/index.svelte';
	import { Vector3 } from 'three';
	
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

	let target = $state(utils.defaultTarget);

	export function resetTarget() {
		target = utils.defaultTarget;
	}

	export function getTarget() {
		return target;
	}
</script>

<div>
	<Canvas>
		<SettingsPane {resetTarget} />
		<BarPane />
		<Scene {target} />
	</Canvas>
</div>

<style>
	div {
		position: relative;
		height: 100vh;
		width: 100vw;
		background-color: rgb(14, 22, 37);
	}
</style>
