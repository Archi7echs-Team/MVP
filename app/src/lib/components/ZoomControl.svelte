<script lang="ts">
    import { useThrelte } from '@threlte/core';

    let zoomValue = 5;
    const { camera } = useThrelte();

    $: if (camera?.current) {
      camera.current.position.z = zoomValue;
    }
  </script>
  
  <div class="zoom-control">
    <label for="zoom-slider">Zoom</label>
    <input
      id="zoom-slider"
      type="range"
      min="1"
      max="20"
      step="0.1"
      bind:value={zoomValue} />
    <span>{zoomValue}</span>
  </div>
  
  <style>
    .zoom-control {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.8);
      padding: 10px;
      border-radius: 5px;
      z-index: 1000; /* Assicura che sia visibile sopra la scena */
      font-family: sans-serif;
      color: #333;
    }
    
    label {
      margin-right: 5px;
    }
    
    input[type="range"] {
      vertical-align: middle;
    }
  </style>
  