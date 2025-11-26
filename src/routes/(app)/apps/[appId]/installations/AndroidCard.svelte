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
	import { format, isAfter, subWeeks } from 'date-fns';

	const {
		installation
	}: {
		installation: InstallationUiState<'android'>;
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
				{installation.data.brand}
				{installation.data.model}
			</CardTitle>
			<CardDescription>
				{installation.id}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p>{crashRate}%</p>
			<p>Change: {crashRate - crashRateLastWeek}</p>
			<p>
				Created:
				{format(new Date(installation.createdAt), 'yyyy-MM-dd HH:mm')}
			</p>
		</CardContent>
		<CardFooter>
			Android API Level {installation.data.sdkVersion}
		</CardFooter>
	</Card>
</a>
