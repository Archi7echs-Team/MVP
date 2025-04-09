<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';
    import { useThrelte } from '@threlte/core';
    import { takeScreenshot } from '$lib/index.svelte';
    
    const { renderer, scene, camera } = useThrelte();

    function handleScreenshot() {
        takeScreenshot(renderer, scene, camera);
    }
</script>

<Button
    on:click={handleScreenshot}
	label="Export as image"
	title="Screenshot"
/>
