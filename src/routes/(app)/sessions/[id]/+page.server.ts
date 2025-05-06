import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FetchFn } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
	const dataSessionId = params.id;
	const sessionId = cookies.get('sessionId');
	if (sessionId === undefined) {
		redirect(303, '/sign-in');
	}

	return {
		sessionData: await fetchSessionData(dataSessionId, sessionId, fetch)
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
	console.log({ body });
	if (body.session === undefined) {
		error(500, 'Malformed server response');
	}

	return body.session;
}
