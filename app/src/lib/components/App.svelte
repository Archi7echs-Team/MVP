<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import SettingsPane from './SettingsPane.svelte';

  let value = $state([0, 100]);
  let data = [
    [2, 3, 5, 2, 2],
    [1, 4, 6, 3, 1],
    [2, 5, 7, 4, 8],
    [3, 2, 4, 1, 5],
    [1, 3, 2, 6, 4]
  ];



</script>

<div>
  <Canvas>
    <SettingsPane {value}/>
    <Scene {data} {value}/>
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