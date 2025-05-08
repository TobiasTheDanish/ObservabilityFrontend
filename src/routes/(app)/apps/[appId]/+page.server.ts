import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ServiceResponse, AppData, FetchFn, Application } from '$lib/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	let appId;
	try {
		appId = parseInt(params.appId);
	} catch (e) {
		console.error(e);
		error(404, 'Not found');
	}

	const sessionId = cookies.get('sessionId');
	if (sessionId === undefined) {
		redirect(303, '/sign-in');
	}

	const appDataRes = await getAppData(sessionId, appId, fetch);
	if (!appDataRes.success) {
		error(500, `Error getting app data: ${appDataRes.errorMessage}`);
	}

	return appDataRes.data;
};

async function getAppData(
	sessionId: string,
	appId: number,
	fetchFn: FetchFn = fetch
): Promise<ServiceResponse<{ appData: AppData; app: Application }>> {
	try {
		const res = await fetchFn(`${PUBLIC_API_BASE_URL}/app/v1/apps/${appId}`, {
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
		if (body.app === undefined) {
			return {
				success: false,
				errorMessage: 'No app data returned'
			};
		}
		if (body.appData === undefined) {
			return {
				success: false,
				errorMessage: 'No app data returned'
			};
		}
		return {
			success: true,
			data: {
				app: body.app,
				appData: body.appData
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
