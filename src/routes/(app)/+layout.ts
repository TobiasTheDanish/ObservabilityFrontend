import { authService } from '$lib/authService';
import { sessionStore } from '$lib/store';
import { get } from 'svelte/store';
import type { LayoutData } from '../$types';
import { teamService } from '$lib/teamService';
import type { LoadEvent } from '@sveltejs/kit';

export const load: LayoutData = async ({ fetch }: LoadEvent) => {
	const sessionId = get(sessionStore);
	const authenticated = await authService.validateSession(sessionId);
	const teamRes = await teamService.getTeams(sessionId, fetch);
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
