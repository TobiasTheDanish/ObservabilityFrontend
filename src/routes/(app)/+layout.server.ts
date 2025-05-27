import type { LayoutServerLoad } from './$types';
import type { ServiceResponse, FetchFn, Team } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ fetch, cookies, url, params }) => {
	const sessionId = cookies.get('sessionId');
	const authenticated = await validateSession(sessionId, fetch);
	if (!authenticated.success) {
		cookies.delete('sessionId', { path: '/' });
		redirect(307, '/sign-in');
	}
	cookies.set('sessionId', authenticated.data, { path: '/' });

	let selectedTeamId = cookies.get('teamId');
	if (selectedTeamId == undefined && params.teamId != undefined) {
		selectedTeamId = params.teamId;
		cookies.set('teamId', selectedTeamId, { path: '/' });
	}
	if (selectedTeamId == undefined && url.pathname != '/') {
		redirect(307, '/');
	} else if (selectedTeamId != undefined && url.pathname == '/') {
		cookies.delete('teamId', { path: '/' });
		selectedTeamId = undefined;
	}
	const teamRes = await getTeams(authenticated.data, fetch);
	const teams = teamRes.success ? teamRes.data : [];
	const selectedTeam = teams.find((t) => t.id.toString(10) == selectedTeamId);

	if (selectedTeam == undefined && url.pathname != '/') {
		redirect(307, '/');
	}

	return {
		sessionId: authenticated.data,
		teams,
		selectedTeam
	};
};

async function getTeams(
	sessionId: string,
	fetchFn: FetchFn = fetch
): Promise<ServiceResponse<Team[]>> {
	try {
		const res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/teams`, {
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
	const res = await fetchFn(`${PUBLIC_API_BASE_URL}/auth/validate`, {
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
