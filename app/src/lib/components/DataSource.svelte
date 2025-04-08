<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';
	import { fetchDb, fetchExternal } from '$lib/index.svelte';
	let { resetTarget } = $props();
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

<Button label="File CSV" title="Select" />
