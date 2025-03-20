<script lang="ts">
    import { Button, Pane, IntervalSlider, Text } from 'svelte-tweakpane-ui';
    let {value} = $props();

</script>

<IntervalSlider
  bind:value
  min={0}
  max={100}
  format={(v) => `${v.toFixed(0)}`}
/>
<Text bind:value={value[0]} label="Min" />
<Text bind:value={value[1]} label="Max" />
