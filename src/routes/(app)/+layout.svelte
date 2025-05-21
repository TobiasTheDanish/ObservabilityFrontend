<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();

	const { teams } = data;
</script>

<Navbar {teams} />

<main>
	{@render children()}
</main>
