<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import TeamCard from './TeamCard.svelte';

	const { data }: PageProps = $props();

	const { teams, selectedTeam } = data;

	$effect(() => {
		if (selectedTeam != undefined) {
			goto(`/teams/${selectedTeam.id}`, {});
		}
	});
</script>

<div class="flex flex-col gap-4 p-4">
	<h1 class="text-2xl font-semibold tracking-tighter">Observability</h1>
	<div class="grid grid-cols-2 gap-4 p-2 md:grid-cols-3 lg:grid-cols-4">
		{#each teams as team}
			<TeamCard {team} />
		{/each}
	</div>
</div>
