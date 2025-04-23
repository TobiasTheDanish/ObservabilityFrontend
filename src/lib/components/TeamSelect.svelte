<script lang="ts">
	import { goto } from '$app/navigation';
	import { selectedTeam } from '$lib/state.svelte';

	const { teams } = $props();
	$effect(() => {
		if (selectedTeam.selected !== undefined) {
			goto(`/teams/${selectedTeam.selected?.id}`, {
				invalidateAll: true
			});
		}
	});
</script>

<select bind:value={selectedTeam.selected} placeholder="Select team">
	{#each teams as team}
		<option value={team}>{team.name}</option>
	{/each}
</select>
