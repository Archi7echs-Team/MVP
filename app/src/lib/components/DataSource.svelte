<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';
	import { fetchDb, fetchExternal } from '$lib/index.svelte';
</script>

<Button label="External API" title="Select" on:click={fetchExternal}/>

<Button label="DB1" title="Select" on:click={fetchDb}/>

<Button label="File CSV" title="Select" />
