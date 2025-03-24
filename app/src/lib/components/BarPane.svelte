<script lang="ts">
    import { Pane, Button } from 'svelte-tweakpane-ui';

    let {displayBarFilter, barFilterSelection = $bindable()} = $props();
</script>

{#if displayBarFilter}

  <Pane title="Selection filter" y={210} x={120} position="fixed">
    
    <Button 
        on:click={() => {barFilterSelection=1} }
        label="Only selected bar"
        title="Display"
    />
  
    <Button 
        on:click={() => {barFilterSelection=2} }
        label="Values higher than the selected bar value" 
        title="Filter"

    />    
  
    <Button 
        on:click={() => {barFilterSelection=3} }
        label="Values ​​lower than the selected bar value"
        title="Filter"
    />

    <Button 
        on:click={() => {barFilterSelection=0} }
        label="Filter reset"
        title="Reset"
    />
  </Pane>
{/if}