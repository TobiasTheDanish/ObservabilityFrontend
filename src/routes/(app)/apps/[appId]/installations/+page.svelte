<script lang="ts">
	import type { InstallationUiState } from '$lib/types';
	import type { PageProps } from './$types';
	import AndroidCard from './AndroidCard.svelte';
	import Card from './Card.svelte';

	const { data }: PageProps = $props();
	const installations: InstallationUiState[] = $derived.by(() => {
		const sessions = data.appData.sessions;
		return data.appData.installations
			.map((i) => ({
				...i,
				sessions: sessions.filter((s) => s.installationId == i.id)
			}))
			.sort((a, b) => b.createdAt - a.createdAt);
	});
</script>

<div class="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-3">
	{#each installations as installation}
		{#if installation.type == 'android'}
			<AndroidCard installation={installation as InstallationUiState<'android'>} />
		{:else}
			<Card {installation} />
		{/if}
	{/each}
</div>
