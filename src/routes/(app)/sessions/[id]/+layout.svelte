<script lang="ts">
	import type { LayoutProps } from './$types';
	import SessionSideBar from './SessionSideBar.svelte';

	const { data, children }: LayoutProps = $props();
	const id = $derived(data.id);
</script>

<div class="grid md:grid-cols-[200px_1fr]">
	<SessionSideBar {id} />

	<div class="w-[calc(98vw-200px)]">
		{@render children()}
	</div>
</div>
