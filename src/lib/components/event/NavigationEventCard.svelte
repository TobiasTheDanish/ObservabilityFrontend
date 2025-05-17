<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { AndroidNavigationEvent } from '$lib/types';
	import { format } from 'date-fns';

	const {
		event
	}: {
		event: AndroidNavigationEvent;
	} = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle class="capitalize">
			{event.type}
		</CardTitle>
		<CardDescription>
			{format(event.createdAt, 'yyyy-MM-dd HH:mm:ss')}
		</CardDescription>
	</CardHeader>
	<CardContent>
		Navigated to {event.serializedData?.route}
	</CardContent>
</Card>
