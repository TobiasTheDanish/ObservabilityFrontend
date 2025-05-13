import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { ServiceResponse, FetchFn, Application } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: LayoutLoad = async ({ params, parent, fetch }) => {
	try {
		const teamId = parseInt(params.teamId);
		const parentData = await parent();
		const apps = await getApps(teamId, parentData.sessionId, fetch);

		if (!apps.success) {
			error(500, apps.errorMessage);
		}

		return {
			selectedTeam: parentData.teams.find((t) => t.id === teamId),
			apps: apps.data
		};
	} catch (e) {
		error(404, 'not found');
	}
};

async function getApps(
	teamId: number,
	sessionId: string,
	fetchFn: FetchFn = fetch
): Promise<ServiceResponse<Application[]>> {
	try {
		const res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/teams/${teamId}/apps`, {
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
		if (body.apps === undefined || !Array.isArray(body.apps)) {
			return {
				success: false,
				errorMessage: 'No or malformed apps returned'
			};
		}

		return {
			success: true,
			data: body.apps
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
