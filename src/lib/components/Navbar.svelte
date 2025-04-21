<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/store';

	function signOut() {
		sessionStore.set('');
		goto('sign-in');
	}
</script>

<div class="flex justify-between p-4">
	<div></div>
	<div>
		<button class="w-fit cursor-pointer rounded-sm border px-4 py-2" onclick={signOut}>
			Sign out
		</button>
	</div>
</div>
