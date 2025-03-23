<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import SettingsPane from './SettingsPane.svelte';

  
  let data = [
    [2, 3, 5, 2, 2],
    [1, 4, 6, 3, 1],
    [2, 5, 7, 4, 8],
    [3, 2, 4, 1, 5],
    [1, 3, 2, 6, 4]
  ];

  const valMin = Math.min(...data.flat());
  const valMax = Math.max(...data.flat());

  let value: [number, number] = [valMin, valMax];
  let colorSelection: number = 2;
  
  let avgEnabled = false;

</script>

<div>
  <Canvas>
    <SettingsPane valMin={valMin} valMax={valMax} bind:colorSelection={colorSelection} bind:value={value} bind:avgEnabled={avgEnabled}/>
    <Scene {data} {value} {colorSelection} {avgEnabled}/>
  </Canvas>
</div>


<style>
  div {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: rgb(14, 22, 37);
  }
</style>