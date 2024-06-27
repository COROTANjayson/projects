<script lang="ts">
	import _ from 'lodash';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import {
		dashboard_details,
		isDashboardDetailsOpen,
		isDeleteDashboardOpen,
		isOpenModal,
		isShareOpen
	} from '$lib/store/reportingStore';
	import { PUBLIC_URL } from '$env/static/public';
	import { chartList, chart_method, emptyChartData } from '$lib/store/chartStore';

	import DeletePrompt from './DeletePrompt.svelte';
	import ShareDashboardModal from './ShareDashboardModal.svelte';
	import EditDashboardDetails from './EditDashboardDetails.svelte';
	import AddChartModal from './AddChartModal.svelte';
	import ChartCard from './ChartCard.svelte';

	export let data: PageData;

	dashboard_details.set(data.dashboard_details);

	let charts: any[] = [];
	let isLoading = false;
	let skeleton: any = [0, 0, 0, 0];

	onMount(async () => {
		const currentDate = new Date();
		let dasboard_data = {
			...data.dashboard_details,
			viewed_at: currentDate.toISOString()
		};
		if (data.dashboard_details) {
			const response: any = await axios.put(PUBLIC_URL + `/reports/${data.dashboard_details.id}`, {
				...dasboard_data
			});
		}
	});
	let isOwner: boolean = false;
	onMount(() => {
		isOwner = $dashboard_details.owner === data.user_data.id;
	});
	onMount(async () => {
		isLoading = true;
		await fetchCharts();
		isLoading = false;
		// let projects: any[] = [];
		// let user: any[] = [];
		// charts.forEach((val: any) => {
		// 	if (val.include_from === 'Teams') {
		// 		val.include_from_array.forEach((element: any) => {
		// 			let filteredData = data.allProject.filter(
		// 				(item: any) => item.team.name === element.name
		// 			);
		// 			projects = [...projects, ...filteredData];
		// 		});
		// 	}
		// 	if (val.include_from === 'Projects owned by') {
		// 		let new_included_array = val.include_from_array.forEach((element: any) => {
		// 			// if (!element.fetch) {
		// 			element.fetch = true;
		// 			let filteredData = data.allProject.filter((item: any) => item.owner.gid === element.gid);
		// 			projects = [...projects, ...filteredData];
		// 			return element;
		// 		});
		// 	}

		// 	if (val.include_from === 'Specific projects') {
		// 		projects = [...val.include_from_array, ...projects];
		// 	}

		// 	if (val.filters && val.filters.length > 0) {
		// 		const assignees = _.find(val.filters, { name: 'Assignee' });

		// 		if (assignees && assignees.assignees) {
		// 			user = [...assignees.assignees, ...user];
		// 		}
		// 		const creators = _.find(val.filters, { name: 'Creators' });
		// 		if (creators) {
		// 			user = [...creators, ...user];
		// 		}
		// 	}
		// });

		// projects = mergeArraywithGID(projects);
	});
	$: {
		if (!$isOpenModal) {
			fetchCharts()

		}
	}
	const fetchCharts = async () => {
		isLoading = true;

		if (data.dashboard_details) {
			const response: any = await axios.get(PUBLIC_URL + '/charts', {
				params: { dashboard_id: data.dashboard_details.id }
			});
			const result = response.data;
			charts = result.data;
			chartList.set(charts)
			isLoading = false;
			return charts;
		}
	};
	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
	// const deleteDashboard = async () => {
	// 	const response: any = await axios.delete(PUBLIC_URL + `/reports/${data.dashboard_details.id}`);
	// 	let result = response.data;
	// 	if (result && result.success) {
	// 		// await fetchCharts();
	// 		goto('/reporting');
	// 	}
	// };
</script>

<div class=" h-full">
	<div class=" flex justify-between border-b pb-2">
		<div class="space-y-1">
			<button
				on:click={() => {
					goto('/reporting');
				}}
				class="text-sm hover:font-medium hover:underline flex gap-1"
			>
				<p>Reporting</p>
				<img src="/arrow-right.svg" alt="" />
			</button>

			<div class="flex gap-1">
				<h1 class=" text-xl font-bold">{$dashboard_details.name ? $dashboard_details.name : ''}</h1>
				{#if isOwner}
					<div class="dropdown">
						<div tabindex="0" role="button" class=" m-1">
							<img src="/arrow-down.svg" alt="" width="30" />
						</div>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<div
							tabindex="0"
							class="dropdown-content z-[1] menu p-0 shadow w-52 border space-y-2 bg-white rounded"
						>
							<button
								class="px-4 py-2 hover:bg-slate-100 text-left"
								on:click={() => {
									handleClick();
									isDashboardDetailsOpen.set(true);
								}}><p>Edit Dashboard details</p></button
							>
							<button
								class="p-4 py-2 hover:bg-slate-100 text-red-700 text-left"
								on:click={() => {
									isDeleteDashboardOpen.set(true);
									handleClick();

									// deleteDashboard();
								}}><p>Delete Dashboard</p></button
							>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<button
			on:click={() => {
				isShareOpen.set(true);
			}}
			class="bg-blue-400 hover:bg-blue-500 btn btn-sm border-none rounded-md px-2 py-1"
		>
			<div class="flex items-center gap-2">
				<img src="/add_user.svg" width="16" alt="" />
				<h6 class="text-white font-medium">Add members</h6>
			</div>
		</button>
	</div>
	<div class="py-4 border-b">
		<button
			on:click={() => {
				isOpenModal.set(true);
				chart_method.set('create');
				emptyChartData();
			}}
			class="bg-blue-400 hover:bg-blue-500 btn btn-sm border-none rounded-md px-2 py-1"
		>
			<div class="flex items-center gap-1">
				<img src="/plus.svg" width="16" alt="" />
				<h6 class="text-white font-medium">Add Chart</h6>
			</div>
		</button>
	</div>
	<div class="py-6">
		<div class="grid rid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#if isLoading}
				{#each skeleton as dashboards}
					<div
						class="h-[130px] bg-slate-200 rounded-lg flex flex-col items-center px-2 py-2 animate-pulse"
					></div>
				{/each}
			{:else}
				{#each $chartList as chart}
					<ChartCard {chart} {data} {fetchCharts} />
				{/each}
			{/if}
		</div>
	</div>
</div>
{#if $isDashboardDetailsOpen}
	<EditDashboardDetails {data} />
{/if}
{#if $isDeleteDashboardOpen}
	<DeletePrompt {data} />
{/if}

{#if $isOpenModal}
	<AddChartModal {data} {fetchCharts} />
{/if}

{#if $isShareOpen}
	<ShareDashboardModal {data} />
{/if}
