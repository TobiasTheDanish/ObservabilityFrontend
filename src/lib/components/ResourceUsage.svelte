<script lang="ts">
	import type { ResourceUsage } from '$lib/types';
	import { format } from 'date-fns';
	import Chart from '$lib/components/Chart.svelte';

	const {
		resourceUsage
	}: {
		resourceUsage: ResourceUsage;
	} = $props();

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
			tooltip: {},
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
					max: maxY
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
			tooltip: {},
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
					max: maxY
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
			tooltip: {},
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
					max: maxY
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
			tooltip: {},
			legend: {},
			xAxis: {
				type: 'category',
				data: xAxis
			},
			yAxis: {
				max: maxY
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
			tooltip: {},
			legend: {},
			xAxis: {
				type: 'category',
				data: xAxis
			},
			yAxis: [
				{
					max: maxY
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
