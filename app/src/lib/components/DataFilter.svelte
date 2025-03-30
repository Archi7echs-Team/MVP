<script lang="ts">
	import { IntervalSlider, Button, Checkbox } from 'svelte-tweakpane-ui';
	import { filter, getData } from '$lib/index.svelte';

	let utils = getData().computed;

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
	title="Grater than average"
/>

<Button
	on:click={() => {
		filter.avgFilter = 0;
		filter.rangeValue.min = utils.min;
		filter.rangeValue.max = utils.max;
	}}
	label="Visualization reset"
	title="Reset"
/>
