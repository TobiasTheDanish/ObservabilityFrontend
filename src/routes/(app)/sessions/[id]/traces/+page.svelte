<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { TraceTree } from '$lib/types';
	import { root } from 'postcss';
	import type { PageProps } from './$types';
	import { format } from 'date-fns';

	const { data }: PageProps = $props();
	const sorted = $derived.by(() => {
		const traceTrees: TraceTree[] = data.traceTree;
		const avgDurations: Record<string, number> = traceTrees.reduce<Record<string, number>>(
			(acc, cur) => {
				const total = cur.root.data.reduce((acc, cur) => acc + (cur.endTime - cur.startTime), 0);

				if (total == 0 && cur.root.data.length != 0) {
					acc[cur.root.name ?? ''] = 0;
				} else if (cur.root.data.length != 0) {
					acc[cur.root.name] = total / cur.root.data.length;
				}
				return acc;
			},
			{}
		);

		return traceTrees
			.filter((tree) => tree.root.data.length > 0)
			.sort((a, b) => avgDurations[b.root.name] - avgDurations[a.root.name]);
	});
</script>

{#each sorted as tree}
	<Card class="flex flex-col gap-4">
		<CardHeader>
			<CardTitle>{tree.root.name}</CardTitle>
		</CardHeader>
		<CardContent>
			<ScrollArea orientation="horizontal">
				<div class="flex flex-row gap-2">
					{#each tree.root.data as trace}
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
{/each}

<pre>{JSON.stringify(sorted, null, 2)}</pre>
