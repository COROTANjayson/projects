<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import IssueList from '../../dashboard/issues/IssueList.svelte';
	import { getIssueList, issueList } from '$lib/stores/ItemListstore';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: issue = $issueList as any[];
	let teamId = data.teamMeeting.teamId;
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getIssueList({ teamId: teamId, isComplete: false });
		isLoading = false;
	});
</script>

<div>
	{#if isLoading}
		<SkeletonList />
	{:else if issue.length > 0}
		<IssueList team={teamId} list={issue} endpoint={'issues'} />

		<!-- <TabeKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
