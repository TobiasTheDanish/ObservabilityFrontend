<script lang="ts">
	import type { Action } from 'svelte/action';
	import * as echarts from 'echarts/core';
	import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
	import { LineChart } from 'echarts/charts';
	import { CanvasRenderer } from 'echarts/renderers';
	import { format } from 'date-fns';
	echarts.use([GridComponent, LineChart, CanvasRenderer, LegendComponent, TooltipComponent]);

	const {
		resourceUsage
	}: {
		resourceUsage: ResourceUsage;
	} = $props();

	const xAxis =
		resourceUsage.memoryUsage?.map((m) => format(new Date(m.createdAt * 1000), 'HH:mm:ss')) ?? [];
	const memoryChartAction: Action<HTMLDivElement, ECOption> = (node, option) => {
		const freeMemoryChart = echarts.init(node, null, {
			width: node.clientWidth,
			height: node.clientHeight
		});

		freeMemoryChart.setOption(option);
	};
</script>

<div class="grid min-h-[350px] w-full grid-cols-3 gap-2">
	<div
		id="free-memory-chart"
		use:memoryChartAction={{
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
					min: 0,
					max: resourceUsage.memoryUsage?.reduce(
						(acc, cur) => (acc < cur.maxMemory ? cur.maxMemory : acc),
						0
					)
				}
			],
			series: [
				{
					data: resourceUsage?.memoryUsage?.map((m) => m.freeMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	></div>
	<div
		id="used-memory-chart"
		use:memoryChartAction={{
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
					min: 0,
					max: resourceUsage.memoryUsage?.reduce(
						(acc, cur) => (acc < cur.maxMemory ? cur.maxMemory : acc),
						0
					)
				}
			],
			series: [
				{
					data: resourceUsage?.memoryUsage?.map((m) => m.usedMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	></div>
	<div
		id="total-memory-chart"
		use:memoryChartAction={{
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
					min: 0,
					max: resourceUsage.memoryUsage?.reduce(
						(acc, cur) => (acc < cur.maxMemory ? cur.maxMemory : acc),
						0
					)
				}
			],
			series: [
				{
					data: resourceUsage?.memoryUsage?.map((m) => m.totalMemory) ?? [],
					type: 'line',
					areaStyle: {}
				}
			]
		}}
	></div>
</div>
