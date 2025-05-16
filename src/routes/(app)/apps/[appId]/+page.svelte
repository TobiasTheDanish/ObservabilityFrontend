<script lang="ts">
	import type { InstallationUiState } from '$lib/types';
	import { isAfter, startOfDay, subDays, subWeeks } from 'date-fns';
	import type { PageProps } from './$types';
	import InstallationInfoCard from './InstallationInfoCard.svelte';
	import SessionInfoCard from './SessionInfoCard.svelte';
	import SessionByInstallationChart from './SessionByInstallationChart.svelte';

	const { data }: PageProps = $props();

	const sessions = $derived(data.appData.sessions);
	const installations: InstallationUiState[] = $derived.by(() =>
		data.appData.installations.map((install) => ({
			...install,
			sessions: sessions.filter((s) => s.installationId == install.id)
		}))
	);
	const sessionByInstallation = $derived.by(() =>
		installations.map((i) => ({
			id: i.id,
			sessions: i.sessions.length
		}))
	);

	const sessionsToday = $derived.by(() =>
		sessions.filter((s) => isAfter(s.createdAt, startOfDay(new Date())))
	);
	const sessionsLastWeek = $derived.by(() =>
		sessions.filter((s) => isAfter(s.createdAt, startOfDay(subDays(new Date(), 7))))
	);
	const sessionsLastMonth = $derived.by(() =>
		sessions.filter((s) => isAfter(s.createdAt, startOfDay(subDays(new Date(), 30))))
	);
</script>

<div class="grid grid-cols-4 gap-2">
	<a href={`/apps/${data.app.id}/installations`}>
		<InstallationInfoCard {installations} />
	</a>

	<a href={`/apps/${data.app.id}/sessions`}>
		<SessionInfoCard sessions={sessionsToday} description="Today" />
	</a>
	<a href={`/apps/${data.app.id}/sessions`}>
		<SessionInfoCard sessions={sessionsLastWeek} description="Last 7 days" />
	</a>
	<a href={`/apps/${data.app.id}/sessions`}>
		<SessionInfoCard sessions={sessionsLastMonth} description="Last 30 days" />
	</a>
</div>

<div>
	<SessionByInstallationChart data={sessionByInstallation} />
</div>
