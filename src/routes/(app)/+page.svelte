<script lang="ts">
	import { selectedTeam } from '$lib/state.svelte';

	const selected = $derived(selectedTeam.selected);
</script>

<h1>This is the app part</h1>
<p>{selected?.name ?? 'No team selected'}</p>
