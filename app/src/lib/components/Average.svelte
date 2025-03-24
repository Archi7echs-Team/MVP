<script lang="ts">
      import { Button, Pane, ThemeUtils,Checkbox  } from 'svelte-tweakpane-ui';
      let { avgEnabled = $bindable() } = $props();
</script>
  
<Checkbox bind:value={avgEnabled} label="Show average plane" />
