<script lang="ts">
	import type { PageProps } from './$types';
	import ResourceUsage from './ResourceUsage.svelte';

	const { data }: PageProps = $props();
	console.log({ data });
</script>

<p>Hello installation</p>

<ResourceUsage resourceUsage={data.resourceUsage} />
