<script lang="ts">
	import { selectedTeam } from '$lib/state.svelte';

	const { teams } = $props();
</script>

<select bind:value={selectedTeam.selected} placeholder="Select team">
	{#each teams as team}
		<option value={team}>{team.name}</option>
	{/each}
</select>
