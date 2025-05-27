<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { TraceTree } from '$lib/types';
	import { format } from 'date-fns';

	const { tree }: { tree: TraceTree } = $props();

	const sortedData = $derived.by(() => {
		return tree.root.data.sort((a, b) => b.startTime - a.startTime);
	});
</script>

<Card class="flex flex-col gap-4">
	<CardHeader>
		<CardTitle>{tree.root.name}</CardTitle>
	</CardHeader>
	<CardContent>
		<ScrollArea orientation="horizontal">
			<div class="flex flex-row gap-2">
				{#each sortedData as trace}
					<a href={`${window.location.pathname}/${trace.groupId}`}>
						<div
							class="flex w-[200px] flex-col gap-2 rounded-lg border p-2 shadow-sm hover:bg-muted"
						>
							<p>{format(new Date(trace.startTime), 'yyyy-MM-dd HH:mm')}</p>
							<p>Duration: {trace.endTime - trace.startTime} ms</p>
							<p class={trace.status == 'Error' ? 'text-red-500' : ''}>
								Status: {trace.status}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</ScrollArea>
	</CardContent>
</Card>
