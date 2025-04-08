<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import SettingsPane from './SettingsPane.svelte';
	import BarPane from './BarPane.svelte';
	import { getData, resetTarget } from '$lib/index.svelte';

	let utils = $derived(getData().computed);
	let target = $state(getData().computed.defaultTarget);
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
