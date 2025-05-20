import type { Trace } from '$lib/types';
import type { PageServerLoad } from './$types';

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

function buildTree(traces: Trace[]): Tree | undefined {
	const root = traces.find((t) => t.parentId == '');
	if (root == undefined) return undefined;
	const rest = traces.filter((t) => t.traceId != root.traceId);

	return {
		depth: 0,
		data: root,
		children: getChildren(rest, root.traceId, 1)
	};
}

function getChildren(traces: Trace[], parentId: string, depth: number): TreeNode[] {
	const children: Trace[] = [];
	const rest: Trace[] = [];
	for (let trace of traces) {
		if (trace.parentId == parentId) {
			children.push(trace);
		} else {
			rest.push(trace);
		}
	}
	if (children.length == 0) {
		return [];
	}

	return children.map((c) => ({
		depth,
		data: c,
		children: getChildren(rest, c.traceId, depth + 1)
	}));
}

type Tree = TreeNode;

type TreeNode = {
	depth: number;
	data: Trace;
	children: TreeNode[];
};
