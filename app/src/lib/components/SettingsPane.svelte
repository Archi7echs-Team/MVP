<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage, Text, Button } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let {valMin, valMax, value = $bindable([valMin, valMax]) } = $props();

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
            <DataRange valMin={valMin} valMax={valMax} bind:value={value} />
        </TabPage>
    </TabGroup>
</Pane>
