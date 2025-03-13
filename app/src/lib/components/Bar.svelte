<script lang="ts">
  import { T } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  
  let {coordinates, height} = $props();
  let over = $state(false);

  let textPosition = [0, coordinates[1] + height + 1, 0];

  interactivity();

</script>

<T.Mesh 
position={coordinates as [number, number, number]} 
scale={[1, height, 1]} 
raycastFirst={true}
onpointerover={(e: PointerEvent) => { over = true; e.stopPropagation(); }}  
onpointerout={(e: PointerEvent) => { over = false; e.stopPropagation(); }}
>
<T.BoxGeometry args={[1, 1, 1]} />
<T.MeshStandardMaterial color={`hsl(${((coordinates[2] + 360) * 30) % 360}, 80%, 60%)`} />
</T.Mesh>

{#if over}
  <Text 
  position={[coordinates[0], height + 0.25,  coordinates[2]]}   
  text={height.toFixed(2)} 
    color="black" 
    anchorX="center" 
    anchorY="middle" 
  />
{/if}




