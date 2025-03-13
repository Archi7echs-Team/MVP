<script lang="ts">
    import { T } from '@threlte/core'
    import {interactivity,Text} from '@threlte/extras'
	import { writable } from 'svelte/store';
    export let coordinates = [0, 0, 0];
    export let height = 1;
    let over = writable(false)
    interactivity()
</script>
  
<T.Mesh position={coordinates as [number, number, number]} scale={[1, height, 1]} 
onpointerover={(e: PointerEvent) => {over.set(true); e.stopPropagation();}}  onpointerout={(e: PointerEvent) => {over.set(false); e.stopPropagation();}} >
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial color={`hsl(${((coordinates[2] + 360) * 30) % 360}, 80%, 60%)`} />
    {#if $over == true}
    <Text position.x={coordinates[0]} position.y={height + 0.25} position.z={coordinates[2]} text={height.toFixed(2)} color="black" anchorX="center" anchorY="middle"/>
    {/if}
</T.Mesh>
