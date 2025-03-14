<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import Chart from './Chart.svelte';
</script>

  <!-- Camera -->
  <T.PerspectiveCamera position={[0, 5, 10]} makeDefault >
    <OrbitControls enableDamping maxPolarAngle={1.55}/>
  </T.PerspectiveCamera>
  <!-- Lights -->
  <T.AmbientLight intensity={0.5} />
  <T.DirectionalLight castShadow position={[5, 10, 5]} intensity={1} />
  
  <Chart />
