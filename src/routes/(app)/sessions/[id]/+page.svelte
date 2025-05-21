<script lang="ts">
	import ResourceUsage from '$lib/components/ResourceUsage.svelte';
	import type { PageProps } from './$types';
	import EventCard from '$lib/components/event/EventCard.svelte';
	import TraceTrees from '$lib/components/trace/TraceTrees.svelte';

	const { data }: PageProps = $props();
	const events = $derived.by(() => data.events.sort((a, b) => b.createdAt - a.createdAt));
	const trees = $derived.by(() => {
		return data.traceTree.sort((a, b) => b.root.data.length - a.root.data.length);
	});
</script>

<pre>{JSON.stringify(data.sessionData ?? 'No data', null, 2)}</pre>

<ResourceUsage resourceUsage={data.resourceUsage} />

<TraceTrees {trees} />

{#if events.length > 0}
	<div class="flex flex-col gap-4 p-4">
		{#each events as event}
			<EventCard {event} />
		{/each}
	</div>
{:else}
	<p class="text-2xl font-bold">No events has been collected</p>
{/if}
