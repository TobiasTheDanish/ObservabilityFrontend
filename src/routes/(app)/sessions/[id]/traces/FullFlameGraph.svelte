<script lang="ts">
	import Chart from '$lib/components/Chart.svelte';
	import type { GraphTree, GraphTreeNode } from '$lib/types';
	import { format } from 'date-fns';
	import type {
		CustomSeriesRenderItem,
		CustomSeriesRenderItemAPI,
		CustomSeriesRenderItemParams,
		CustomSeriesRenderItemReturn
	} from 'echarts';

	const { graphTrees }: { graphTrees: GraphTree[] } = $props();

	const recursionJson = (jsonObj: GraphTree[]): any[] => {
		const sorted = jsonObj.sort((a, b) => a.data.startTime - b.data.startTime);

		const data: any[] = [];

		const recur = (item: GraphTreeNode, start: number, rootDur: number) => {
			const duration = item.data.endTime - item.data.startTime;
			const temp = {
				name: item.data.traceId,
				// [level, start_val, end_val, name, percentage]
				value: [
					item.depth,
					item.data.startTime - start,
					item.data.endTime - start,
					item.data.name,
					(duration / rootDur) * 100,
					item.data.status,
					item.data.errorMessage
				],
				itemStyle: {
					color: `#${item.data.groupId.slice(0, 6)}`
				}
			};
			data.push(temp);

			for (const child of item.children || []) {
				recur(child, start, rootDur);
			}
		};

		let offset = 0;
		for (const tree of sorted) {
			const dur = tree.data.endTime - tree.data.startTime;
			recur(tree, tree.data.startTime - offset, dur);
			offset += dur + 50;
		}

		return data;
	};

	const heightOfJson = (json: GraphTree[]): number => {
		const recur = (item: GraphTreeNode): number => {
			if ((item.children || []).length === 0) {
				return item.depth;
			}

			let maxLevel = item.depth;
			for (const child of item.children!) {
				const tempLevel = recur(child);
				maxLevel = Math.max(maxLevel, tempLevel);
			}
			return maxLevel;
		};

		return Math.max(...json.map((tree) => recur(tree)));
	};

	const renderItem: CustomSeriesRenderItem = (
		params: CustomSeriesRenderItemParams,
		api: CustomSeriesRenderItemAPI
	) => {
		const level = api.value(0);
		const start = api.coord([api.value(1), level]);
		const end = api.coord([api.value(2), level]);
		const height = (((api.size && api.size([0, 1])) || [0, 20]) as number[])[1];
		const width = end[0] - start[0];

		return {
			type: 'rect',
			transition: ['shape'],
			shape: {
				x: start[0],
				y: start[1] - height / 2,
				width,
				height: height - 2 /* itemGap */,
				r: 2
			},
			style: {
				fill: api.visual('color')
			},
			emphasis: {
				style: {
					stroke: '#000'
				}
			},
			textConfig: {
				position: 'insideLeft'
			},
			textContent: {
				style: {
					text: api.value(3),
					fontFamily: 'Verdana',
					fill: '#000',
					width: width - 4,
					overflow: 'truncate',
					ellipsis: '..',
					truncateMinChar: 1
				},
				emphasis: {
					style: {
						stroke: '#000',
						lineWidth: 0.5
					}
				}
			}
		} as CustomSeriesRenderItemReturn;
	};
</script>

<Chart
	class="h-[350px]"
	options={{
		tooltip: {
			trigger: 'item',
			formatter: (params) => {
				//@ts-ignore
				const val = params.value;
				const name = val[3];
				const duration = val[2] - val[1];
				return `
			<b>${name}</b><br/>
			Status: ${val[5]}${val[5] != 'Ok' ? `: ${val[6]}` : ''}<br/>
			Duration: ${duration.toFixed(2)} ms<br/>
			Level: ${val[0]}
		`;
			}
		},
		xAxis: {
			type: 'value',
			scale: true,
			name: 'Time (ms)'
		},
		yAxis: {
			type: 'category',
			data: Array.from({ length: heightOfJson(graphTrees) + 1 }, (_, i) => `Level ${i}`)
		},
		dataZoom: [
			{
				type: 'slider',
				show: true,
				xAxisIndex: [0],
				start: 75,
				end: 100
			},
			{
				type: 'inside',
				xAxisIndex: [0],
				start: 75,
				end: 100
			}
		],
		series: [
			{
				type: 'custom',
				renderItem,
				encode: {
					x: [1, 2],
					y: 0
				},
				data: recursionJson(graphTrees)
			}
		]
	}}
/>
