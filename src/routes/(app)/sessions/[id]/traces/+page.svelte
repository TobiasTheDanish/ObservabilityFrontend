<script lang="ts">
	import type { TraceTree, Trace } from '$lib/types';
	import type { PageProps } from './$types';
	import { buildTree } from '$lib/utils';
	import TraceTreeCard from './TraceTreeCard.svelte';
	import FullFlameGraph from './FullFlameGraph.svelte';

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

	const graphTrees = $derived.by(() => {
		const traces = data.traces;

		const grouped: Record<string, Trace[]> = {};
		for (let trace of traces) {
			if (grouped[trace.groupId] === undefined) {
				grouped[trace.groupId] = [];
			}

			grouped[trace.groupId].push(trace);
		}

		console.log(grouped);
		return Array.from(Object.values(grouped))
			.filter((group) => group.some((t) => t.parentId == ''))
			.map((group) => buildTree(group));
	});
</script>

<FullFlameGraph {graphTrees} />

{#each sorted as tree}
	<TraceTreeCard {tree} />
{/each}

<pre>{JSON.stringify(sorted, null, 2)}</pre>
