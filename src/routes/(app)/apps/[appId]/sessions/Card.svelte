<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { SessionUiState } from '$lib/types';
	import { format } from 'date-fns';

	const {
		session
	}: {
		session: SessionUiState;
	} = $props();
</script>

<a href={`/sessions/${session.id}`}>
	<Card>
		<CardHeader>
			<CardTitle>
				{session.id}
			</CardTitle>
			<CardDescription>
				{#if session.installation != undefined}
					{session.installation.brand}
					{session.installation.model}<br />
					{session.installation.id}
				{:else}
					No installation found for this session
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p class={`${session.crashed ? 'text-red-600' : 'text-green-700'}`}>
				{session.crashed ? 'Crashed' : 'Not crashed'}
			</p>
			<p>
				Created: {format(new Date(session.createdAt), 'yyyy-MM-dd HH:mm')}
			</p>
		</CardContent>
	</Card>
</a>
