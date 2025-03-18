<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import SettingsPane from './SettingsPane.svelte';
</script>

<div>
  <Canvas>
    <SettingsPane />
    <Scene />
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