<script lang="ts">
    import {IntervalSlider} from 'svelte-tweakpane-ui';
    let {valMin, valMax, value = $bindable([valMin, valMax] as [number, number]) } = $props(); 
</script>

<IntervalSlider
  bind:value={value}
  min={valMin}
  max={valMax}
  label="Visualization interval"
  format={(v) => `${v.toFixed(0)}`}
/>
