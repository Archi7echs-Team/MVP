<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import Bar from './Bar.svelte';
  import { onMount, onDestroy } from 'svelte';
	import { label } from 'three/tsl';
  const { camera, renderer, scene } = useThrelte();
  let currentCameraQuaternionArray = $state<[number, number, number, number]>([0, 0, 0, 1]);
  let animationFrameId: number;

  let selectedBar:any = $state(null);

  let { data = [
    [2, 3, 5, 2, 2],
    [1, 4, 6, 3, 1],
    [2, 5, 7, 4, 8],
    [3, 2, 4, 1, 5],
    [1, 3, 2, 6, 4]
  ], rangeValue, spacing, colorSelection, media, mediaFilter, controlTarget, avgEnabled, barFilterSelection, displayBarFilter = $bindable(), barValue = $bindable() } = $props(); 

  let max = Math.max(...data.flat()) || 1; // Normalize heights

  let rows = data.length;
  let cols = data[0].length;

  onMount(() => {
    const update = () => {
      if (camera?.current) {
        currentCameraQuaternionArray = camera.current.quaternion.toArray();
      }
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    //listener per il movimento del mouse
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrameId);
  });
  
  //funzione per troncare il testo se troppo lungo
  function truncateText(text: string, maxLength: number = 20) {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  //Funzione per calcolare la media
  function calculateAverage(data: number[][]): number {
    const flattened = data.flat(); // Converte la matrice in un array singolo
    const sum = flattened.reduce((acc, val) => acc + val, 0); // Somma tutti i valori
    return sum / flattened.length; // Calcola la media
  }
  let average = calculateAverage(data);
  console.log("Valore medio:", average);


  function handleBarClick() {
    displayBarFilter = true;
    console.log("Bar clicked with value: ", barValue);  
  }

  </script>
  
  <T.Group>

    <!-- Grid Plane (Under the Bars) -->
    <T.Mesh position={[rows*spacing/2 - spacing/2, 0 , cols*spacing/2 - spacing/2]}  rotation={[-Math.PI / 2, 0, 0]}>
      <T.PlaneGeometry args={[cols * spacing, rows * spacing]} />
      <T.MeshStandardMaterial color="gray" />
    </T.Mesh>

    <!-- Creazione piano medio se selezionato -->
    {#if avgEnabled}
      <T.Mesh position={[rows*spacing/2 - spacing/2, average , cols*spacing/2 - spacing/2]}  rotation={[-Math.PI / 2, 0, 0]}>
        <T.PlaneGeometry args={[cols * spacing, rows * spacing]} />
        <T.MeshStandardMaterial color="lightgray" />
      </T.Mesh>
    {/if}

    <!-- Etichette delle righe -->
    {#each data[0] as _, rowIndex}
      <Text 
        position={[rowIndex * spacing, 0.2, -spacing]} 
        text={truncateText(`Row ${rowIndex + 1}`, 13)}
        fontSize={0.5} 
        color="white"
        rotation={[-Math.PI / 2, 0, Math.PI / 2]} 
      />
    {/each}

    <!-- Etichette delle colonne -->
    {#each data as _, colIndex}
      <Text 
        position={[cols * spacing, 0.2, colIndex * spacing]} 
        text={truncateText(`Col ${colIndex + 1}`, 13)}
        fontSize={0.5} 
        color="white"
        rotation={[-Math.PI / 2, 0, 0 ]} 
      />
    {/each}

    <!-- 3D Bars -->
    {#each data as row, rowIndex}
      {#each row as height, colIndex}
        console.log("abc");
        <Bar 
          coordinates={[
            rowIndex * spacing, // X
            height / 2, // Y
            colIndex * spacing // Z
          ]} 
          {height} 
          {currentCameraQuaternionArray}
          minVal={rangeValue[0]}
          maxVal={rangeValue[1]}  
          colorSelection={colorSelection}
          media={media}
          mediaFilter={mediaFilter}
          onBarClick={handleBarClick}
          barFilterSelection={barFilterSelection}
          bind:displayBarFilter = {displayBarFilter}
          bind:barValue = {barValue}
        />
      {/each}
    {/each}
  </T.Group>
  
