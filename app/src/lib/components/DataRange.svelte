<script lang="ts">
    import { Button, Pane, Text } from 'svelte-tweakpane-ui';

    let minVal = "0";
    let maxVal = "0";
</script>

<Text label="Valore Min" bind:value={minVal} />
<Text label="Valore Max" bind:value={maxVal} />


  