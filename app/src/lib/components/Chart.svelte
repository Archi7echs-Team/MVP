<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
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
  ], rangeValue, spacing, colorSelection, media, mediaFilter, barFilterSelection, displayBarFilter = $bindable(), barValue = $bindable() } = $props(); 


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
          bind:barValue = {barValue}
        />
      {/each}
    {/each}
  </T.Group>
  
