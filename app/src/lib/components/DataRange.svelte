<script lang="ts">
    import { Button, Pane, Text } from 'svelte-tweakpane-ui';
    import { writable } from 'svelte/store';

    export let minVal = writable("0");
    export let maxVal = writable("100");
</script>

<Text label="Valore Min" bind:value={$minVal} />
<Text label="Valore Max" bind:value={$maxVal} />


  