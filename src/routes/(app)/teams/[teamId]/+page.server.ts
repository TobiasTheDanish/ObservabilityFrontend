import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	createApp: async ({ request, fetch, cookies, params }) => {
		const sessionId = cookies.get('sessionId');
		if (sessionId === undefined) {
			redirect(303, '/sign-in');
		}
		try {
			const formData = await request.formData();
			const appName = formData.get('appName');
			const teamId = parseInt(params.teamId ?? '');
			const res = await fetch(`${PUBLIC_API_BASE_URL}/app/v1/apps`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${sessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: appName,
					teamId
				})
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
			if (body.id === undefined) {
				return {
					success: false,
					errorMessage: 'No app id returned'
				};
			}
			return {
				success: true
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
} satisfies Actions;
