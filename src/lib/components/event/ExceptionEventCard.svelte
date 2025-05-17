<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { AndroidExceptionEvent } from '$lib/types';
	import { format } from 'date-fns';

	const {
		event
	}: {
		event: AndroidExceptionEvent;
	} = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle class="capitalize">
			{#if event.serializedData?.handled}
				Handled
			{:else}
				Unhandled
			{/if}
			{event.type}
		</CardTitle>
		<CardDescription>
			{format(event.createdAt, 'yyyy-MM-dd HH:mm:ss')}
		</CardDescription>
	</CardHeader>
	<CardContent>
		{#if event.serializedData?.exceptionUnits?.length}
			<div class="flex flex-col gap-1">
				{#each event.serializedData?.exceptionUnits as unit}
					<p>
						Exception in thread "{event.serializedData?.threadName}" {unit.name}: {unit.message}
					</p>
				{/each}
			</div>
		{:else}
			<p>No Exceptions available</p>
		{/if}
	</CardContent>
</Card>
