<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<pre>{JSON.stringify(data.tree, null, 2)}</pre>
<pre>{JSON.stringify(data.traces, null, 2)}</pre>
