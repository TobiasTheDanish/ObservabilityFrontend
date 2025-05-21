<script lang="ts">
	import type { TraceTree, TraceTreeNode } from '$lib/types';
	import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import Card from '../ui/card/card.svelte';

	const { tree }: { tree: TraceTree } = $props();
	console.log(tree);
	const name = $derived.by(() => tree.root.data.at(0)?.name);
	const occurrences = $derived(tree.root.data.length);
	const avgDuration = $derived.by(() => {
		const total = tree.root.data.reduce((acc, cur) => acc + (cur.endTime - cur.startTime), 0);
		if (total == 0 || tree.root.data.length == 0) return 0;

		return total / tree.root.data.length;
	});
	const subTraces = $derived.by(() => {
		const reduceChild = (child: TraceTreeNode) => {
			return child.data.map((t) => t.name);
		};

		return new Set(
			tree.root.children.reduce<string[]>((acc, cur) => [...acc, ...reduceChild(cur)], [])
		);
	});
	const maxDepth = $derived.by(() => {
		const searchChildren = (children: TraceTreeNode[]): number => {
			return children.reduce((acc, cur) => {
				const childDepth = cur.children.length > 0 ? searchChildren(cur.children) : cur.depth;

				return acc >= childDepth ? acc : childDepth;
			}, 0);
		};

		return searchChildren(tree.root.children);
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>{name ?? 'Unnamed trace'}</CardTitle>
		<CardDescription>Avg. duration: {avgDuration.toFixed(2)} ms</CardDescription>
	</CardHeader>
	<CardContent>
		<p>Occurrences: {occurrences}</p>
		<p>Max depth: {maxDepth}</p>
		<p>Subtraces: {subTraces.size}</p>
	</CardContent>
</Card>
