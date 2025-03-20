<script lang="ts">
    import { Button, Pane, IntervalSlider } from 'svelte-tweakpane-ui';
    let {valMin, valMax, value = $bindable([valMin, valMax]) } = $props();

</script>

<IntervalSlider
  bind:value={value}
  min={valMin}
  max={valMax}
  format={(v) => `${v.toFixed(0)}`}
/>
