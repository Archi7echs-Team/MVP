<script lang="ts">
    import {IntervalSlider, Button} from 'svelte-tweakpane-ui';
    let {valMin, valMax, mediaFilter=$bindable(), rangeValue = $bindable([valMin, valMax] as [number, number]) } = $props(); 

    //impostare mediaFilter a valori sotto alla media
    function setFilterToLower() {
      mediaFilter = 1;
    }

    //impostare mediaFilter a valori sopra alla media   
    function setFilterToHigher() {
      mediaFilter = 2;
    }
    let value : any= $state([0, 10]);
    $effect(() => {
      rangeValue = value;
    });
</script>

<IntervalSlider
  bind:value
  min={valMin}
  max={valMax}
  label="Visualization interval"
  format={(v) => `${v.toFixed(0)}`}
/>

<Button 
  on:click={setFilterToLower}
  label="Values lower than the global average"
  title="Filter"
/>

<Button 
  on:click={setFilterToHigher}
  label="Values higher than the global average" 
  title="Filter"
/>

<Button 
  on:click={() => {mediaFilter = 0, value = [valMin, valMax]}}
  label="Visualization reset" 
  title="Reset"
/>
