import type { PageServerLoad } from './$types';
import { buildTree } from '$lib/utils';

export const load: PageServerLoad = async ({ params, parent }) => {
	const groupId = params.groupId;
	const { traces } = await parent();

	const groupedTraces = traces.filter((t) => t.groupId == groupId);
	const tree = buildTree(groupedTraces);
	return {
		traces: groupedTraces,
		tree
	};
};
