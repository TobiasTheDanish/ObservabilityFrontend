import { type Team } from './teamService';

export const selectedTeam: { selected: Team | undefined } = $state({
	selected: undefined
});
