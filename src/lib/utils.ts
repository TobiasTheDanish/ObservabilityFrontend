import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GraphTree, GraphTreeNode, Trace } from '$lib/types';
import { error } from '@sveltejs/kit';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function buildTree(traces: Trace[]): GraphTree {
	const root = traces.find((t) => t.parentId == '');
	if (root == undefined) {
		console.error({ msg: 'no root found', traces });
		error(404, 'No root found');
	}
	const rest = traces.filter((t) => t.traceId != root.traceId);

	return {
		depth: 0,
		data: root,
		children: getChildren(rest, root.traceId, 1)
	};
}

function getChildren(traces: Trace[], parentId: string, depth: number): GraphTreeNode[] {
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
