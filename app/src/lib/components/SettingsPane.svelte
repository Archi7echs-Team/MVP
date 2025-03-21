<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  import Color from './Color.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let { valMin, valMax, colorSelection=$bindable(), value = $bindable([valMin, valMax] as [number, number]) } = $props();
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
        <TabPage title="Color">
            <Color bind:colorSelection={colorSelection} />
        </TabPage>
    </TabGroup>
</Pane>
