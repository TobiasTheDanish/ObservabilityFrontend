const baseUrl = 'http://jsoc4ws48so0g48gko0s8ocg.78.46.170.16.sslip.io';
// const baseUrl = 'http://localhost:8080';

export type ServiceErrorResponse<E extends Error> = {
	success: false;
	errorMessage: string;
	error?: E;
};

export type ServiceSuccessResponse<T> = {
	success: true;
	data: T;
};

export type ServiceResponse<T = unknown, E extends Error = Error> =
	| ServiceSuccessResponse<T>
	| ServiceErrorResponse<E>;

export const authService = {
	signIn: async function(
		username: string,
		password: string
	): Promise<ServiceResponse<{ sessionId: string }>> {
		try {
			const res = await fetch(`${baseUrl}/auth/sign-in`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
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
			if (body?.sessionId === undefined) {
				return {
					success: false,
					errorMessage: 'No session id returned'
				};
			}

			return {
				success: true,
				data: {
					sessionId: body.sessionId
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
