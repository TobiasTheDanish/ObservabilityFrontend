<script lang="ts">
	import {
		Card,
		CardTitle,
		CardHeader,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import type { InstallationUiState } from '$lib/types';
	const {
		installations
	}: {
		installations: InstallationUiState[];
	} = $props();

	const totalCount = $derived(installations.length);
</script>

<Card>
	<CardHeader>
		<CardTitle>Installations</CardTitle>
		<CardDescription>Total count</CardDescription>
	</CardHeader>
	<CardContent>
		<p><span class="me-1 font-semibold italic">Total: </span>{totalCount}</p>
	</CardContent>
</Card>
