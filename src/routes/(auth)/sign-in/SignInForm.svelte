<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/store';
	import type { ServiceResponse } from '$lib/types';

	let username = $state('');
	let password = $state('');
	let error = $state<string>();
	let loading = $state(false);

	async function handleSignIn(signInRes: ServiceResponse<{ sessionId: string }>) {
		loading = true;
		if (signInRes.success) {
			sessionStore.set(signInRes.data.sessionId);
			await goto('/');
		} else {
			error = signInRes.errorMessage;
		}
		loading = false;
	}
</script>

<form method="POST" use:enhance class="flex flex-col items-center justify-center gap-2">
	<div class="flex max-w-[285px] flex-col">
		<label for="username">Username</label>
		<input id="username" name="username" placeholder="Input username..." bind:value={username} />
	</div>
	<div class="flex max-w-[285px] flex-col">
		<label for="password">Password</label>
		<input
			id="password"
			name="password"
			placeholder="Input password..."
			type="password"
			bind:value={password}
		/>
	</div>
	<button class="w-fit cursor-pointer rounded-sm border px-4 py-2" type="submit" disabled={loading}>
		{#if loading}
			Signing in...
		{:else}
			Sign in
		{/if}
	</button>
</form>
