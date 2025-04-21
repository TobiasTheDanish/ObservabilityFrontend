import { authService } from '$lib/authService';
import { sessionStore } from '$lib/store';
import { get } from 'svelte/store';
import type { LayoutData } from '../$types';

export const load: LayoutData = async () => {
	const sessionId = get(sessionStore);
	const authenticated = await authService.validateSession(sessionId);

	console.log({ sessionId, authenticated });

	return {
		sessionId,
		authenticated: authenticated.success && authenticated.data
	};
};
