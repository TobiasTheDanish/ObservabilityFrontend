<script lang="ts">
	import Chart from '$lib/components/Chart.svelte';

	const {
		data
	}: {
		data: {
			id: string;
			sessions: number;
		}[];
	} = $props();
</script>

<Chart
	class="h-[250px]"
	options={{
		series: [
			{
				type: 'pie',
				data: data.map((d) => ({ value: d.sessions, name: d.id })),
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '20',
						fontWeight: 'bold'
					}
				}
			}
		]
	}}
/>
