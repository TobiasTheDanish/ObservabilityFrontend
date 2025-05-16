<script lang="ts">
	import {
		Card,
		CardTitle,
		CardHeader,
		CardContent,
		CardDescription
	} from '$lib/components/ui/card';
	import type { AppData } from '$lib/types';

	const {
		sessions,
		description
	}: {
		sessions: AppData['sessions'];
		description: string;
	} = $props();

	const crashes = $derived(sessions.filter((s) => s.crashed).length);
	const crashRate = $derived((crashes / sessions.length) * 100);
</script>

<Card>
	<CardHeader>
		<CardTitle>Sessions</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>
	<CardContent>
		<p><span class="me-1 font-semibold italic">Total: </span>{sessions.length}</p>
		<p>Crashes: {crashes}</p>
		<p>Rate: {crashRate}%</p>
	</CardContent>
</Card>
