<script lang="ts">
	import { List, type ListOptions } from 'svelte-tweakpane-ui';
	import { filter } from '$lib/index.svelte';

	const options: ListOptions<number> = {
		columns: 1,
		rows: 2,
		values: 3
	};
</script>

<List bind:value={filter.colorSelection} label="Color type" {options} />
<pre>Selected Option: {filter.colorSelection}</pre>
