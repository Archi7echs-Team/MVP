<script lang="ts">
  import { Pane, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui';
  import CameraSettings from './CameraSettings.svelte';
  import DataSource from './DataSource.svelte';
  import DataRange from './DataFilter.svelte';
  import Color from './Color.svelte';
  ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);

  let { valMin, valMax, mediaFilter=$bindable() ,colorSelection=$bindable(), value = $bindable([valMin, valMax] as [number, number]) } = $props();
</script>


<Pane title="Settings" position="fixed">
    <TabGroup>
        <TabPage title="Camera options">
            <CameraSettings />
        </TabPage>
        <TabPage title="Data source">
            <DataSource />
        </TabPage>
        <TabPage title="Data filter">
            <DataRange valMin={valMin} valMax={valMax} bind:mediaFilter={mediaFilter} bind:value={value} />
        </TabPage>
        <TabPage title="Color filter">
            <Color bind:colorSelection={colorSelection} />
        </TabPage>
    </TabGroup>
</Pane>

<style>
    :global(.tp-dfwv) { 
      width: 25em !important;
    }
  </style>
