import { type ServiceResponse } from '$lib/authService';
import { sessionStore } from '$lib/store';
import { get } from 'svelte/store';
import type { LayoutData } from '../$types';
import { baseUrl, type FetchFn, type Team } from '$lib/teamService';
import type { LoadEvent } from '@sveltejs/kit';

export const load: LayoutData = async ({ fetch }: LoadEvent) => {
	const sessionId = get(sessionStore);
	const authenticated = await validateSession(sessionId, fetch);
	const teamRes = await getTeams(sessionId, fetch);
	const teams = teamRes.success ? teamRes.data : [];

	console.log({ sessionId, authenticated });
	if (authenticated.success) {
		sessionStore.set(authenticated.data);
	} else {
		sessionStore.set('');
	}

	return {
		sessionId: authenticated.success ? authenticated.data : '',
		authenticated: authenticated.success,
		teams
	};
};

async function getTeams(
	sessionId: string,
	fetchFn: FetchFn = fetch
): Promise<ServiceResponse<Team[]>> {
	try {
		const res = await fetchFn(`${baseUrl}/app/v1/teams`, {
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

			return {
				success: false,
				errorMessage
			};
		}

		const body = await res.json();
		if (body.teams === undefined || !Array.isArray(body.teams)) {
			return {
				success: false,
				errorMessage: 'No or malformed teams returned'
			};
		}

		return {
			success: true,
			data: body.teams
		};
	} catch (e) {
		const errorMessage = (e as Error).message ?? 'Unknown error';
		return {
			success: false,
			errorMessage,
			error: e as Error
		};
	}
}

async function validateSession(
	sessionId: string | undefined,
	fetchFn: FetchFn
): Promise<ServiceResponse<string>> {
	const res = await fetchFn(`${baseUrl}/auth/validate`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${sessionId}`,
			'Content-Type': 'application/json'
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

		return {
			success: false,
			errorMessage
		};
	}

	const body = await res.json();
	if (body.sessionId === undefined) {
		return {
			success: false,
			errorMessage: 'Malformed server response'
		};
	}

	return {
		success: true,
		data: body.sessionId
	};
}
