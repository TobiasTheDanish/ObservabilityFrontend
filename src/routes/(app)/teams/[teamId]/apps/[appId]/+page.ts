import { error } from '@sveltejs/kit';
import type { PageLoad, PageParentData } from './$types';

export const load: PageLoad = async ({ parent, data, params }) => {
	const appId = parseInt(params.appId);

	const { apps }: PageParentData = await parent();
	const app = apps.find((a) => a.id === appId);
	if (app === undefined) {
		error(404, 'Not found');
	}

	return {
		app,
		...data
	};
};
