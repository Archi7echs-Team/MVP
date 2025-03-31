<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { Button } from 'svelte-tweakpane-ui';
	import { Vector3 } from 'three';
	import { getData } from '$lib/index.svelte';

	let utils = $derived(getData().computed);

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

<Button label="Resetta" title="Reset" on:click={resetPosition} />

<Button label="Zoom In" title="+" on:click={zoomIn} />

<Button label="Zoom Out" title="-" on:click={zoomOut} />
