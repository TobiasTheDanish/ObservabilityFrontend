<script lang="ts">
	import { teamService } from "$lib/teamService";
	import { selectedTeam } from '$lib/state.svelte';
	import { sessionStore } from "$lib/store";
	import { get } from 'svelte/store';

	const sessionId = get(sessionStore);
	const selected = $derived(selectedTeam.selected);
	const appsPromise = $derived.by(() => {
		let res 
		if (selected != undefined) {
			res = teamService.getApps(selected.id, sessionId)
		} else {
			res = new Promise((res) => res([]))
		}

		return res
	});
</script>

<h1>This is the app part</h1>
<p>{selected?.name ?? 'No team selected'}</p>

{#await appsPromise}
	<p>loading apps...</p>
{:then res}
	{#if res.success}
		{#if res.data.length == 0 }
			<p>No applications for this team...</p>
		{/if}
		{#each res.data as app}
			<p>{app.name}</p>
		{/each}
	{:else}
		<p>{res.errorMessage}</p>
	{/if}
{/await}
