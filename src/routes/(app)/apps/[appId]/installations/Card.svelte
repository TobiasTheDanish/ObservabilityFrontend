<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { InstallationUiState } from '$lib/types';
	import { isAfter, subWeeks } from 'date-fns';

	const {
		installation
	}: {
		installation: InstallationUiState;
	} = $props();

	const sessions = $derived(installation.sessions);

	const crashes = $derived(sessions.filter((s) => s.crashed).length);
	const crashRate = $derived((crashes / sessions.length) * 100);

	const crashRateLastWeek = $derived.by(() => {
		const totalLastWeek = sessions.filter((s) => !isAfter(s.createdAt, subWeeks(new Date(), 1)));
		const crashedLastWeek = totalLastWeek.filter((s) => s.crashed);
		return (crashedLastWeek.length / totalLastWeek.length) * 100;
	});
</script>

<a href={`/installations/${installation.id}`}>
	<Card>
		<CardHeader>
			<CardTitle>
				{installation.brand}
				{installation.model}
			</CardTitle>
			<CardDescription>
				{installation.id}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p>{crashRate}%</p>
			<p>Change: {crashRate - crashRateLastWeek}</p>
		</CardContent>
		<CardFooter>
			Android API Level {installation.sdkVersion}
		</CardFooter>
	</Card>
</a>
