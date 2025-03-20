<script lang="ts">
    import {IntervalSlider, type IntervalSliderValue } from 'svelte-tweakpane-ui';
    let {valMin, valMax, value = $bindable([valMin, valMax]) } = $props();

 
</script>

<IntervalSlider
  bind:value={value}
  min={valMin}
  max={valMax}
  format={(v) => `${v.toFixed(0)}`}
/>
