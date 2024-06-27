<script lang="ts">
	import type { PageData } from './$types';
	import { IconPlus } from '@tabler/icons-svelte';
	export let data: PageData;
	import { onNewForm } from '$lib/stores/forms';
	import _ from 'lodash';
	import DropDown from '$lib/components/DropDown.svelte';
	import GoalsList from './GoalsList.svelte';
	import { isDeleteModalOpen } from '$lib/stores/sideBar';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import NoDisplay from '$lib/components/NoDisplay.svelte';
	import { getGoalList, goalList, toastContent } from '$lib/stores/ItemListstore';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';

	// $: goals = data.goals ? data.goals : [];
	$: goals = $goalList;
	let toastStore = getToastStore();

	$: {
		if ($toastContent) {
			toastStore.trigger($toastContent);
			toastContent.set(undefined);
		}
	}
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getGoalList();
		isLoading = false;
	});
	const getTeamName = (teamId: string) => {
		let team = _.find(data.teams, { id: teamId });
		return team.name;
	};
	const groupedGoalsByTeamId = () => {
		let arrayList = goals.reduce((acc: any, obj: any) => {
			const { teamId, ...rest } = obj;
			acc[teamId] = acc[teamId] || [];
			acc[teamId].push(rest);
			return acc;
		}, {});

		return arrayList;
	};
	let groupedRock: any[] = [];
	let teamIds: any[] = [];
	let teamIdsFilter: any[] = [];
	$: {
		if (goals) {
			groupedRock = groupedGoalsByTeamId();
			teamIds = Object.keys(groupedRock);
		}
	}

	let teamFilter = 'All';
	$: {
		if (teamFilter == 'All') {
			teamIdsFilter = teamIds;
		} else {
			teamIdsFilter = teamIds.filter((element) => element === teamFilter);
		}
	}
</script>

{#if $isDeleteModalOpen}
	<DeleteModal />
{/if}

<div class="w-full relative">
	<div
		class="px-5 sticky top-0 right-0 w-full h-[60px] dark:bg-surface-900 bg-surface-200 shadow-md z-20 flex justify-between items-center"
	>
		<DropDown list={data.teams} bind:value={teamFilter} name={'team_filter'} />
		<button
			on:click={() => {
				onNewForm('Goal');
			}}
			type="button"
			class={`btn  variant-filled-primary flex justify-between  rounded-md h-[44px]  dark:text-white font-semibold`}
		>
			<span class="text-xl">ADD</span>
			<span><IconPlus size={25} /></span>
		</button>
	</div>
	{#if isLoading}
		<div class="px-5 py-3">
			<SkeletonList />
		</div>
	{:else if teamIdsFilter.length <= 0}
		<NoDisplay label="Goals" />
	{:else}
		<div class="w-full space-y-3 px-5 py-3">
			{#each teamIdsFilter as team}
				<div class="space-y-2">
					<p class="font-normal text-xl uppercase tracking-widest">
						{getTeamName(team)}
					</p>
					<div>
						<GoalsList {team} list={groupedRock[team]} endpoint={undefined} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
