<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import Bar from './Bar.svelte';
	import { onMount, onDestroy } from 'svelte';
	const { camera } = useThrelte();
	import { filter, getData, getSelectedBarInfo, truncateText } from '$lib/index.svelte';

	let currentCameraQuaternionArray = $state<[number, number, number, number]>([0, 0, 0, 1]);
	let animationFrameId: number;

	let dt = $derived(getData());

	let data = $derived(dt.values);
	let utils = $derived(dt.computed);
	let rows = $derived(utils.rows);
	let cols = $derived(utils.cols);
	let spacing = $derived(filter.spacing);

	let selectedBarInfo = $derived(getSelectedBarInfo());

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
</script>

<T.Group>
	<!-- Grid Plane (Under the Bars) -->
	<T.Mesh
		position={[(rows * spacing) / 2 - spacing / 2, 0, (cols * spacing) / 2 - spacing / 2]}
		rotation={[-Math.PI / 2, 0, 0]}
	>
		<T.PlaneGeometry args={[cols * spacing, rows * spacing]} />
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
			<T.PlaneGeometry args={[cols * spacing, rows * spacing]} />
			<T.MeshStandardMaterial color="lightgray" transparent={true} opacity={0.5} />
		</T.Mesh>
	{/if}

	<!-- Piano medio della riga selezionata -->
    {#if filter.showRowAvgPlane && selectedBarInfo}
    <T.Mesh
	    position={[
		    (selectedBarInfo.row - 1) * spacing, // posizione X centrata sulla riga
		    utils.averageRows[selectedBarInfo.row - 1],
		    (cols * spacing) / 2 - spacing / 2 // posizione Z centrata sulla griglia
	    ]}
	    rotation={[-Math.PI / 2, 0, 0]}
    >
	    <T.PlaneGeometry args={[spacing, cols * spacing]} />
	    <T.MeshStandardMaterial color="#ff9999" transparent={true} opacity={0.5} />
    </T.Mesh>
    {/if}

    <!-- Piano medio della colonna selezionata -->
    {#if filter.showColAvgPlane && selectedBarInfo}
    <T.Mesh
        position={[
            (rows * spacing) / 2 - spacing / 2, // posizione X centrata sulla griglia
		    utils.averageCols[selectedBarInfo.column - 1],
		    (selectedBarInfo.column - 1) * spacing // posizione Z centrata sulla colonna
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
    >
        <T.PlaneGeometry args={[rows * spacing, spacing]} />
        <T.MeshStandardMaterial color="#9999ff" transparent={true} opacity={0.5} />
    </T.Mesh>
    {/if}

	<!-- Etichette delle righe -->
	{#each data[0] as _, rowIndex}
		<Text
			position={[rowIndex * spacing - 0.4, 0.2, -spacing]}
			text={truncateText(`Row ${rowIndex + 1}`, 13)}
			fontSize={0.5}
			color="white"
			rotation={[-Math.PI / 2, 0, Math.PI / 2]}
		/>
	{/each}

	<!-- Etichette delle colonne -->
	{#each data as _, colIndex}
		<Text
			position={[cols * spacing, 0.2, colIndex * spacing - 0.4]}
			text={truncateText(`Col ${colIndex + 1}`, 13)}
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