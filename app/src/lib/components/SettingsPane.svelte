<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataRange.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);
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
            <DataRange />
        </TabPage>
    </TabGroup>
</Pane>

