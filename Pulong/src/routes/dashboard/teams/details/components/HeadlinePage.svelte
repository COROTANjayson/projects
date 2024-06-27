<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import HeadlineList from '../../../headlines/HeadlineList.svelte';
	import { page } from '$app/stores';
	import { getHeadlineList, headlineList } from '$lib/stores/ItemListstore';
	import { onNewForm } from '$lib/stores/forms';
	import { IconCirclePlus } from '@tabler/icons-svelte';
	$: teamId = $page.params.id;
	interface Props {
		data?: any;
	}
	export let data: Props['data'];
	export let skeletonDivNum = 5;

	$: headlines = $headlineList as any[];

	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getHeadlineList({ teamId: teamId, isComplete: false });
		isLoading = false;
	});
</script>

<div class="px-5 space-y-4">
	<div class="flex justify-between items-center">
		<p class="text-xl">Headlines</p>
		<button
			on:click={() => {
				onNewForm('Headline');
			}}
			class="btn items-center hover:bg-slate-50/20 rounded-lg"
		>
			<IconCirclePlus class=" text-primary-500 " />
			<p class="font-medium">Add Headline</p>
		</button>
	</div>
	{#if isLoading}
		<SkeletonList number={skeletonDivNum} />
	{:else if headlines.length > 0}
	<div>
		<HeadlineList team={teamId} list={headlines} endpoint={'headlines'} />
	</div>

		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
