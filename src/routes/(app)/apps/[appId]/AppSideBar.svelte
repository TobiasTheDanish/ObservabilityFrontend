<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	const { id }: { id: number } = $props();
</script>

<aside
	class="fixed top-[91px] z-30 hidden h-[calc(100vh-4.6rem)] w-full shrink-0 md:sticky md:block"
>
	<ScrollArea class="h-full w-full p-2">
		<div class="w-full">
			<div class="grid grid-flow-row auto-rows-max gap-1 text-sm">
				<a href={`/apps/${id}`} class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100"
					>General</a
				>
				<a
					href={`/apps/${id}/installations`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">Installations</a
				>
				<a
					href={`/apps/${id}/sessions`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">Sessions</a
				>
			</div>
		</div>
	</ScrollArea>
</aside>
