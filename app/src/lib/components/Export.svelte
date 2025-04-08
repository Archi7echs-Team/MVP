<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';
    import { useThrelte } from '@threlte/core';
    const { renderer, scene, camera } = useThrelte();

    function takeScreenshot() {
        renderer.render(scene, camera.current);
        const dataUrl = renderer.domElement.toDataURL('image/png');
        downloadImage(dataUrl);
    }

    function downloadImage(dataUrl: string) {
		const link = document.createElement('a');
		link.download = `Screenshot_${new Date().toLocaleDateString()}.png`;
		link.href = dataUrl;
		link.click();
	}
</script>

<Button
    on:click={takeScreenshot}
	label="Export as image"
	title="Screenshot"
/>
