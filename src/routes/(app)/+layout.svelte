<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();

	const { teams, selectedTeam } = data;
</script>

<Navbar {selectedTeam} {teams} />

<main>
	{@render children()}
</main>
