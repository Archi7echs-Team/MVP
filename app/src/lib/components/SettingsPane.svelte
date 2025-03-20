<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage, Text, Button } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  import Scene from './Scene.svelte';
  import Prova from './Prova.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let { value = $bindable([0, 100]) } = $props();

  $effect(() => {
    const a = value;
    console.log("Intervallo aggiornato:", value);
  });

  // func to print value
    function printValue() {
        console.log("Value:", value);
    }
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
            <DataRange bind:value={value} />
        </TabPage>
        <TabPage title="Dati">
            <Prova bind:value={value} />

        </TabPage>
    </TabGroup>
</Pane>
