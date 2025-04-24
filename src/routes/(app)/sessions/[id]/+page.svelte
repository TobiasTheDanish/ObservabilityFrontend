<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<p>Hello session</p>

<pre>{JSON.stringify(data.sessionData ?? 'No data', null, 2)}</pre>
