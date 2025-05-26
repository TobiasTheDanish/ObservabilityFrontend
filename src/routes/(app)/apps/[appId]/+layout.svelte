<script lang="ts">
	import type { LayoutProps } from './$types';
	import AppSideBar from './AppSideBar.svelte';

	const { data, children }: LayoutProps = $props();
	const id = $derived(data.appId);
	const teamId = $derived(data.teamId);
</script>

<div class="grid md:grid-cols-[200px_1fr]">
	<AppSideBar {id} appName={data.app.name} {teamId} />

	<div class="w-full">
		{@render children()}
	</div>
</div>
