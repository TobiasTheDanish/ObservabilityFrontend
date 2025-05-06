import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');

	event.locals.sessionId = sessionId;

	return resolve(event);
};
