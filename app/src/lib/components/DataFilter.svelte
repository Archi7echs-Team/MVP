<script lang="ts">
	import { IntervalSlider, Button, Checkbox, Text } from 'svelte-tweakpane-ui';
	import { filter, fetchedData } from '$lib/index.svelte';
	import { Vector3 } from 'three';
	
	let data = $derived(fetchedData.values);
	
	const utils = $derived({
		average: data.flat().reduce((a, b) => a + b, 0) / data.flat().length,
		minmax: [Math.min(...data.flat()), Math.max(...data.flat())],
		max: Math.max(...data.flat()),
		min: Math.min(...data.flat()),
		rows: data.length,
		cols: data[0].length,
		defaultTarget: [
			(data.length * fetchedData.spacing) / 2 - fetchedData.spacing / 2,
			(Math.max(...data.flat()) - 1) / 2,
			(data[0].length * fetchedData.spacing) / 2 - fetchedData.spacing / 2
		],
		defaultPosition: new Vector3(15, 7.5, 15)
	});

	filter.rangeValue.min = utils.min;
	filter.rangeValue.max = utils.max;

</script>

<IntervalSlider
	bind:value={filter.rangeValue}
	min={utils.min}
	max={utils.max}
	label="Visualization interval"
	format={(v) => `${v.toFixed(0)}`}
/>

<Checkbox bind:value={filter.avgEnabled} label="Show average plane" />

<Button
	on:click={() => (filter.avgFilter = 1)}
	label="Values lower than the global average"
	title="Lower than average"
/>

<Button
	on:click={() => (filter.avgFilter = 2)}
	label="Values higher than the global average"
	title="Greater than average"
/>

<Text
	bind:value={filter.nValuemin}
	on:change={() => (filter.nValuemax = '0')}
	label="Show the n lowest value"
/>

<Text
	bind:value={filter.nValuemax}
	on:change={() => (filter.nValuemin = '0')}
	label="Show the n highest value"
/>

<Button
	on:click={() => {
		filter.avgFilter = 0;
		filter.rangeValue.min = utils.min;
		filter.rangeValue.max = utils.max;
		filter.nValuemin = '0';
		filter.nValuemax = '0';
	}}
	label="Visualization reset"
	title="Reset"
/>
