import { baseUrl } from '$lib/teamService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { FetchFn, ResourceUsage } from '$lib/types';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	const { sessionId } = await parent();
	const resourceUsage = await getResourceUsage(params.id, sessionId, fetch);
	const installationInfo = await getInfo(params.id, sessionId, fetch);

	return {
		resourceUsage,
		installationInfo
	};
};

async function getResourceUsage(
	id: string,
	sessionId: string,
	fetchFn: FetchFn
): Promise<ResourceUsage> {
	let res: Response;
	try {
		res = await fetchFn(`${baseUrl}/app/v1/installations/${id}/resources`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		console.error(e);
		error(500, (e as Error).message ?? 'Error fetching resource usage for insatallation');
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

async function getInfo(id: string, sessionId: string, fetchFn: FetchFn): Promise<any> {
	let res: Response;
	try {
		res = await fetchFn(`${baseUrl}/app/v1/installations/${id}`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
	} catch (e) {
		console.error(e);
		error(500, (e as Error).message ?? 'Error fetching info about insatallation');
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
	if (body.installation === undefined) {
		error(500, 'Malformed server response');
	}

	return body.installation;
}
