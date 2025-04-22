<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutProps } from '../$types';

	const { data, children }: LayoutProps = $props();

	//@ts-ignore
	const { authenticated, teams } = data;

	if (!authenticated) {
		goto('sign-in');
	}
</script>

<Navbar {teams} />

{@render children()}
