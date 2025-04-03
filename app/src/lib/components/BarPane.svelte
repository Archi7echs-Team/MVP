<script lang="ts">
	import { Pane, Button, Text, Separator, Folder } from 'svelte-tweakpane-ui';
	import { filter, getSelectedBarInfo } from '$lib/index.svelte';

	let selectedBarInfo = $derived(getSelectedBarInfo());
</script>

{#if filter.displayBarFilter}
	<Pane title="Selection info & filter" y={210} x={120} position="fixed">
		<Folder title="Info">
			<Text value={selectedBarInfo ? `${selectedBarInfo.row}` : "-"}  label="Row" disabled={true} />
			<Text value={selectedBarInfo ? `${selectedBarInfo.column}` : "-"} label="Column" disabled={true} />
			<Text value={selectedBarInfo ? `${selectedBarInfo.height.toFixed(2)}` : "-"} label="Height" disabled={true} />
		</Folder>

		<Folder title="Filter">
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
			}}
			label="Filter reset"
			title="Reset"
		/>
		</Folder>
		
		<Separator />

		<Button
		on:click={() => {
			filter.displayBarFilter = false;
		}}
		label="Close pane"
		title="Close"
	/>
	</Pane>
{/if}