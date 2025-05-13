<script lang="ts">
	import {
		Card,
		CardTitle,
		CardHeader,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import type { InstallationUiState } from '$lib/types';
	import { format } from 'date-fns';
	const {
		installations
	}: {
		installations: InstallationUiState[];
	} = $props();

	const totalCount = $derived(installations.length);
	const latestInstallation = $derived.by(() => {
		return installations.sort((a, b) => b.createdAt - a.createdAt)?.at(0);
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>Total Installations</CardTitle>
		<CardDescription>
			{#if latestInstallation != undefined}
				{format(new Date(latestInstallation.createdAt * 1000), 'yyyy-MM-dd HH:mm')}
			{/if}
		</CardDescription>
	</CardHeader>
	<CardContent>
		<p><span class="me-1 font-semibold italic">Total: </span>{totalCount}</p>
	</CardContent>
</Card>
