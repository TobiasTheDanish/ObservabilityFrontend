<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { AndroidLifecycleActivityEvent } from '$lib/types';
	import { format } from 'date-fns';

	const {
		event
	}: {
		event: AndroidLifecycleActivityEvent;
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
		{event.serializedData?.className} was {event.serializedData?.type}
	</CardContent>
</Card>
