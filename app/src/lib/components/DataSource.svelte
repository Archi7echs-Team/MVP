<script lang="ts">
	import { Button, File, type FileValue  } from 'svelte-tweakpane-ui';
	import { fetchDb, fetchExternal, uploadFile } from '$lib/index.svelte';
	import { uploadCsvFile } from '$lib/data.svelte';
	let { resetTarget } = $props();
	let file: FileValue = $state(undefined);

</script>

<Button
	label="External API"
	title="Select"
	on:click={() => {
		fetchExternal();
		resetTarget();
	}}
/>

<Button
	label="DB1"
	title="Select"
	on:click={() => {
		fetchDb();
		resetTarget();
	}}
/>

<File bind:value={file} label="File" />
<Button label="Send file CSV" title="Select" on:click={() => {uploadFile(file)}}/>