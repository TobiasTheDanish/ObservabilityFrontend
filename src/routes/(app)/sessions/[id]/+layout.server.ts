import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { AndroidEvent, FetchFn, ResourceUsage, Trace, TraceTreeNode } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: LayoutServerLoad = async ({ params, cookies, fetch }) => {
	const dataSessionId = params.id;
	const sessionId = cookies.get('sessionId');
	if (sessionId === undefined) {
		redirect(303, '/sign-in');
	}

	const appId = cookies.get('appId');
	if (appId == undefined) {
		const teamId = cookies.get('teamId');
		if (teamId == undefined) {
			redirect(307, '/');
		} else {
			redirect(307, `/teams/${teamId}`);
		}
	}

	const sessionData = await fetchSessionData(dataSessionId, sessionId, fetch);
	const events = await getSessionEvents(dataSessionId, sessionId, fetch);
	const traces = await getSessionTraceTree(dataSessionId, sessionId, fetch);
	const resourceUsage = await getResourceUsage(dataSessionId, sessionId, fetch);

	return {
		id: dataSessionId,
		sessionData,
		events,
		traces,
		traceTree: buildTraceTree(traces).map((root) => ({ root })),
		resourceUsage,
		appId
	};
};

async function fetchSessionData(dataSessionId: string, sessionId: string, fetchFn: FetchFn) {
	let res: Response;
	try {
		res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/sessions/${dataSessionId}`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		error(500, (e as Error).message ?? 'Error fetching session data');
	}

	if (!res.ok) {
		let body: string | any;
		if (res.headers.get('Content-type')?.includes('application/json')) {
			body = await res.json();
		} else {
			body = await res.text();
		}

		let errorMessage: string;
		if (typeof body == 'string') {
			errorMessage = body;
		} else {
			errorMessage = body.message ?? 'Unknown error';
		}

		error(res.status, errorMessage);
	}

	const body = await res.json();
	if (body.session === undefined) {
		error(500, 'Malformed server response');
	}

	return body.session;
}

async function getSessionEvents(
	id: string,
	sessionId: string,
	fetchFn: FetchFn
): Promise<AndroidEvent[]> {
	let res: Response;
	try {
		res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/sessions/${id}/events`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		console.error(e);
		error(500, (e as Error).message ?? 'Error fetching events for session');
	}

	if (!res.ok) {
		let body: string | any;
		if (res.headers.get('Content-type')?.includes('application/json')) {
			body = await res.json();
		} else {
			body = await res.text();
		}

		let errorMessage: string;
		if (typeof body == 'string') {
			errorMessage = body;
		} else {
			errorMessage = body.message ?? 'Unknown error';
		}

		error(res.status, errorMessage);
	}

	const body = await res.json();
	if (body.events === undefined) {
		error(500, 'Malformed server response');
	}

	return body.events.map((e: AndroidEvent) => ({
		...e,
		serializedData: JSON.parse(e.serializedData)
	}));
}

async function getSessionTraceTree(
	id: string,
	sessionId: string,
	fetchFn: FetchFn
): Promise<Trace[]> {
	let res: Response;
	try {
		res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/sessions/${id}/traces`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		console.error(e);
		error(500, (e as Error).message ?? 'Error fetching traces for session');
	}

	if (!res.ok) {
		let body: string | any;
		if (res.headers.get('Content-type')?.includes('application/json')) {
			body = await res.json();
		} else {
			body = await res.text();
		}

		let errorMessage: string;
		if (typeof body == 'string') {
			errorMessage = body;
		} else {
			errorMessage = body.message ?? 'Unknown error';
		}

		error(res.status, errorMessage);
	}

	const body = await res.json();
	if (body.traces === undefined) {
		error(500, 'Malformed server response');
	}

	return body.traces;
}

function buildTraceTree(traces: Trace[], parentId: string = '', depth: number = 0) {
	const roots: Trace[] = [];
	const rest: Trace[] = [];
	for (let trace of traces) {
		if (trace.parentId == parentId) {
			roots.push(trace);
		} else {
			rest.push(trace);
		}
	}
	if (roots.length == 0) {
		return [];
	}

	const uniqueRoots: Record<string, Trace[]> = {};
	for (let root of roots) {
		if (uniqueRoots[root.name] == undefined) {
			uniqueRoots[root.name] = [];
		}
		uniqueRoots[root.name].push(root);
	}

	const rootNodes: TraceTreeNode[] = Object.entries(uniqueRoots).map(([name, r]) => ({
		depth,
		name,
		data: r,
		children: r
			.map((t) => buildTraceTree(rest, t.traceId, depth + 1))
			.reduce((acc, cur) => [...acc, ...cur])
	}));

	return rootNodes;
}

async function getResourceUsage(
	id: string,
	sessionId: string,
	fetchFn: FetchFn
): Promise<ResourceUsage> {
	let res: Response;
	try {
		res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/sessions/${id}/resources`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		console.error(e);
		error(500, (e as Error).message ?? 'Error fetching resource usage for session');
	}

	if (!res.ok) {
		let body: string | any;
		if (res.headers.get('Content-type')?.includes('application/json')) {
			body = await res.json();
		} else {
			body = await res.text();
		}

		let errorMessage: string;
		if (typeof body == 'string') {
			errorMessage = body;
		} else {
			errorMessage = body.message ?? 'Unknown error';
		}

		error(res.status, errorMessage);
	}

	const body = await res.json();
	if (body.resources === undefined) {
		error(500, 'Malformed server response');
	}

	return body.resources;
}
