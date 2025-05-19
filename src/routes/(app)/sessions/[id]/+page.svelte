<script lang="ts">
	import ResourceUsage from '$lib/components/ResourceUsage.svelte';
	import type { PageProps } from './$types';
	import EventCard from '$lib/components/event/EventCard.svelte';
	import TraceTrees from '$lib/components/trace/TraceTrees.svelte';

	const { data }: PageProps = $props();
</script>

<p>Hello session</p>

<pre>{JSON.stringify(data.sessionData ?? 'No data', null, 2)}</pre>

<ResourceUsage resourceUsage={data.resourceUsage} />

<TraceTrees trees={data.traceTree} />

{#if data.events.length > 0}
	<div class="flex flex-col gap-4 p-4">
		{#each data.events as event}
			<EventCard {event} />
		{/each}
	</div>
{:else}
	<p class="text-2xl font-bold">No events has been collected</p>
{/if}
