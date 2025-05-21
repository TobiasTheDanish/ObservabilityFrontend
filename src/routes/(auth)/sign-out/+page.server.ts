import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async (e) => {
		e.cookies.delete('sessionId', {path: '/'})

		redirect(303, '/sign-in')
	}
} satisfies Actions
