<script lang="ts">
	import type { Application, Team } from '$lib/types';

	const {
		selected,
		apps
	}: {
		selected: Team;
		apps: Application[];
	} = $props();
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="flex flex-col">
		{#if apps.length == 0}
			<p>No applications for {selected.name}...</p>
		{/if}
		{#each apps as app}
			<a href={`/apps/${app.id}`}>{app.name}</a>
		{/each}
	</div>
	<form method="POST" action="?/createApp" class="flex flex-col gap-2">
		<div class="flex flex-col">
			<label for="app-name">Application name</label>
			<input id="app-name" name="appName" placeholder="Application name" class="max-w-[350px]" />
		</div>
		<button type="submit" class="w-fit cursor-pointer rounded-sm border px-4 py-2"
			>Create app</button
		>
	</form>
</div>
