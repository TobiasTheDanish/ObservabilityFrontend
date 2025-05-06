<script lang="ts">
	import type { PageProps } from './$types';
	import SignInForm from './SignInForm.svelte';

	const { form }: PageProps = $props();
</script>

<div class="mx-auto flex flex-col items-center gap-2 p-8">
	{#if form?.success === false}
		<div class="padding-4 flex max-w-[285px] flex-col gap-1 text-red-600">
			<p class="text-lg font-semibold tracking-tight">An error occured</p>
			<p>{form?.errorMessage}</p>
		</div>
	{/if}

	<SignInForm />
</div>
