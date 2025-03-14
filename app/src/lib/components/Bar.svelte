<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { interactivity, Text } from '@threlte/extras';
  import { onMount, onDestroy } from 'svelte';

  let {coordinates, height} = $props();
  let over = $state(false)
  let camQuat = $state<[number, number, number, number]>([0, 0, 0, 1]);
  let animationFrameId: number;
  const { camera } = useThrelte();

  onMount(() => {
    const update = () => {
      if (camera?.current) {
        camQuat = [
          camera.current.quaternion.x,
          camera.current.quaternion.y,
          camera.current.quaternion.z,
          camera.current.quaternion.w
        ];
      }
      animationFrameId = requestAnimationFrame(update);
    };
    update();
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrameId);
  });

  interactivity();

</script>

<T.Mesh 
position={coordinates as [number, number, number]} 
scale={[1, height, 1]} 
onpointerover={(e: PointerEvent) => { e.stopPropagation(); over = true; }}  
onpointerout={(e: PointerEvent) => { e.stopPropagation(); over = false;}}
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
    quaternion={camQuat}
  />
{/if} 