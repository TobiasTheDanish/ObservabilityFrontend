<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { Team } from '$lib/types';

	const { team }: { team: Team } = $props();
</script>

<a href={`/teams/${team.id}`}>
	<Card>
		<CardHeader>
			<CardTitle>{team.name}</CardTitle>
		</CardHeader>
		<CardContent>Add any useful team info here</CardContent>
	</Card>
</a>
