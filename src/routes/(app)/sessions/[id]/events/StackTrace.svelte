<script lang="ts">
	import type { AndroidExceptionEvent } from '$lib/types';

	const { data }: { data: AndroidExceptionEvent['serializedData'] } = $props();

	console.log(data?.exceptionUnits);
</script>

<div class="w-full overflow-auto break-all">
	{#each data?.exceptionUnits ?? [] as unit}
		<pre>Exception in thread '{data?.threadName}' <span class="text-destructive">{unit.name}</span
			>: <span class="text-destructive">{unit.message}</span></pre>
		{#each unit.frames as frame}
			<pre>    at <span class="text-teal-600">{frame.className}</span>.<span class="text-amber-600"
					>{frame.methodName}</span
				>(<span class="text-blue-700">{frame.fileName}:{frame.lineNum}</span>)</pre>
		{/each}
	{/each}
</div>
