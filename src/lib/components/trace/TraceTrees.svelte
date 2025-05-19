<script lang="ts">
	import type { TraceTree } from '$lib/types';
	import TraceTreeCard from './TraceTreeCard.svelte';

	const { trees }: { trees: TraceTree[] } = $props();
</script>

{#each trees as tree}
	<TraceTreeCard {tree} />
{/each}
