<script lang="ts">
	import { format } from 'date-fns';
	import type { PageProps } from './$types';
	import type { AndroidEvent } from '$lib/types';

	const { data }: PageProps = $props();

	const events = data.events;

	let selectedEvent = $state<AndroidEvent | null>(null);

	const displayableType = (e: AndroidEvent): string => {
		switch (e.type) {
			case 'lifecycle_app':
				return `app ${e.serializedData?.type}`;
			case 'lifecycle_activity':
				return `activity ${e.serializedData?.type}`;
			case 'navigation':
				return e.type;
			case 'exception':
				return `${e.serializedData?.handled ? 'handled' : 'unhandled'} exception`;
			case 'custom':
				return 'custom';
		}
	};

	const dataString = (e: AndroidEvent): string => {
		switch (e.type) {
			case 'lifecycle_app':
				return '';
			case 'lifecycle_activity':
				return `${e.serializedData?.className}`;
			case 'navigation':
				return `${e.serializedData?.route}`;
			case 'exception': {
				const threadName = e.serializedData?.threadName;
				return (
					e.serializedData?.exceptionUnits
						.map((unit) => `In thread "${threadName}" ${unit.name}: ${unit.message}`)
						.join('. ') ?? ''
				);
			}
			case 'custom':
				return '';
		}
	};
</script>

<div class="flex flex-col gap-2">
	<div class="grid grid-cols-[190px_202px_1fr] gap-4">
		<div>
			<p>Time</p>
		</div>
		<div>
			<p>Type</p>
		</div>
		<div>
			<p>Data</p>
		</div>
	</div>

	{#each events as event}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="grid grid-cols-[190px_202px_calc(98vw-200px-435px)] items-center gap-4"
			onclick={() => (selectedEvent = event)}
			role="button"
			tabindex="0"
		>
			<div>
				<p>{format(event.createdAt, 'yyyy-MM-dd HH:mm:ss')}</p>
			</div>
			<div>
				<p class="w-fit capitalize">{displayableType(event)}</p>
			</div>
			<div>
				<p class="truncate">{dataString(event)}</p>
			</div>
		</div>
	{/each}
</div>

{#if selectedEvent != null}
	<aside class="absolute right-0 top-0 h-[calc(99vh-91px)] bg-red-500">
		<pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
	</aside>
{/if}
