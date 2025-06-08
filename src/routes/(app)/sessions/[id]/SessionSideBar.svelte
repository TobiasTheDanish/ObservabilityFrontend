<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	const { id, appId }: { id: string; appId: string } = $props();
</script>

<aside class="fixed top-[91px] z-30 hidden h-[calc(100vh-91px)] w-full shrink-0 md:sticky md:block">
	<ScrollArea class="h-full w-full p-2">
		<div class="w-full">
			<div class="grid grid-flow-row auto-rows-max gap-1 text-sm">
				<a
					href={`/apps/${appId}/sessions`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">Back to app</a
				>
				<a
					href={`/sessions/${id}`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">General</a
				>
				<a
					href={`/sessions/${id}/events`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">Events</a
				>
				<a
					href={`/sessions/${id}/traces`}
					class="p-2 transition-all hover:bg-slate-200 active:bg-slate-100">Traces</a
				>
			</div>
		</div>
	</ScrollArea>
</aside>
