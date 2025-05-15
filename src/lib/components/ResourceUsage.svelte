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

	const largestMax = $derived.by(
		() => data?.reduce((acc, cur) => (acc < cur.maxMemory ? cur.maxMemory : acc), 0) ?? 0
	);
	const maxY = $derived(largestMax + (10 - (largestMax % 10)));
</script>

<div class="grid w-full grid-cols-3 gap-2">
	<Chart
		class="h-[250px]"
		id="free-memory-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			title: {
				text: 'Free memory'
			},
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
					data: data?.map((m) => m.freeMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="used-memory-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			title: {
				text: 'Used memory'
			},
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
					data: data?.map((m) => m.usedMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="total-memory-chart"
		options={{
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value) => formatBytes(value as number)
			},
			legend: {},
			title: {
				text: 'Total memory'
			},
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
					areaStyle: {}
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="max-memory-chart"
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
				axisLabel: {
					formatter: formatBytes
				}
			},
			series: [
				{
					data: data?.map((m) => m.maxMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	/>
	<Chart
		class="h-[250px]"
		id="available-heap-space-chart"
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
					data: data?.map((m) => m.availableHeapSpace) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	/>
</div>
