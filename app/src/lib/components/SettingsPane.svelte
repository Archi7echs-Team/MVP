<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage, Text } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let value: [number, number] = $state([0, 100])
  $effect(() => {
        console.log('value', value);
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
    </TabGroup>
</Pane>

