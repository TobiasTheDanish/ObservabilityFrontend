import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { baseUrl, type FetchFn } from '$lib/teamService';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	try {
		const dataSessionId = parseInt(params.id);
		const { sessionId } = await parent();

		return {
			sessionData: await fetchSessionData(dataSessionId, sessionId, fetch)
		};
	} catch (e) {
		console.error(e);
		error(404, 'Invalid id');
	}
};

async function fetchSessionData(dataSessionId: number, sessionId: string, fetchFn: FetchFn) {
	try {
		const res = await fetchFn(`${baseUrl}/app/v1/sessions/${dataSessionId}`, {
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});
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
		if (body.data === undefined) {
			error(500, 'Malformed server response');
		}

		return body.data;
	} catch (e) {
		error(500, (e as Error).message ?? 'Error fetching session data');
	}
}
