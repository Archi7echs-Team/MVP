<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls, Gizmo} from '@threlte/extras';
  import Chart from './Chart.svelte';
</script>

  <!-- Camera e controlli -->
  <T.PerspectiveCamera position={[10, 5, 10]} makeDefault>
    <OrbitControls enableDamping maxPolarAngle={1.55} >
    <Gizmo />
    </OrbitControls>
  </T.PerspectiveCamera>
  
  <!-- Luci -->
  <T.AmbientLight intensity={0.5} />
  <T.DirectionalLight castShadow position={[5, 10, 5]} intensity={1} />
  
  <!-- Componente grafico -->
  <Chart />
  


