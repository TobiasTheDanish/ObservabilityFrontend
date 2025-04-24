import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { baseUrl, type AppData, type FetchFn } from '$lib/teamService';
import { get } from 'svelte/store';
import { sessionStore } from '$lib/store';
import type { ServiceResponse } from '$lib/authService';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	try {
		const appId = parseInt(params.appId);

		const sessionId = get(sessionStore);
		const appDataRes = await getAppData(sessionId, appId, fetch);
		if (!appDataRes.success) {
			error(500, `Error getting app data: ${appDataRes.errorMessage}`);
		}

		const { apps } = await parent();
		const app = apps.find((a) => a.id === appId);
		if (app === undefined) {
			error(404, 'Not found');
		}

		return {
			app,
			appData: appDataRes.data
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not found');
	}
};

async function getAppData(
	sessionId: string,
	appId: number,
	fetchFn: FetchFn = fetch
): Promise<ServiceResponse<AppData>> {
	try {
		const res = await fetchFn(`${baseUrl}/app/v1/apps/${appId}`, {
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
		if (body.appData === undefined) {
			return {
				success: false,
				errorMessage: 'No app data returned'
			};
		}
		return {
			success: true,
			data: {
				...body.appData
			}
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
