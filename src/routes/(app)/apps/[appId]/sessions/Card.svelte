<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { AppData } from '$lib/types';
	import { format } from 'date-fns';

	const {
		session
	}: {
		session: AppData['sessions'][0];
	} = $props();
</script>

<a href={`/sessions/${session.id}`}>
	<Card>
		<CardHeader>
			<CardTitle>
				{session.id}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<p class={`${session.crashed ? 'text-red-600' : 'text-green-700'}`}>
				{session.crashed ? 'Crashed' : 'Not crashed'}
			</p>
			<p>
				Created: {format(new Date(session.createdAt * 1000), 'yyyy-MM-dd')}
			</p>
		</CardContent>
	</Card>
</a>
