<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  import { onMount, onDestroy } from 'svelte';
  import { Raycaster, Vector2 } from 'three';
  import * as THREE from 'three';

  let { coordinates, height, currentCameraQuaternionArray } = $props();
  let over = $state(false);
  //let currentCameraQuaternionArray = $state<[number, number, number, number]>(new THREE.Quaternion().toArray());
  
  let animationFrameId: number;
  const { camera, renderer, scene } = useThrelte();

  //raycaster e variabili per il mouse
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  //riferimento al mesh della barra
  let mesh = $state<THREE.Mesh | undefined>(undefined);

    interactivity({
    filter: (hits, state) => {
      // Only return the first hit
      return hits.slice(0, 1)
    }
  })
  
  onMount(() => {
    //listener per il movimento del mouse
    renderer.domElement.addEventListener('pointermove', onPointerMove);
  });

  onDestroy(() => {
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
  });

  const onPointerMove = (event: PointerEvent) => {
    //calcola la posizione normalizzata del mouse (-1 a 1 per entrambi gli assi)
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    //raycaster con la posizione del mouse e la telecamera
    raycaster.setFromCamera(mouse, camera.current);

    //esegue il raycasting per trovare gli oggetti intersecati
    const intersects = raycaster.intersectObjects(scene.children, true);

    //controllo se l'oggetto corrente è il primo intersecato
    if (intersects.length > 0 && intersects[0].object === mesh) {
      over = true;
    } else {
      over = false;
    }
  };
</script>

<T.Mesh
  bind:ref={mesh}
  position={coordinates as [number, number, number]}
  scale={[1, height, 1]}
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color={`hsl(${((coordinates[2] + 360) * 30) % 360}, 80%, 60%)`} />
</T.Mesh>

{#if over}
  <Text
    position={[coordinates[0], height + 0.25, coordinates[2]]}
    text={height.toFixed(2)}
    color="black"
    anchorX="center"
    anchorY="middle"
    quaternion={currentCameraQuaternionArray}
    fontSize={0.2}
    />
{/if}