import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { teamService } from '$lib/teamService';
import { get } from 'svelte/store';
import { sessionStore } from '$lib/store';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	try {
		const appId = parseInt(params.appId);

		const sessionId = get(sessionStore)
		const appDataRes = await teamService.getAppData(sessionId, appId, fetch)
		if (!appDataRes.success) {
			error(500, `Error getting app data: ${appDataRes.errorMessage}`)
		}

		const { apps } = await parent();
		const app = apps.find((a) => a.id === appId);
		if (app === undefined) {
			error(404, 'Not found');
		}

		return {
			app,
			appData: appDataRes.data,
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not found');
	}
};
