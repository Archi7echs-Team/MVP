<script lang="ts">
  import { useThrelte } from '@threlte/core';
	import { Button, Pane, ThemeUtils  } from 'svelte-tweakpane-ui';
	import { Vector3 } from 'three';

  let zoomValue = 5;
  const zoomStep = 2; // Quanto zoomare per ogni click
  const defaultPosition = new Vector3(10, 5, 10);

  const { camera } = useThrelte();

  function zoomIn() {
    zoomValue -= zoomStep;
    updateCamera(zoomStep);
  }

  function zoomOut() {
    zoomValue += zoomStep;
    updateCamera(-zoomStep);
  }

  function updateCamera(step: number) {
      if (camera?.current) {
        const direction = new Vector3();
          camera.current.getWorldDirection(direction); // Ottiene la direzione attuale della camera
          direction.multiplyScalar(step); // Scala il vettore di zoomStep
          camera.current.position.add(direction);
      }
  }

  function resetPosition() {
    if (camera?.current) {
      camera.current.position.copy(defaultPosition);
    }
  }
</script>

<Pane title="3D Dataviz" position="fixed" theme={ThemeUtils.presets.light}>
  <Button
    label="Resetta"
    title="Reset"
    on:click={resetPosition}
  />
  
  <Button
    label="Zoom In"
    title="+"
    on:click={zoomIn}
  />
  
  <Button
    label="Zoom Out"
    title="-"
    on:click={zoomOut}
  />
</Pane>