<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import GoalsList from '../../../goals/GoalsList.svelte';
	import { page } from '$app/stores';
	import { getGoalList, goalList } from '$lib/stores/ItemListstore';
	import { onNewForm } from '$lib/stores/forms';
	import { IconCirclePlus } from '@tabler/icons-svelte';
	$: teamId = $page.params.id;
	interface Props {
		data?: any;
	}
	export let data: Props['data'];
	export let skeletonDivNum = 5;

	$: goals = $goalList as any[];
	let isLoading = false;

	onMount(async () => {
		isLoading = true;
		let teamId = $page.params.id;
		await getGoalList({ teamId: teamId });

		isLoading = false;
	});
</script>

<div class="px-5 space-y-4">
	<div class="flex justify-between items-center">
		<p class="text-xl">Goals</p>
		<button
			on:click={() => {
				onNewForm('Goal');
			}}
			class="btn items-center hover:bg-slate-50/20 rounded-lg"
		>
			<IconCirclePlus class=" text-primary-500 " />
			<p class="font-medium">Add Goal</p>
		</button>
	</div>
	{#if isLoading}
		<SkeletonList number={skeletonDivNum} />
	{:else if goals.length > 0}
		<div>
			<GoalsList team={teamId} list={goals} endpoint={'goals'} />
		</div>
		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
