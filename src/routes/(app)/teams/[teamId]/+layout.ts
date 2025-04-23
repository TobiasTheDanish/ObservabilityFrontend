import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { teamService } from '$lib/teamService';

export const load: LayoutLoad = async ({ params, parent, fetch }) => {
	try {
		const teamId = parseInt(params.teamId);
		const parentData = await parent();
		const apps = await teamService.getApps(teamId, parentData.sessionId, fetch);

		console.log({ teamId, parentData, apps });

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
