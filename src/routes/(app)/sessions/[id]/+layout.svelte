<script lang="ts">
	import type { LayoutProps } from './$types';
	import SessionSideBar from './SessionSideBar.svelte';

	const { data, children }: LayoutProps = $props();
	const id = $derived(data.id);
	const appId = $derived(data.appId);
</script>

<div class="grid md:grid-cols-[200px_1fr]">
	<SessionSideBar {appId} {id} />

	<div class="relative w-[calc(98vw-200px)]">
		{@render children()}
	</div>
</div>
