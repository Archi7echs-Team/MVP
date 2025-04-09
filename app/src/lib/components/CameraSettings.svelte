<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { Button } from 'svelte-tweakpane-ui';
	import { Vector3 } from 'three';
	import { fetchedData, cameraUtils } from '$lib/index.svelte';

	let data = $derived(fetchedData.values);
	
	const utils = $derived({
		average: data.flat().reduce((a, b) => a + b, 0) / data.flat().length,
		minmax: [Math.min(...data.flat()), Math.max(...data.flat())],
		max: Math.max(...data.flat()),
		min: Math.min(...data.flat()),
		rows: data.length,
		cols: data[0].length,
		defaultTarget: [
			(data.length * fetchedData.spacing) / 2 - fetchedData.spacing / 2,
			(Math.max(...data.flat()) - 1) / 2,
			(data[0].length * fetchedData.spacing) / 2 - fetchedData.spacing / 2
		],
		defaultPosition: new Vector3(15, 10, 15)
	});

	let zoomValue = 5;
	const zoomStep = 2; // Quanto zoomare per ogni click
	let { resetTarget } = $props();
	const { camera } = useThrelte();

	function zoomIn() {
		zoomValue -= zoomStep;
		updateCamera(zoomStep);
	}

	function zoomOut() {
		zoomValue += zoomStep;
		updateCamera(-zoomStep);
	}

	function updateCamera(step: number) {
		if (camera?.current) {
			const direction = new Vector3();
			camera.current.getWorldDirection(direction); // Ottiene la direzione attuale della camera
			direction.multiplyScalar(step); // Scala il vettore di zoomStep
			camera.current.position.add(direction);
		}
	}

	function resetPosition() {
		if (camera?.current) {
			camera.current.position.copy(utils.defaultPosition);
			resetTarget();
		}
	}
</script>

<Button label="Reset" title="Reset position" on:click={() => cameraUtils.resetCamera(camera, resetTarget)} />

<Button label="Zoom In" title="+" on:click={() => cameraUtils.zoomIn(camera)} />

<Button label="Zoom Out" title="-" on:click={() => cameraUtils.zoomOut(camera)} />