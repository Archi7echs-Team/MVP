<script lang="ts">
    import { T } from '@threlte/core';
  
    export let position = [0, 0, 0];
    export let height = 1;
</script>
  
<T.Mesh position={position as [number, number, number]} scale={[1, height, 1]}>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial color={`hsl(${((position[2] + 360) * 30) % 360}, 80%, 60%)`} />
</T.Mesh>
