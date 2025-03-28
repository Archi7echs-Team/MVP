<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataFilter from './DataFilter.svelte';
  import Color from './Color.svelte';
  import Average from './Average.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);
  let { 
        resetTarget, 
        defaultPosition, 
        valMin, 
        valMax, 
        mediaFilter = $bindable(), 
        colorSelection = $bindable(), 
        rangeValue = $bindable([valMin, valMax] as [number, number]), 
        avgEnabled = $bindable() 
      } = $props();
</script>


<Pane title="Settings" position="fixed">
    <TabGroup>
        <TabPage title="Camera options">
            <CameraSettings {defaultPosition} {resetTarget}/>
        </TabPage>
        <TabPage title="Data source">
            <DataSource />
        </TabPage>
        <TabPage title="Data filter">
            <DataFilter {valMin} {valMax} bind:mediaFilter={mediaFilter} bind:value={rangeValue} />
        </TabPage>
        <TabPage title="Color filter">
            <Color bind:colorSelection={colorSelection} />
        </TabPage>
        <TabPage title="Average">
            <Average bind:avgEnabled={avgEnabled}/>
        </TabPage>
    </TabGroup>
</Pane>

