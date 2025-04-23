import type { ServiceResponse } from './authService';

const baseUrl = 'http://localhost:8080';

export type Team = {
	id: number;
	name: string;
};

export type Application = {
	id: number;
	name: string;
}

export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export const teamService = {
	getTeams: async function(
		sessionId: string,
		fetchFn: FetchFn = fetch
	): Promise<ServiceResponse<Team[]>> {
		try {
			const res = await fetchFn(`${baseUrl}/app/v1/teams`, {
				headers: {
					Authorization: `Bearer ${sessionId}`
				}
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
			if (body.teams === undefined || !Array.isArray(body.teams)) {
				return {
					success: false,
					errorMessage: 'No or malformed teams returned'
				};
			}

			return {
				success: true,
				data: body.teams
			};
		} catch (e) {
			const errorMessage = (e as Error).message ?? 'Unknown error';
			return {
				success: false,
				errorMessage,
				error: e as Error
			};
		}
	},
	getApps: async function(
		teamId: number,
		sessionId: string,
		fetchFn: FetchFn = fetch,
	): Promise<ServiceResponse<Application>> {
		try {
			const res = await fetchFn(`${baseUrl}/app/v1/teams/${teamId}/apps`, {
				headers: {
					Authorization: `Bearer ${sessionId}`
				}
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
			if (body.apps === undefined || !Array.isArray(body.apps)) {
				return {
					success: false,
					errorMessage: 'No or malformed apps returned'
				};
			}

			return {
				success: true,
				data: body.apps
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
};
