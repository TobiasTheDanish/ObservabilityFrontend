import { get } from 'svelte/store';
import { teamService, type Team } from './teamService';
import { sessionStore } from './store';

export class TeamState {
	selected: Team | null = null;
	teams: Team[] = [];
	loading: boolean = false;
	fetch() {
		this.loading = true;
		const sessionId = get(sessionStore);
		teamService
			.getTeams(sessionId)
			.then((res) => {
				console.log({ res });
				if (res.success) {
					this.teams = res.data;
					this.selected = res.data.at(0) ?? null;
				}
			})
			.finally(() => {
				this.loading = false;
			});
	}
}

export const teamState = $state(new TeamState());

export const selectedTeam: { selected: Team | undefined } = $state({
	selected: undefined
});
