import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AndroidEvent, FetchFn, ResourceUsage } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const dataSessionId = params.id;
	const sessionId = cookies.get('sessionId');
	if (sessionId === undefined) {
		redirect(303, '/sign-in');
	}

	const sessionData = await fetchSessionData(dataSessionId, sessionId, fetch);
	const events = await getSessionEvents(dataSessionId, sessionId, fetch);
	const resourceUsage = await getResourceUsage(dataSessionId, sessionId, fetch);

	return {
		sessionData,
		events,
		resourceUsage
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
	if (body.events === undefined) {
		error(500, 'Malformed server response');
	}

	return body.events.map((e: AndroidEvent) => ({
		...e,
		serializedData: JSON.parse(e.serializedData)
	}));
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
