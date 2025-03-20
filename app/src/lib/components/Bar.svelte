<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  import { Raycaster, Vector2 } from 'three';
	import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import * as THREE from 'three';

  let { coordinates, height, currentCameraQuaternionArray, minVal, maxVal } = $props();
  
  const { scene } = useThrelte();

  //raycaster e variabili per il mouse
  const raycaster = new Raycaster();

  
  let opacity = $state((height >= minVal && height <= maxVal) ? 1 : 0.2);

  $effect(() => {
    opacity = (height >= minVal && height <= maxVal) ? 1 : 0.2;
  });

  //riferimento al mesh della barra
  let mesh = $state<THREE.Mesh | undefined>(undefined);
  let hover = new Tween(0, {
    duration: 100,
    easing: cubicOut
  });

  interactivity()
  
  const isFirstIntersected = (hits: THREE.Intersection[]) => {
    if (hits.length > 0 && hits[0].object === mesh) {
      return 1;
    }
    return 0;
  }

</script>

<T.Mesh
  bind:ref={mesh}
  onpointermove={(e: any) => {
    raycaster.setFromCamera(e.pointer, e.camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    hover.target = isFirstIntersected(intersects);
  }}
  onpointerleave={() => {
    hover.target = 0;
  }}
  position={coordinates as [number, number, number]}
  scale={[1, height, 1]}
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial 
    color={`hsl(${((coordinates[2] + 360) * 30) % 360}, 80%, 60%)`} 
    transparent={true} 
    opacity={opacity} 
  />
</T.Mesh>

<Text
  position={[coordinates[0], height + 0.25, coordinates[2]]}
  text={height.toFixed(2)}
  color="black"
  anchorX="center"
  anchorY="middle"
  quaternion={currentCameraQuaternionArray}
  fontSize={0.2}
  fillOpacity={hover.current}
  />

