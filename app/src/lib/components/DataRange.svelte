<script lang="ts">
    import { Button, Pane, IntervalSlider } from 'svelte-tweakpane-ui';
    let {value} = $props();
</script>

<IntervalSlider
  bind:value
  min={0}
  max={100}
  format={(v) => `${v.toFixed(0)}%`}
/>

<p>{value}</p>


  