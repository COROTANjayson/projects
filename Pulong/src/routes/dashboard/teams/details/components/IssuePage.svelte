<script lang="ts">
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import IssueList from '../../../issues/IssueList.svelte';
	import { page } from '$app/stores';
	import { getIssueList, issueList } from '$lib/stores/ItemListstore';
	import { onNewForm } from '$lib/stores/forms';
	import { IconCirclePlus } from '@tabler/icons-svelte';
	$: teamId = $page.params.id;
	interface Props {
		data?: any;
	}
	export let data: Props['data'];
	export let skeletonDivNum = 5;

	$: issue = $issueList as any[];
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getIssueList({ teamId: teamId, isComplete: false });
		isLoading = false;
	});
</script>

<div class="px-5 space-y-4">
	<div class="flex justify-between items-center">
		<p class="text-xl">Issues</p>
		<button
			on:click={() => {
				onNewForm('Issue');
			}}
			class="btn items-center hover:bg-slate-50/20 rounded-lg"
		>
			<IconCirclePlus class=" text-primary-500 " />
			<p class="font-medium">Add Issue</p>
		</button>
	</div>
	{#if isLoading}
		<SkeletonList number={skeletonDivNum} />
	{:else if issue.length > 0}
	<div>
		<IssueList team={teamId} list={issue} endpoint={'issues'} />
	</div>

		<!-- <TabeKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
