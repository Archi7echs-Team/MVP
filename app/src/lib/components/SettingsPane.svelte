<script lang="ts">
	import { Pane, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui';
	import CameraSettings from './CameraSettings.svelte';
	import DataSource from './DataSource.svelte';
	import DataFilter from './DataFilter.svelte';
	import Color from './Color.svelte';
	import Export from './Export.svelte';
	ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.standard);
	let { resetTarget } = $props();
</script>

<Pane title="Settings" position="fixed">
	<TabGroup>
		<TabPage title="Camera">
			<CameraSettings {resetTarget} />
		</TabPage>
		<TabPage title="Source">
			<DataSource {resetTarget} />
		</TabPage>
		<TabPage title="Filter">
			<DataFilter />
		</TabPage>
		<TabPage title="Color">
			<Color />
		</TabPage>
		<TabPage title="Export">
			<Export />
		</TabPage>
	</TabGroup>
</Pane>
