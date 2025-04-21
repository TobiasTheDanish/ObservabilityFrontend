<script lang="ts">
	import { goto } from '$app/navigation';
	import { authService } from '$lib/authService';
	import { sessionStore } from '$lib/store';

	let username = $state('');
	let password = $state('');
	let error = $state<string>();
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		console.log({ username, password });
		error = undefined;
		loading = true;
		const signInRes = await authService.signIn(username, password);
		if (signInRes.success) {
			sessionStore.set(signInRes.data.sessionId);
			await goto('/');
		} else {
			error = signInRes.errorMessage;
		}
		loading = false;
	}
</script>

<form {onsubmit} class="flex flex-col items-center justify-center gap-2">
	{#if error != undefined}
		<div class="padding-4 flex flex-col gap-1 text-red-600">
			<p class="text-lg font-semibold tracking-tight">An error occured</p>
			<p>{error}</p>
		</div>
	{/if}

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
