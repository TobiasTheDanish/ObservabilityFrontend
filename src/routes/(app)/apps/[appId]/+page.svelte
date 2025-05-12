<script lang="ts">
	import type { InstallationUiState } from '$lib/types';
	import type { PageProps } from './$types';
	import InstallationInfoCard from './InstallationInfoCard.svelte';
	import SessionInfoCard from './SessionInfoCard.svelte';

	const { data }: PageProps = $props();

	const sessions = $derived(data.appData.sessions);
	const installations: InstallationUiState[] = $derived.by(() =>
		data.appData.installations.map((install) => ({
			...install,
			sessions: sessions.filter((s) => s.installationId == install.id)
		}))
	);
</script>

<div class="grid grid-cols-4 gap-2">
	<a href={`/apps/${data.app.id}/installations`}>
		<InstallationInfoCard {installations} />
	</a>

	<a href={`/apps/${data.app.id}/sessions`}>
		<SessionInfoCard {sessions} />
	</a>
</div>
