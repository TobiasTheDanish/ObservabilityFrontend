<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
