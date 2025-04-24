<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<p>{data.app.name}</p>

<pre>
	{JSON.stringify(data.appData, null, 2)}
</pre>
