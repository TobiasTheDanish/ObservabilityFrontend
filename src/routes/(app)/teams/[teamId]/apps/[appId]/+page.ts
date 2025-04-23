import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	try {
		const appId = parseInt(params.appId);
		const { apps } = await parent();
		const app = apps.find((a) => a.id === appId);
		if (app === undefined) {
			error(404, 'Not found');
		}

		return {
			app
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not found');
	}
};
