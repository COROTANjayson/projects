<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import axios from 'axios';
	import { PUBLIC_URL } from '$env/static/public';
	import { filterTask, getAssigneesOption, getFilters } from '$lib/store/filterStore';
	import _ from 'lodash';
	import TaskListTable from './TaskListTable.svelte';
	import { goto } from '$app/navigation';
	import { getUserByTeam } from '$lib/api/user';
	import { mergeArraywithGID } from '$lib/utils/queryUtils';

	export let data: PageData;

	let chart_details: any = data.chart;
	let isFetching = false;
	let assigneeFilter: any[] = [];
	let task_list: any[] = [];

	onMount(async () => {
		// chart_details = chart;
		if (data.chart) {
			chart_details = data.chart;
			await fetchTask();
		}
		task_list = filtered_task;
		assigneeFilter = getAssigneesOption(filtered_task);
		sortTask();
	});

	let all_merge_task: any = [];

	let all_chart_task: any[] = [];
	let filtered_task: any[] = [];

	const queryTask = async (array: any) => {
		let projectids: any[] = [];
		let assigneesIds: any[] = [];

		if (chart_details.include_from === 'Teams') {
			array.forEach(async (element: any) => {
				assigneesIds.push(element.gid);
			});
		} else {
			array.forEach(async (element: any) => {
				projectids.push(element.gid);
			});
		}
		let filters: any = getFilters(chart_details.filters);

		if (filters.assignees) {
			filters.assignees = JSON.stringify(filters.assignees);
		} else {
			filters.assignees = JSON.stringify(assigneesIds);
		}
		if (filters.creators) {
			filters.creators = JSON.stringify(filters.creators);
		}
		if (projectids.length > 0) {
			filters.projectids = JSON.stringify(projectids);
		}
		const response: any = await axios.get(PUBLIC_URL + '/tasks', {
			params: {
				included_from: chart_details.include_from,
				...filters
			}
		});
		const result = response.data;
		all_chart_task = result.tasks;
	};
	const fetchTask = async () => {
		isFetching = true;
		if (chart_details.include_from === 'wela.online') {
			await queryTask([]);
		} else if (chart_details.include_from === 'Teams') {
			let allProject: any = [];
			// chart_details.include_from_array.forEach((element: any) => {
			// 	let filteredData = data.allProject.filter((item: any) => item.team.name === element.name);
			// 	allProject = [...allProject, ...filteredData];
			// 	element.fetch = true;
			// 	return element;
			// });
			let teamMembers: any[] = [];
			for (const element of chart_details.include_from_array) {
				let result = await getUserByTeam(element.gid, data.access_token);
				let members = result.map((element: any) => element.user);

				teamMembers = [...teamMembers, ...members];
			}
			teamMembers = mergeArraywithGID(teamMembers);
			await queryTask(teamMembers);
		} else if (chart_details.include_from === 'Projects owned by') {
			let allProject: any = [];
			let chart_included_array = [...chart_details.include_from_array];
			chart_included_array.map((element: any) => {
				element.fetch = true;
				// let filteredData = data.allProject.filter((item: any) => item.owner.gid === element.gid);
				let filteredData = data.allProject.filter((item: any) => {
					if (item.owner !== null && item.owner.gid === element.gid) {
						return item;
					}
				});
				allProject = [...allProject, ...filteredData];
				return element;
			});
			await queryTask(allProject);
		} else if (chart_details.include_from === 'Specific projects') {
			await queryTask(chart_details.include_from_array);
		}
		filtered_task = filterTask(chart_details, all_chart_task);

		isFetching = false;
		// chartMessage.set('');
	};

	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
	let filters = {
		assignees: {
			value: 'all',
			label: 'All'
		}
	};
	let sort = {
		label: 'Date Created',
		value: 'created_at',
		order: 'asc' as boolean | 'asc' | 'desc'
	};
	$: {
		if (sort) {
			sortTask();
		}
	}

	const sortTask = () => {
		task_list = _.orderBy(task_list, [sort.value], [sort.order]);
	};
	$: {
		if (filters) {
			if (filters.assignees) {
				if (filters.assignees.value === 'all') {
					task_list = filtered_task;
				} else {
					task_list = filtered_task.filter((val) => {
						if (val.assignee && filters.assignees.value === val.assignee.gid) {
							return val;
						}
					});
				}
			}
			sortTask();
		}
	}
</script>

<div class=" pb-3">
	<button
		on:click={() => {
			goto(`/dashboard-test/${data.chart.dashboard_id}`);
		}}
		class="text-xs hover:font-medium hover:underline flex gap-1"
	>
		<p>Dashboard</p>
		<img src="/arrow-right.svg" alt="" />
	</button>
	<div class=" pb-5 text-xl font-semibold">
		<h4>{chart_details.title}</h4>
	</div>
	<div class="flex justify-between">
		<div class="flex items-end gap-2">
			<p class="mb-2 font-medium text-xs">Filter by:</p>
			<div>
				<p class="text-xs font-medium text-gray-600">Assignee</p>
				<div class="dropdown">
					<div
						tabindex="0"
						role="button"
						class=" px-2 text-xs bg-white border py-2 rounded-md w-52 flex justify-between"
					>
						<p>{filters.assignees.label}</p>
						<img width="16" src="/arrow-down.svg" alt="" />
					</div>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						tabindex="0"
						class="dropdown-content z-30 menu py-2 px-0 shadow w-52 h-52 border bg-white rounded overflow-y-auto"
					>
						<div class="w-full text-xs">
							<button
								class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full"
								on:click={() => {
									filters.assignees = {
										value: 'all',
										label: 'All'
									};
									handleClick();
								}}
								>All
							</button>
							{#each assigneeFilter as assignee}
								<button
									class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full text-nowrap text-ellipsis"
									on:click={() => {
										filters.assignees.label = assignee.name;
										filters.assignees.value = assignee.gid;

										handleClick();
									}}
									>{assignee.name}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex items-end gap-2">
			<div class="dropdown dropdown-end">
				<div
					tabindex="0"
					role="button"
					class=" px-2 text-xs bg-white py-2.5 rounded-md flex justify-between"
				>
					<img
						src={sort.order == 'desc' ? '/sort-arrow-down.svg' : '/sort-arrow-up.svg'}
						width={14}
						height={16}
						alt=""
					/>
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div
					tabindex="0"
					class="dropdown-content z-30 menu py-2 px-0 shadow border bg-white rounded overflow-y-auto w-36"
				>
					<div class="w-full space-y-2 text-xs">
						<button
							on:click={() => {
								sort.order = 'asc';
								handleClick();
							}}
							class={`flex justify-start hover:bg-gray-50 px-4 py-1 w-full ${sort.order == 'asc' ? 'bg-gray-50' : ''}`}
						>
							<div class="flex gap-3">
								<img src="/sort-arrow-up.svg" width={16} height={16} alt="" />
								<p>Ascending</p>
							</div>
						</button>
						<button
							on:click={() => {
								sort.order = 'desc';
								handleClick();
							}}
							class={`flex justify-start hover:bg-gray-50 px-4 py-1 w-full ${sort.order == 'desc' ? 'bg-gray-100' : ''}`}
						>
							<div class="flex gap-3">
								<img src="/sort-arrow-down.svg" width={16} alt="" />
								<p>Descending</p>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div class="dropdown">
				<div
					tabindex="0"
					role="button"
					class=" px-2 text-xs bg-white border py-2 rounded-md w-52 flex justify-between"
				>
					<p><span class="font-medium text-gray-600">Sort by:</span> {sort.label}</p>
					<img width="16" src="/arrow-down.svg" alt="" />
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div
					tabindex="0"
					class="dropdown-content z-30 menu py-2 px-0 shadow w-52 border bg-white rounded overflow-y-auto"
				>
					<div class="w-full text-xs">
						<button
							on:click={() => {
								sort.label = 'Due date';
								sort.value = 'due_on';

								handleClick();
							}}
							class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full"
						>
							Due date
						</button>
						<button
							on:click={() => {
								sort.label = 'Date Created';
								sort.value = 'created_at';

								handleClick();
							}}
							class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full"
						>
							Date Created
						</button>
						<button
							on:click={() => {
								sort.label = 'Date Modified';
								sort.value = 'modified_at';
								handleClick();
							}}
							class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full"
						>
							Date Modified
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<TaskListTable tasks={task_list} />
</div>
<!-- {#if $isDashboardDetailsOpen}
	<EditDashboardDetails {data} />
{/if}

{#if $isOpenModal}
	<AddChartModal {data} {fetchCharts} />
{/if} -->
