<script lang="ts">
    import { List, type ListOptions } from 'svelte-tweakpane-ui'
    let { colorSelection=$bindable()} = $props();
    const options: ListOptions<number> = {
      "righe": 1,
      "colonne": 2,
      "valori": 3,
    }
  </script>
  
  <List bind:value={colorSelection} label="Color type" {options} />
  <pre>Selected Option: {colorSelection}</pre>