import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const sessionId = cookies.get('sessionId');
	if (sessionId !== undefined) {
		redirect(303, '/');
	}
};

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		try {
			const formData = await request.formData();
			const username = formData.get('username');
			const password = formData.get('password');

			const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/sign-in`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			if (!res.ok) {
				let body: any;
				if (res.headers.get('Content-type')?.includes('application/json')) {
					body = await res.json();
				} else {
					body = await res.text();
				}

				let errorMessage: string;
				if (typeof body == 'string') {
					errorMessage = body;
				} else {
					errorMessage = body.message;
				}

				return {
					success: false,
					errorMessage
				};
			}
			const body = await res.json();
			if (body?.sessionId === undefined) {
				return {
					success: false,
					errorMessage: 'No session id returned'
				};
			}

			cookies.set('sessionId', body.sessionId, { path: '/' });
		} catch (e) {
			const errorMessage = (e as Error).message ?? 'Unknown error';
			return {
				success: false,
				errorMessage,
				error: e as Error
			};
		}

		redirect(303, '/');
	}
} satisfies Actions;
