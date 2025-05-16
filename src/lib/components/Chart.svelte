<script lang="ts">
	import * as echarts from 'echarts/core';
	import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
	import { LineChart, PieChart } from 'echarts/charts';
	import { CanvasRenderer } from 'echarts/renderers';
	import type { ECOption } from '$lib/types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Action } from 'svelte/action';

	echarts.use([
		GridComponent,
		LineChart,
		PieChart,
		CanvasRenderer,
		LegendComponent,
		TooltipComponent
	]);

	type Props = HTMLAttributes<HTMLDivElement> & {
		options: ECOption;
	};

	const { options, ...rest }: Props = $props();

	const chartAction: Action<HTMLDivElement, ECOption> = (node, option) => {
		const chart = echarts.init(node, null, {
			width: node.clientWidth,
			height: node.clientHeight
		});

		chart.setOption(option);
	};
</script>

<div {...rest} use:chartAction={options}></div>
