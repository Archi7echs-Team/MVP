<script lang="ts">
	import { IntervalSlider, Button, Checkbox, Slider } from 'svelte-tweakpane-ui';
	import { filter, createUtils, getLength, resetFilter } from '$lib/index.svelte';

	const utils = $derived(createUtils());
	let length = $derived(getLength());

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

<Slider
	bind:value={filter.nValuemin}
	min={0}
	max={length}
	step={1}
	label="Hide the N highest values"
/>

<Slider
	bind:value={filter.nValuemax}
	min={0}
	max={length}
	step={1}
	label="Hide the N lowest values"
/>

<Button
	on:click={resetFilter}
	label="Visualization reset"
	title="Reset"
/>
