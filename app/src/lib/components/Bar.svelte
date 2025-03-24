<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  import { Raycaster, Vector2 } from 'three';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import * as THREE from 'three';

  let { coordinates, height, currentCameraQuaternionArray, minVal, maxVal, colorSelection, media, mediaFilter, onBarClick, barFilterSelection, displayBarFilter = $bindable(), barValue = $bindable() } = $props();
  
  const { scene } = useThrelte();

  // Raycaster e variabili per il mouse
  const raycaster = new Raycaster();

  let selected = $state(false);

  // Opacità della barra
  let opacity = $state((height >= minVal && height <= maxVal) ? 1 : 0.2);

  // Controllo per opacizzazione
  $effect(() => {
    let inRange = height >= minVal && height <= maxVal;
    let passesFilter = true;

    // Controllo se filtro per media
    if (mediaFilter === 1 && height > media) {
      passesFilter = false;
    } else if (mediaFilter === 2 && height < media) {
      passesFilter = false;
    }

    if(barFilterSelection === 2 && height < barValue) {
      passesFilter = false;
    } else if(barFilterSelection === 3 && height > barValue) {
      passesFilter = false;
    }

    if(barFilterSelection === 1 && !selected){
      passesFilter = false;
    }

    if(barFilterSelection === 0){
      displayBarFilter = false;
      selected = false;
    }

    opacity = (inRange && passesFilter) ? 1 : 0.2;
  });

  // Riferimento al mesh della barra
  let mesh = $state<THREE.Mesh | undefined>(undefined);
  let hover = new Tween(0, {
    duration: 100,
    easing: cubicOut
  });

  interactivity();
  
  const isFirstIntersected = (hits: THREE.Intersection[]) => {
    if (hits.length > 0 && hits[0].object === mesh) {
      return 1;
    }
    return 0;
  };

  // Applicazione filtro colorazione
  function getBarColor() {
    if (colorSelection === 1) {
      return `hsl(${(coordinates[2] * 50) % 360}, 80%, 60%)`;
    } else if (colorSelection === 2) {
      return `hsl(${(coordinates[0] * 50) % 360}, 80%, 60%)`;
    } else if (colorSelection === 3) {
      let normalized = (height - minVal) / (maxVal - minVal || 1);
      let hue = 240 - (normalized * 240);
      return `hsl(${hue}, 80%, 50%)`;
    }
    return '#ffffff';
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
  onpointerdown={() => {
    if (onBarClick) {
      barValue = height;
      onBarClick({});
      selected = true;
    }
  }}
  position={coordinates as [number, number, number]}
  scale={[1, height, 1]}
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial 
    color={getBarColor()}
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