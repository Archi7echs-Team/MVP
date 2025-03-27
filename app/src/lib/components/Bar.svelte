<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  import { Raycaster, Vector2 } from 'three';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import * as THREE from 'three';
	import { select } from 'three/tsl';

  let { id, coordinates, height, currentCameraQuaternionArray, minVal, maxVal, colorSelection, media, mediaFilter, barFilterSelection, selection
  } = $props();
  
  const { scene } = useThrelte();

  // Raycaster e variabili per il mouse
  const raycaster = new Raycaster();

  // Opacità della barra
  let inRange = $derived(height >= minVal && height <= maxVal)

  let passesFilter = $derived.by(() => {
    let lv = selection.lastValue();
    if (mediaFilter === 1 && height > media) {
      return false;
    } else if (mediaFilter === 2 && height < media) {
      return false;
    }

    if(barFilterSelection === 2 && height < lv) {
      return false;
    } else if(barFilterSelection === 3 && height > lv) {
      return false;
    }

    if(barFilterSelection === 1 && !selection.check(id)){
      return false;
    }
    return true;
  })

  // Controllo per opacizzazione
  let opacity = $derived((inRange && passesFilter) ? 1 : 0.2)


  // Riferimento al mesh della barra
  let mesh = $state<THREE.Mesh | undefined>(undefined);
  let text = $state<any>(undefined);
    
  let hover = new Tween(0, {
    duration: 100,
    easing: cubicOut
  });

  interactivity();
  
  const isFirstIntersected = (e: any) => {
    raycaster.setFromCamera(e.pointer, e.camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.length > 0 && hits[0].object === mesh
  };

  const isFirstTextIntersected = (e: any) => {
    raycaster.setFromCamera(e.pointer, e.camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.length > 0 && hits[0].object === text
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
    hover.target = isFirstIntersected(e) ? 1 : 0;
  }}

  onpointerleave={() => {
    hover.target = 0;
  }}

  onclick={(e: any) => {
    if (isFirstIntersected(e)) {
      if (e.nativeEvent.detail === 1) {
        selection.toggle(id);
      }
      else {
        selection.set([id]);
      }
    };
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
  bind:ref={text}
  onclick={(e: any) => {
    if (isFirstTextIntersected(e)) {
      if (e.nativeEvent.detail === 1) {
        selection.toggle(id);
      }
      else {
        selection.set([id]);
      }
    };
  }}
/>