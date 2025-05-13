<script lang="ts">
	import ResourceUsage from '$lib/components/ResourceUsage.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<p>Hello session</p>

<pre>{JSON.stringify(data.sessionData ?? 'No data', null, 2)}</pre>

<ResourceUsage resourceUsage={data.resourceUsage} />
