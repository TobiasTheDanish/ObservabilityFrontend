<script lang="ts">
	import type { AppData } from '$lib/types';
	import type { PageProps } from './$types';
	import * as dateFns from 'date-fns';

	type InstallationUiState = AppData['installations'][0] & {
		sessions: AppData['sessions'];
	};

	const { data }: PageProps = $props();

	console.log(data);

	const sessions = $derived(data.appData.sessions);
	const installations: InstallationUiState[] = $derived.by(() =>
		data.appData.installations.map((install) => ({
			...install,
			sessions: sessions.filter((s) => s.installationId == install.id)
		}))
	);
</script>

<div class="flex flex-col gap-2">
	<p>{data.app.name}</p>

	<div>
		<p>Installations:</p>
		<div class="flex flex-col gap-2">
			{#each installations as install}
				<a href={`/installations/${install.id}`}>
					<div class="px-8">
						<p>Id: {install.id}</p>
						<p>{install.brand} {install.model}, running Android SDK level {install.sdkVersion}</p>
						<p>
							{install.sessions.filter((s) => s.crashed).length} crashes out of
							{install.sessions.length} sessions
						</p>
						<p>
							Crash ratio: {(install.sessions.filter((s) => s.crashed).length /
								install.sessions.length) *
								100}%
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<div>
		<p>Sessions:</p>
		<div class="flex flex-col gap-2">
			{#each sessions as session}
				<a href={`/sessions/${session.id}`}>
					<div class="px-8">
						<p>
							Id: {session.id}
							<span class={session.crashed ? 'text-red-500' : 'text-green-500'}>
								{#if session.crashed}
									CRASHED
								{:else}
									No crash
								{/if}
							</span>
						</p>
						<p>
							Inst.: {session.installationId}
						</p>
						<p>
							Created: {dateFns.format(session.createdAt, 'd. MMM yyyy')}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
