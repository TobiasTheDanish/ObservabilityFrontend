<script lang="ts">
	import type { Team } from '$lib/types';
	import TeamSelect from './TeamSelect.svelte';

	const {
		selectedTeam,
		teams
	}: {
		selectedTeam: Team | undefined;
		teams: Team[];
	} = $props();
</script>

<div class="sticky top-0 z-50 flex justify-between bg-background p-4">
	<div>
		<TeamSelect {selectedTeam} {teams} />
	</div>
	<div>
		<form method="POST" action="/sign-out">
			<button type="submit" class="w-fit cursor-pointer rounded-sm border px-4 py-2">
				Sign out
			</button>
		</form>
	</div>
</div>
