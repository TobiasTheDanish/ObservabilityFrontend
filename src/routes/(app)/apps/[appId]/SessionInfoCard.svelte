<script lang="ts">
	import {
		Card,
		CardTitle,
		CardHeader,
		CardContent,
		CardDescription
	} from '$lib/components/ui/card';
	import type { AppData } from '$lib/types';
	import { isAfter, subWeeks } from 'date-fns';

	const {
		sessions
	}: {
		sessions: AppData['sessions'];
	} = $props();

	const crashes = $derived(sessions.filter((s) => s.crashed).length);
	const crashRate = $derived((crashes / sessions.length) * 100);

	const crashRateLastWeek = $derived.by(() => {
		const totalLastWeek = sessions.filter((s) => !isAfter(s.createdAt, subWeeks(new Date(), 1)));
		const crashedLastWeek = totalLastWeek.filter((s) => s.crashed);
		if (totalLastWeek.length == 0 || crashedLastWeek.length == 0) return 0;
		return (crashedLastWeek.length / totalLastWeek.length) * 100;
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>Sessions</CardTitle>
		<CardDescription>Session crash rate</CardDescription>
	</CardHeader>
	<CardContent>
		<p><span class="me-1 font-semibold italic">Total: </span>{sessions.length}</p>
		<p>Crashes: {crashes}</p>
		<p>{crashRate}%</p>
		<p>Change: {crashRate - crashRateLastWeek}</p>
	</CardContent>
</Card>
