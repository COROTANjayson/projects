<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import HeadlineList from '../../dashboard/headlines/HeadlineList.svelte';
	import { getHeadlineList, headlineList } from '$lib/stores/ItemListstore';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: headlines = $headlineList as any[];
	let teamId = data.teamMeeting.teamId;
	let isLoading = false;


	onMount(async () => {
		isLoading = true;
		await getHeadlineList({ teamId: teamId, isComplete:false });
		isLoading = false;
	});
</script>

<div>
	{#if isLoading}
		<SkeletonList />
	{:else if headlines.length > 0}
		<HeadlineList team={teamId} list={headlines} endpoint={'headlines'} />

		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
