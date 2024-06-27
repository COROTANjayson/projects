<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import TableKpi from '../../../kpi/TableKPI.svelte';
	import { page } from '$app/stores';
	import { getKPIList, kpiList } from '$lib/stores/ItemListstore';
	import { IconCirclePlus } from '@tabler/icons-svelte';
	import { onNewForm } from '$lib/stores/forms';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];
	export let skeletonDivNum = 5
	$: kpi = $kpiList as any[];

	$: teamId = $page.params.id;
	let isLoading = false;

	onMount(async () => {
		isLoading = true;
		await getKPIList({ teamId: teamId });
		isLoading = false;
	});
</script>

<div class="px-5 space-y-4">
	<div class="flex justify-between items-center">
		<p class="text-xl">KPI</p>
		<button
			on:click={() => {
				onNewForm('KPI');
			}}
			class="btn items-center hover:bg-slate-50/20 rounded-lg"
		>
			<IconCirclePlus class=" text-primary-500 " />
			<p class="font-medium">Add KPI</p>
		</button>
	</div>
	<div>
		{#if isLoading}
			<SkeletonList number={skeletonDivNum}/>
		{:else if kpi.length > 0}
			<TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} endpoint={'kpi'} />
		{/if}
	</div>
</div>
