<script lang="ts">
	import { Select, SelectTrigger, SelectContent, SelectItem } from '$lib/components/ui/select';
	import type { Team } from '$lib/types';
	import { goto } from '$app/navigation';

	const {
		selectedTeam,
		teams
	}: {
		selectedTeam: Team | undefined;
		teams: Team[];
	} = $props();
	let selected = $derived(selectedTeam);
	let value = $derived(selected?.id?.toString(10));
</script>

<Select
	type="single"
	{value}
	onValueChange={(e) => {
		selected = teams.find((t) => t.id.toString(10) == e);
		goto(`/teams/${e}`, { invalidateAll: true });
	}}
>
	<SelectTrigger placeholder="Select your team">{selected?.name ?? 'Select team'}</SelectTrigger>
	<SelectContent>
		{#each teams as team}
			<SelectItem value={team.id.toString(10)}>{team.name}</SelectItem>
		{/each}
	</SelectContent>
</Select>
