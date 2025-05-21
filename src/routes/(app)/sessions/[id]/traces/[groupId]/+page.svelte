<script lang="ts">
	import type { PageProps } from './$types';
	import FlameGraph from './FlameGraph.svelte';

	const { data }: PageProps = $props();
	const tree = $derived(data.tree);
</script>

<FlameGraph {tree} />

<pre>{JSON.stringify(tree, null, 2)}</pre>
<pre>{JSON.stringify(data.traces, null, 2)}</pre>
