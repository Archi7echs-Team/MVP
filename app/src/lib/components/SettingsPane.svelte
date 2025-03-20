<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage, Text } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  import Scene from './Scene.svelte';
  import Prova from './Prova.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let { value = $bindable<[number, number]>([0, 100]) } = $props();

  $effect(() => {
    console.log("Intervallo aggiornato:", value);
  });

</script>


<Pane title="Settings" position="fixed">
    <TabGroup>
        <TabPage title="Camera options">
            <CameraSettings />
        </TabPage>
        <TabPage title="Data source">
            <DataSource />
        </TabPage>
        <TabPage title="Data range">
            <DataRange {value} />
        </TabPage>
        <TabPage title="Dati">
            <Prova {value} />
        </TabPage>
    </TabGroup>
</Pane>

<Scene {value} />