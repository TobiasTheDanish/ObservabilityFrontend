import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies }) => {
	const sessionId = cookies.get('sessionId');
	console.log({ sessionId });
	locals.sessionId = sessionId;
	return {
		sessionId: locals.sessionId
	};
};
