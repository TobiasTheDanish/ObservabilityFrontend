<script lang="ts">
	import type { PageProps } from './$types';
	import Card from './Card.svelte';

	const { data }: PageProps = $props();
	const sessions = $derived.by(() =>
		data.appData.sessions
			.sort((a, b) => b.createdAt - a.createdAt)
			.map((s) => ({
				...s,
				installation: data.appData.installations.find((i) => i.id == s.installationId)
			}))
	);
</script>

<div class="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-3">
	{#each sessions as session}
		<Card {session} />
	{/each}
</div>
