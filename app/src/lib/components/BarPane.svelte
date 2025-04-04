<script lang="ts">
	import { Pane, Button, Text, Separator, Folder, Slider } from 'svelte-tweakpane-ui';
	import { filter, getData, getSelectedBarInfo } from '$lib/index.svelte';

	let selectedBarInfo = $derived(getSelectedBarInfo());
	let data = $derived(getData());
</script>

{#if filter.displayBarFilter}
	<Pane title="Selection info & filter" y={210} x={120} position="fixed">
		<Folder title="Info">
			<Text value={selectedBarInfo ? `${selectedBarInfo.row}` : "-"}  label="Row" disabled={true} />
			<Text value={selectedBarInfo ? `${selectedBarInfo.column}` : "-"} label="Column" disabled={true} />
			<Text value={selectedBarInfo ? `${selectedBarInfo.height.toFixed(2)}` : "-"} label="Height" disabled={true} />
			<Text value={selectedBarInfo ? `${data.computed.averageRows[selectedBarInfo.row - 1]?.toFixed(2)}` : "-"} label="Avg X (row)" disabled={true} />
			<Text value={selectedBarInfo ? `${data.computed.averageCols[selectedBarInfo.column - 1]?.toFixed(2)}` : "-"} label="Avg Z (column)" disabled={true} />
			<Text value={`${data.computed.average?.toFixed(2) || "-"}`} label="Avg Global" disabled={true} />
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

		<Slider label="Selected opacity" min={10} max={100} step={1} bind:value={filter.selectedOpacity} format={(v) => `${v}%`} />

	   <Button
	   on:click={() => {
		   filter.selection.clear();
	   }}
	   label="Reset selection"
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