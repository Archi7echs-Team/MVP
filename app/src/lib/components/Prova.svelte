<script lang="ts">
    import { Text } from 'svelte-tweakpane-ui';
    let { value = $bindable<[number, number]>([0, 100]) } = $props();

</script>

<Text bind:value={value[0]} label="Min" />
<Text bind:value={value[1]} label="Max" />
