<script>
    import { T } from '@threlte/core';
    import Bar from './Bar.svelte';
    import { Grid } from '@threlte/extras';

    // Example 2D grid of values
    export let data = [
      [2, 3, 5, 2, 2],
      [1, 4, 6, 3, 1],
      [2, 5, 7, 4, 8],
      [3, 2, 4, 1, 5],
      [1, 3, 2, 6, 4]
    ];
  
    let max = Math.max(...data.flat()) || 1; // Normalize heights
  
    let spacing = 1.2; // Space between bars
    let rows = data.length;
    let cols = data[0].length;
  </script>
  
  <T.Group>
    <!-- Grid Plane (Under the Bars) -->
    <T.Mesh position={[rows*spacing/2 - spacing/2, 0 , cols*spacing/2 - spacing/2]}  rotation={[-Math.PI / 2, 0, 0]}>
        <T.PlaneGeometry args={[cols * spacing, rows * spacing]} />
        <T.MeshStandardMaterial color="gray" />
      </T.Mesh>


    <!-- 3D Bars -->
    {#each data as row, rowIndex}
      {#each row as value, colIndex}
        <Bar 
          coordinates={[
            rowIndex * spacing, // X
            value / max * 2.5, // Y
            colIndex * spacing // Z
          ]} 
          height={value / max * 5} 
        />
      {/each}
    {/each}
  </T.Group>
  