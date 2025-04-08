<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import Bar from './Bar.svelte';
	import { onMount, onDestroy } from 'svelte';
	const { camera } = useThrelte();
	import { filter, fetchedData } from '$lib/index.svelte';
	import { Vector3 } from 'three';

	let currentCameraQuaternionArray = $state<[number, number, number, number]>([0, 0, 0, 1]);
	let animationFrameId: number;

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
		defaultPosition: new Vector3(15, 7.5, 15)
	});
	let zLabels = $derived(fetchedData.zLabels);
	let xLabels = $derived(fetchedData.xLabels);
	let rows = $derived(utils.rows);
	let cols = $derived(utils.cols);
	let spacing = $derived(filter.spacing);

	$effect(() => {
		filter.displayBarFilter = filter.selection.active();
	});

	onMount(() => {
		const update = () => {
			if (camera?.current) {
				currentCameraQuaternionArray = camera.current.quaternion.toArray();
			}
			animationFrameId = requestAnimationFrame(update);
		};
		update();
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
	});

	//funzione per troncare il testo se troppo lungo
	export function truncateText(text: string, maxLength: number = 20) {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	}
</script>

<T.Group>
	<!-- Grid Plane (Under the Bars) -->
	<T.Mesh
		position={[
			(rows * spacing) / 2 - spacing / 2,
			0,
			(cols * spacing) / 2 - spacing / 2
		 ]}
		rotation={[-Math.PI / 2, 0, 0]}
	>
		<T.PlaneGeometry args={[rows * spacing, cols * spacing]} />
		<T.MeshStandardMaterial color="gray" />
	</T.Mesh>

	<!-- Creazione piano medio se selezionato -->
	{#if filter.avgEnabled}
		<T.Mesh
			position={[
				(rows * spacing) / 2 - spacing / 2,
				utils.average,
				(cols * spacing) / 2 - spacing / 2
			]}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<T.PlaneGeometry args={[rows * spacing, cols * spacing]} />
			<T.MeshStandardMaterial color="lightgray" transparent={true} opacity={0.5} />
		</T.Mesh>
	{/if}

	<!-- Etichette delle righe -->
	{#each xLabels as xl, rowIndex}
		<Text
			position={[-spacing, 0.2, rowIndex * spacing + spacing/3]}
			text={truncateText(xl, 13)}
			fontSize={0.5}
			color="white"
			rotation={[-Math.PI / 2, 0, Math.PI / 2]}
		/>
	{/each}

	<!-- Etichette delle colonne -->
	{#each zLabels as zl, colIndex}
		<Text
			position={[colIndex * spacing - spacing/3, 0.2, cols * spacing]}
			text={truncateText(zl, 13)}
			fontSize={0.5}
			color="white"
			rotation={[-Math.PI / 2, 0, 0]}
		/>
	{/each}

	<!-- 3D Bars -->
	{#each data as row, rowIndex}
		{#each row as height, colIndex}
			<Bar
				id={`${rowIndex}-${colIndex}`}
				coordinates={[
					rowIndex * spacing, // X
					height / 2, // Y
					colIndex * spacing // Z
				]}
				{height}
				{currentCameraQuaternionArray}
			/>
		{/each}
	{/each}
</T.Group>
