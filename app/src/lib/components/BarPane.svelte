<script lang="ts">
	import { Pane, Button, Text, Separator, Folder, Slider, Checkbox } from 'svelte-tweakpane-ui';
	import {
		filter,
		fetchedData,
		getSelectedBarInfo,
		setBarFilterSelection,
		resetBarSelection,
		hideBarFilterPane
	} from '$lib/index.svelte';

	let selectedBarInfo = $derived(getSelectedBarInfo());
	let data = $derived(fetchedData.values);

	const utils = $derived({
		average: data.flat().reduce((a, b) => a + b, 0) / data.flat().length,
		averageRows: data.map((row) => row.reduce((a, b) => a + b, 0) / row.length),
		averageCols: Array.from(
			{ length: data[0].length },
			(_, colIndex) => data.map((row) => row[colIndex]).reduce((a, b) => a + b, 0) / data.length
		),
		minmax: [Math.min(...data.flat()), Math.max(...data.flat())],
		max: Math.max(...data.flat()),
		min: Math.min(...data.flat()),
		rows: data.length,
		cols: data[0].length,
		defaultTarget: [
			(data.length * fetchedData.spacing) / 2 - fetchedData.spacing / 2,
			(Math.max(...data.flat()) - 1) / 2,
			(data[0].length * fetchedData.spacing) / 2 - fetchedData.spacing / 2
		]
	});
</script>

{#if filter.displayBarFilter}
	<Pane title="Selection info & filter" y={210} x={120} position="fixed">
		<Folder title="Info">
			<Text value={selectedBarInfo ? `${selectedBarInfo.row}` : '-'} label="Row" disabled={true} />
			<Text
				value={selectedBarInfo ? `${selectedBarInfo.column}` : '-'}
				label="Column"
				disabled={true}
			/>
			<Text
				value={selectedBarInfo ? `${selectedBarInfo.height.toFixed(2)}` : '-'}
				label="Height"
				disabled={true}
			/>
			<Text
				value={selectedBarInfo ? `${utils.averageRows[selectedBarInfo.row - 1]?.toFixed(2)}` : '-'}
				label="Avg X (row)"
				disabled={true}
			/>
			<Text
				value={selectedBarInfo
					? `${utils.averageCols[selectedBarInfo.column - 1]?.toFixed(2)}`
					: '-'}
				label="Avg Z (column)"
				disabled={true}
			/>
			<Text value={`${utils.average.toFixed(2)}`} label="Avg Global" disabled={true} />
		</Folder>

		<Folder title="Filter">
			<Button on:click={() => setBarFilterSelection(1)} label="Only selected bar" title="Display" />

			<Button
				on:click={() => setBarFilterSelection(2)}
				label="Values higher than the selected bar value"
				title="Filter"
			/>

			<Button
				on:click={() => setBarFilterSelection(3)}
				label="Values lower than the selected bar value"
				title="Filter"
			/>

			<Button on:click={() => setBarFilterSelection(0)} label="Filter reset" title="Reset" />

			<Checkbox bind:value={filter.showRowAvgPlane} label="Show average row plane" />

			<Checkbox bind:value={filter.showColAvgPlane} label="Show average column plane" />

			<Slider
				label="Selected opacity"
				min={10}
				max={100}
				step={1}
				bind:value={filter.selectedOpacity}
				format={(v) => `${v}%`}
			/>

			<Button on:click={() => resetBarSelection()} label="Reset selection" title="Reset" />
		</Folder>

		<Separator />

		<Button on:click={() => hideBarFilterPane()} label="Close pane" title="Close" />
	</Pane>
{/if}
