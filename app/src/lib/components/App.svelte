<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import { Checkbox, Button, Pane, Slider } from 'svelte-tweakpane-ui';
	import ZoomControl from './ZoomControl.svelte';
	import { HTML } from '@threlte/extras';
</script>

<Canvas>
  <ZoomControl />
  <Scene />
</Canvas>
