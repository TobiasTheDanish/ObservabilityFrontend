import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { ServiceResponse } from '$lib/types';
import type { Action } from 'svelte/action';

export type SignInCallback = (res: ServiceResponse<{ sessionId: string }>) => void;

export const signIn: Action<HTMLFormElement, SignInCallback> = async (node, cb) => {
	fetch(`${PUBLIC_API_BASE_URL}/auth/sign-in`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: node.username, password: node.password })
	})
		.then((res) => {
			if (!res.ok) {
				if (res.headers.get('Content-type')?.includes('application/json')) {
					res.json().then(console.error);
				} else {
					res.text().then(console.error);
				}

				cb({
					success: false,
					errorMessage: 'Error signing in!'
				});
			} else {
				res.json().then((body) => {
					if (body?.sessionId === undefined) {
						return {
							success: false,
							errorMessage: 'No session id returned'
						};
					}

					cb({
						success: true,
						data: {
							sessionId: body.sessionId
						}
					});
				});
			}
		})
		.catch((e) => {
			const errorMessage = (e as Error).message ?? 'Unknown error';
			return {
				success: false,
				errorMessage,
				error: e as Error
			};
		});
};
