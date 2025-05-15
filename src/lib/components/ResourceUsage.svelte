<script lang="ts">
	import type { ResourceUsage } from '$lib/types';
	import { format } from 'date-fns';
	import Chart from '$lib/components/Chart.svelte';

	const {
		resourceUsage
	}: {
		resourceUsage: ResourceUsage;
	} = $props();

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const value = bytes / Math.pow(k, i);
		return `${value.toFixed(1)} ${sizes[i]}`;
	}

	const data = $derived.by(() =>
		resourceUsage.memoryUsage?.sort((a, b) => a.createdAt - b.createdAt)
	);

	const xAxis = $derived.by(
		() => data?.map((m) => format(new Date(m.createdAt), 'yyyy-MM-dd HH:mm:ss')) ?? []
	);

	const lowestAvailableHeapSpace = $derived.by(
		() =>
			data?.reduce(
				(acc, cur) => (cur.availableHeapSpace < acc ? cur.availableHeapSpace : acc),
				Number.MAX_SAFE_INTEGER
			) ?? 0
	);
</script>

<div class="grid w-full grid-cols-3 gap-2">
	<Chart
		class=""
		id="memory-usage-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			xAxis: {
				type: 'category',
				data: xAxis
			},
			yAxis: [
				{
					axisLabel: {
						formatter: formatBytes
					}
				}
			],
			series: [
				{
					data: data?.map((m) => m.totalMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Total'
				},
				{
					data: data?.map((m) => m.usedMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Used'
				},
				{
					data: data?.map((m) => m.freeMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Free'
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="heap-space-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			xAxis: {
				type: 'category',
				data: xAxis
			},
			yAxis: {
				min: lowestAvailableHeapSpace * 0.98,
				axisLabel: {
					formatter: formatBytes
				}
			},
			series: [
				{
					data: data?.map((m) => m.maxMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Max space'
				},
				{
					data: data?.map((m) => m.availableHeapSpace) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Available'
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="all-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			xAxis: {
				type: 'category',
				data: xAxis
			},
			yAxis: {
				type: 'value',
				//min: lowestAvailableHeapSpace * 0.98,
				axisLabel: {
					formatter: formatBytes
				}
			},
			series: [
				{
					data: data?.map((m) => m.maxMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Max space'
				},
				{
					data: data?.map((m) => m.availableHeapSpace) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Available'
				},
				{
					data: data?.map((m) => m.totalMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Total'
				},
				{
					data: data?.map((m) => m.usedMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Used'
				},
				{
					data: data?.map((m) => m.freeMemory) ?? [],
					type: 'line',
					areaStyle: {},
					name: 'Free'
				}
			]
		}}
	/>
</div>
