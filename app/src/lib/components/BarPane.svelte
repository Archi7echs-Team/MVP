<script lang="ts">
	import { Pane, Button } from 'svelte-tweakpane-ui';
	import { filter } from '$lib/index.svelte';
</script>

{#if filter.displayBarFilter}
	<Pane title="Selection filter" y={210} x={120} position="fixed">
		<Button
			on:click={() => {
				filter.barFilterSelection = 1;
			}}
			label="Only selected bar"
			title="Display"
		/>

		<Button
			on:click={() => {
				filter.barFilterSelection = 2;
			}}
			label="Values higher than the selected bar value"
			title="Filter"
		/>

		<Button
			on:click={() => {
				filter.barFilterSelection = 3;
			}}
			label="Values lower than the selected bar value"
			title="Filter"
		/>

		<Button
			on:click={() => {
				filter.barFilterSelection = 0;
				filter.selection.clear();
			}}
			label="Filter reset"
			title="Reset"
		/>
	</Pane>
{/if}
