<script lang="ts">
	import { Button, File, type FileValue  } from 'svelte-tweakpane-ui';
	import { fetchDb, fetchExternal, uploadFile, cameraUtils } from '$lib/index.svelte';
    import { useThrelte } from '@threlte/core';

	const { camera } = useThrelte();

	let { resetTarget } = $props();
	let file: FileValue = $state(undefined);

</script>

<Button
	label="External API"
	title="Select API"
	on:click={() => {
		fetchExternal();
		cameraUtils.resetCamera(camera, resetTarget);
	}}
/>

<Button
	label="DB1"
	title="Select DB1"
	on:click={() => {
		fetchDb();
		cameraUtils.resetCamera(camera, resetTarget);
	}}
/>

<File bind:value={file} label="File" />
<Button label="Send file CSV" title="Select CSV" on:click={() => {uploadFile(file)}}/>