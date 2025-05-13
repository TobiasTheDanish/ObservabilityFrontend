<script lang="ts">
	import type { PageProps } from './$types';
	import ResourceUsage from '$lib/components/ResourceUsage.svelte';

	const { data }: PageProps = $props();
</script>

<p>Hello installation</p>
<pre>{JSON.stringify(data.installationInfo, null, 4)}</pre>

<ResourceUsage resourceUsage={data.resourceUsage} />
