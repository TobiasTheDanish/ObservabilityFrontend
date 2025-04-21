<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutProps } from '../$types';

	const { data, children }: LayoutProps = $props();
	//@ts-ignore
	if (!data.authenticated) {
		goto('sign-in');
	}
</script>

<Navbar />

{@render children()}
