<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
	import ZoomControl from './ZoomControl.svelte';
</script>

<Canvas>
  <ZoomControl />
  <Scene />
</Canvas>
