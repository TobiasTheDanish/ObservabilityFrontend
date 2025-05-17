<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { AndroidEvent } from '$lib/types';
	import { format } from 'date-fns';
	import ExceptionEventCard from './ExceptionEventCard.svelte';
	import LifecycleActivityEventCard from './LifecycleActivityEventCard.svelte';
	import NavigationEventCard from './NavigationEventCard.svelte';
	import LifecycleAppEventCard from './LifecycleAppEventCard.svelte';

	const {
		event
	}: {
		event: AndroidEvent;
	} = $props();

	function readableType(type: string): string {
		return type.replaceAll('_', ' ');
	}
</script>

{#if event.type == 'exception'}
	<ExceptionEventCard {event} />
{:else if event.type == 'lifecycle_activity'}
	<LifecycleActivityEventCard {event} />
{:else if event.type == 'lifecycle_app'}
	<LifecycleAppEventCard {event} />
{:else if event.type == 'navigation'}
	<NavigationEventCard {event} />
{:else}
	<Card>
		<CardHeader>
			<CardTitle class="capitalize">
				{readableType(event.type)}
			</CardTitle>
			<CardDescription>
				{format(event.createdAt, 'yyyy-MM-dd HH:mm:ss')}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div>
				<p class="font-semibold">Data:</p>
				<pre>{JSON.stringify(event.serializedData, null, 2)}</pre>
			</div>
		</CardContent>
	</Card>
{/if}
