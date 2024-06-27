<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import TableKpi from '../../dashboard/kpi/TableKPI.svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import { getKPIList, kpiList } from '$lib/stores/ItemListstore';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: kpi = $kpiList as any[];
	let teamId = data.teamMeeting.teamId;
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getKPIList({ teamId: teamId });
		isLoading = false;
	});
</script>

<div>
	{#if isLoading}
		<SkeletonList />
	{:else if kpi.length > 0}
		<TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} endpoint={'kpi'} />
	{/if}
</div>
