<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import { Checkbox, Button, Pane, Slider } from 'svelte-tweakpane-ui';
  import type CC from 'camera-controls';

  let controls = $state<CC>();
  let zoomValue = $state(5);
</script>

<Pane title="3D Dataviz" position="fixed">
  <Button
    label="Resetta"
    title="Reset"
    on:click={() => {
      controls?.reset(true)
      controls?.setPosition(10, 5, 10)
    }}
  />
  
  <Button
    label="Zoom In"
    title="+"
    on:click={() => {
      controls?.dolly(5, true)
      // controls?.zoom(controls.camera.zoom / 2, true)
    }}
  />
  
  <Button
    label="Zoom Out"
    title="-"
    on:click={() => {
      controls?.dolly(-5, true)
      // controls?.zoom(-controls.camera.zoom / 2, true)
    }}
  />
  
  <Slider
    bind:value={zoomValue}
    label="Zoom"
    min={1}
    max={10}
    step={1}
    on:change={() => {
      console.log("Zoom", zoomValue)
    }}
  />
</Pane>

<Canvas>
  <Scene bind:controls />
</Canvas>
