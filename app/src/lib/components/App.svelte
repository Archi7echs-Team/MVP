<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import SettingsPane from './SettingsPane.svelte';
	import BarPane from './BarPane.svelte';
	import { fetchedData, createUtils } from '$lib/index.svelte';
		
	const utils = $derived(createUtils());

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
