<script lang="ts">
	import type { InstallationUiState } from '$lib/types';
	import type { PageProps } from './$types';
	import Card from './Card.svelte';

	const { data }: PageProps = $props();
	const installations: InstallationUiState[] = $derived.by(() => {
		const sessions = data.appData.sessions;
		return data.appData.installations.map((i) => ({
			...i,
			sessions: sessions.filter((s) => s.installationId == i.id)
		}));
	});
</script>

<div class="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-3">
	{#each installations as installation}
		<Card {installation} />
	{/each}
</div>
