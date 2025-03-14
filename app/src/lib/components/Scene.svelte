<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls, Gizmo} from '@threlte/extras';
  import Chart from './Chart.svelte';
	import ZoomControl from './ZoomControl.svelte';
</script>

  <!-- Camera e controlli -->
  <T.PerspectiveCamera position={[0, 5, 10]} makeDefault>
    <OrbitControls enableDamping maxPolarAngle={1.55} />
  </T.PerspectiveCamera>
  
  <!-- Luci -->
  <T.AmbientLight intensity={0.5} />
  <T.DirectionalLight castShadow position={[5, 10, 5]} intensity={1} />
  
  <!-- Componente grafico -->
  <Chart />
  
  <!-- Zoom Control posizionato sopra la scena -->
  <ZoomControl />

  <!-- Gizmo -->
  <Gizmo />

