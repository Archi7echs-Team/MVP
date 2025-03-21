<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls, Gizmo} from '@threlte/extras';
  import Chart from './Chart.svelte';
  let autoRotate = false;
  // define function control target to target the camera to the center of the chart
  let target = $state<[number, number, number]>([0, 0, 0]);
  let controlTarget = (newTarget: [number, number, number]) => {
    target = newTarget;
  }
  let { value, data, colorSelection } = $props();
</script>

  <!-- Camera e controlli -->
  <T.PerspectiveCamera position={[15, 7.5, 15]} makeDefault>
    <OrbitControls enableDamping maxPolarAngle={1.55} {autoRotate} {target}>
      <Gizmo />
    </OrbitControls>
  </T.PerspectiveCamera>
  
  <!-- Luci -->
  <T.AmbientLight intensity={0.5} />
  <T.DirectionalLight castShadow position={[5, 10, 5]} intensity={1} />
  <T.DirectionalLight castShadow position={[-5, 10, 5]} intensity={1} />
  
  <!-- Componente grafico -->
  <Chart {data} {value} {controlTarget} {colorSelection}/>
  


