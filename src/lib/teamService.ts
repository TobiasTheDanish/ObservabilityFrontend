import type { ServiceResponse } from './authService';

export const baseUrl = 'http://jsoc4ws48so0g48gko0s8ocg.78.46.170.16.sslip.io';
// export const baseUrl = 'http://localhost:8080';

export type Team = {
	id: number;
	name: string;
};

export type Application = {
	id: number;
	name: string;
};

export type AppData = {
	installations: {
		id: string;
		sdkVersion: number;
		model: string;
		brand: string;
	}[];
	sessions: {
		id: string;
		installationId: string;
		createdAt: number;
		crashed: boolean;
	}[];
};

export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export const teamService = {
	createApp: async function(
		sessionId: string,
		teamId: number,
		appName: string,
		fetchFn: FetchFn = fetch
	): Promise<ServiceResponse<Application>> {
		try {
			const res = await fetchFn(`${baseUrl}/app/v1/apps`, {
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
				success: true,
				data: {
					id: body.id,
					name: appName
				}
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
