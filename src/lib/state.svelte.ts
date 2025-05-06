import type { Team } from '$lib/types';

export const selectedTeam: { selected: Team | undefined } = $state({
	selected: undefined
});
