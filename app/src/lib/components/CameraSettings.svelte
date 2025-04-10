<script lang="ts">
    import { useThrelte } from '@threlte/core';
	import { Button } from 'svelte-tweakpane-ui';
	import { cameraUtils } from '$lib/index.svelte';

	let { resetTarget } = $props();
	const { camera } = useThrelte();
	
</script>

<Button label="Reset" title="Reset position" on:click={() => cameraUtils.resetCamera(camera, resetTarget)} />

<Button label="Zoom In" title="+" on:click={() => cameraUtils.zoomIn(camera)} />

<Button label="Zoom Out" title="-" on:click={() => cameraUtils.zoomOut(camera)} />