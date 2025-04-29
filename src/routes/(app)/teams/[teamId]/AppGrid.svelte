<script lang="ts">
	import { goto } from '$app/navigation';
	import { teamService } from '$lib/teamService';

	const {
		selected,
		sessionId,
		apps
	}: {
		selected: Team;
		sessionId: string;
		apps: Application[];
	} = $props();
	console.log({ selected, sessionId, apps });
	let newAppName = $state<string>();
	let newAppError = $state<string>();

	const onsubmit = async (e: Event) => {
		e.preventDefault();

		if (newAppName === undefined || newAppName.trim().length == 0) {
			return;
		}

		const res = await teamService.createApp(sessionId, selected.id, newAppName);
		console.log({ res });
		if (res.success) {
			goto(`/teams/${selected.id}/apps/${res.data.id}`, {
				invalidateAll: true
			});
		} else {
			newAppError = res.errorMessage;
		}
	};
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="flex flex-col">
		{#if apps.length == 0}
			<p>No applications for this team...</p>
		{/if}
		{#each apps as app}
			<a href={`/teams/${selected.id}/apps/${app.id}`}>{app.name}</a>
		{/each}
	</div>
	<form {onsubmit} class="flex flex-col gap-2">
		<div class="flex flex-col">
			<label for="app-name">Application name</label>
			<input
				id="app-name"
				name="appName"
				bind:value={newAppName}
				placeholder="Application name"
				class="max-w-[350px]"
			/>
		</div>
		<button type="submit" class="w-fit cursor-pointer rounded-sm border px-4 py-2"
			>Create app</button
		>
	</form>
</div>
