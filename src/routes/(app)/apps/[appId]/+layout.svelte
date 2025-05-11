<script lang="ts">
	import type { LayoutProps } from './$types';
	import AppSideBar from './AppSideBar.svelte';

	const { data, children }: LayoutProps = $props();
	const id = $derived(data.appId);
</script>

<div class="grid grid-cols-[200px_1fr]">
	<AppSideBar {id} />

	<div class="w-full">
		{@render children()}
	</div>
</div>
