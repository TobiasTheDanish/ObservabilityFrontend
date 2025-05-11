<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/store';
	import TeamSelect from './TeamSelect.svelte';

	const { teams } = $props();

	function signOut() {
		sessionStore.set('');
		goto('sign-in');
	}
</script>

<div class="sticky top-0 z-50 flex justify-between bg-background p-4">
	<div>
		<TeamSelect {teams} />
	</div>
	<div>
		<button class="w-fit cursor-pointer rounded-sm border px-4 py-2" onclick={signOut}>
			Sign out
		</button>
	</div>
</div>
