<script lang="ts">
  import CameraControls from '../CameraControls';
  import type CC from 'camera-controls';
  import type { ColorRepresentation } from 'three';
  import { Mesh, PerspectiveCamera } from 'three';
  import { T } from '@threlte/core';
  import { useTask, useThrelte } from '@threlte/core';
  import Chart from './Chart.svelte';
  import { Gizmo, OrbitControls } from '@threlte/extras';

  let {
    color = '#6aff00',
    controls = $bindable(),
    mesh = $bindable()
  }: {
    color?: ColorRepresentation
    controls: CC | undefined
    mesh?: Mesh
  } = $props();

  const { dom, invalidate } = useThrelte();

  const camera = new PerspectiveCamera();
  controls = new CameraControls(dom, camera);
  let center: [number, number, number] = $state([0, 0, 0]);

  $effect(() => {
    return () => {
      controls.dispose()
    }
  });

  controls.setPosition(10, 5, 10);

  useTask(
    (delta) => {
      if (controls.update(delta)) {
        invalidate()
      }
    },
    { autoInvalidate: false }
  );
</script>

<T.Mesh
  oncreate={(ref) => {
    mesh = ref
  }}
  position.y={0.5}
>
  <T.BoxGeometry />
  <T.MeshBasicMaterial {color} wireframe />
</T.Mesh>

<T is={camera} makeDefault position={[10, 5, 10]} fov={36}>
  <OrbitControls
    onchange={(event) => {
      center = event.target.target.toArray()
    }}
  >
    <Gizmo
      type="sphere"
      placement="bottom-left"
      size={86}
      speed={1}
      offset={{ top: 10, left: 10, bottom: 10, right: 10 }}
    />
  </OrbitControls>
</T>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight castShadow position={[5, 10, 5]} intensity={1} />

<Chart />
