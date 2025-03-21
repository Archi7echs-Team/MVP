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

  //calcolo valore massimo e minimo per filtro range visualizzazione dati --> passaggio di valori a SettingsPane
  const valMin = Math.min(...data.flat());
  const valMax = Math.max(...data.flat());

  //calcolo media per filtro media --> passaggio di valori a SettingsPane
  const allValues = data.flat();
  const media = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

  //definizione di mediaFilter per capire se attivo filtro della media 
  let mediaFilter = 0;

  //definizione di limite inferiore superiore per passaggio di valori a SettingsPane
  let value: [number, number] = [valMin, valMax];
  let colorSelection: number = 2;

</script>

<div>
  <Canvas>
    <SettingsPane valMin={valMin} valMax={valMax} bind:mediaFilter={mediaFilter} bind:colorSelection={colorSelection} bind:value={value}/>
    <Scene {data} {value} {colorSelection} {media} {mediaFilter}/>
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