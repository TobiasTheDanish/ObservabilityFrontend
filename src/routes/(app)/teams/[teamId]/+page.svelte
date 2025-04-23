<script lang="ts">
	import AppGrid from './AppGrid.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { sessionId, selectedTeam: selected, apps } = $derived(data);
</script>

<h3>{selected?.name ?? 'No team'}</h3>

{#if selected !== undefined}
	<AppGrid {sessionId} {selected} {apps} />
{/if}
