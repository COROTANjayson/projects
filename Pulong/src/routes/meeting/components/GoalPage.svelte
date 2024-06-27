<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import GoalsList from '../../dashboard/goals/GoalsList.svelte';
	import { page } from '$app/stores';
	import { getGoalList, goalList } from '$lib/stores/ItemListstore';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: goals = $goalList as any[];
	let teamId = data.teamMeeting.teamId;
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getGoalList({ teamId: teamId });
		isLoading = false;
	});
</script>

<div>
	{#if isLoading}
		<SkeletonList />
	{:else if goals.length > 0}
		<GoalsList team={teamId} bind:list={goals} endpoint={'goals'} />

		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
