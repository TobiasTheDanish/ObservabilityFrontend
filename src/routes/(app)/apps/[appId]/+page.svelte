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

<p>{data.app.name}</p>
<div class="grid grid-cols-4 gap-2">
	<InstallationInfoCard {installations} />

	<SessionInfoCard {sessions} />
</div>
