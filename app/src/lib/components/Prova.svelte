<script lang="ts">
    import { Text } from 'svelte-tweakpane-ui';
    let { value } = $props(); 
</script>

<Text bind:value={value[0]} label="Min" />
<Text bind:value={value[1]} label="Max" />
