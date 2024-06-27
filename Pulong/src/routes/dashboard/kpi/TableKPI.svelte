<script lang="ts">
	import {
		creatorName,
		editForm,
		formName,
		kpiData,
		onNewForm,
		relatedFrom
	} from '$lib/stores/forms';

	import { getDatesByDay } from '$lib/utils/formatDate';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import { sideBarRight } from '$lib/stores/sideBar';
	import MenuRowKpi from './MenuRowKPI.svelte';
	import RowKpi from './RowKPI.svelte';

	// import { APP_URL } from '$env/static/private';
	interface Props {
		teamId: string;
		data: any;
		groupedTeam?: any[];
		list?: any[];
		endpoint?: string;
	}
	export let teamId: Props['teamId'];
	export let data: Props['data'];
	export let groupedTeam: Props['groupedTeam'];
	export let list: Props['list'];
	export let endpoint: Props['endpoint'];
	let team = _.find(data.teams, { id: teamId });
	$: kpiList = groupedTeam ? groupedTeam[team.id] : list;
	let dates = getDatesByDay(team.weekly_start_day.toLowerCase(), 3, 0) as any[];

	const handleUpdate = (data: any) => {
		let formData = {
			id: data.id,
			name: data.name,
			ownerId: data.ownerId,
			teamId: data.team.id,
			unitOfMeasure: data.unitOfMeasure,
			operator: data.operator,
			goal: data.goal,
			creatorId: data.creatorId
		};
		creatorName.set(data.creator.name);

		kpiData.set(formData);
		sideBarRight.set(true);
		formName.set('KPI');
		editForm.set(true);
	};
	const handleNewRelatedKPI = (value: any, type: string) => {
		relatedFrom.set({
			kpiId: value.id,
			name: value.name
		});
		onNewForm(type, true);
	};

	function convertDateFormat(dateString: any) {
		const [year, month, day] = dateString.split('-');
		return `${month}/${day}`;
	}

	let scrollContainer: HTMLDivElement | null = null;
	onMount(() => {
		if (scrollContainer) {
			// Scroll to the end of the container when the component mounts
			scrollContainer.scrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		}
	});
</script>

<div bind:this={scrollContainer} class="flex gap-1 mb-3 relative overflow-x-auto dark:text-black">
	<div>
		<!-- Header -->
		<div class="flex bg-white">
			<div class=" bg-white sticky left-0 flex flex-col items-start bg-border-white">
				<div class="flex">
					<div class="w-48 h-[70px] flex items-center border-b-2">
						<p class="mx-6">NAME</p>
					</div>
					<div class=" h-[70px] w-[80px] flex items-center justify-center bg-primary-500">
						<p class="text-white">Goal</p>
					</div>
				</div>
			</div>
			{#each dates as date, i}
				{#if dates.length !== i + 1}
					<div class="bg-white">
						<div
							class={`h-[70px] w-[80px] flex items-center justify-center border-b-2 border ${dates.length === i + 1 ? 'bg-black border-black text-white ' : ''}`}
						>
							{convertDateFormat(date.date)}
						</div>
					</div>
				{:else}
					<div class="bg-white sticky right-0 flex">
						<div
							class={`h-[70px] w-[80px] flex items-center justify-center border-b-2 border ${dates.length === i + 1 ? 'bg-black border-black text-white ' : ''}`}
						>
							{convertDateFormat(date.date)}
						</div>
						<div class=" bg-white flex-col items-center w-[150px] h-[70px] border-b-2"></div>
					</div>
				{/if}
			{/each}
		</div>
		<!-- Header End -->
		<!-- Row  -->
		<div class="flex">
			<div>
				{#each kpiList as item, i}
					<RowKpi {item} />
				{/each}
			</div>

			<div class="sticky right-0 bg-white">
				{#each kpiList as item, i}
					<MenuRowKpi
						{endpoint}
						{teamId}
						{item}
						index={i}
						onHandleUpdate={() => {
							handleUpdate(item);
						}}
						onHandleRelatedNewIssueForm={() => {
							handleNewRelatedKPI(item, 'Issue');
						}}
						onHandleRelatedNewTodoForm={() => {
							handleNewRelatedKPI(item, 'Todo');
						}}
					/>
				{/each}
			</div>
		</div>
		<!-- Row End  -->
	</div>
</div>

<style>
	/* Apply styles specifically to the input with the class "no-spinners" */

	/* For Chrome, Safari, Edge, and Opera */
	.no-spinners::-webkit-outer-spin-button,
	.no-spinners::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* For Firefox */
	/* .no-spinners {
	  -moz-appearance: textfield;
	} */
</style>
