<script lang="ts">
	import type { PageData } from './$types';
	import _ from 'lodash';
	import { dashboard_details, isOpenModal } from '$lib/store/reportingStore';
	import {
		allChartTask,
		chartMessage,
		chart_data,
		chart_method,
		isFetching
	} from '$lib/store/chartStore';
	import ChartDetails from './ChartDetails.svelte';
	import ChartFilters from './ChartFilters.svelte';
	import { onMount } from 'svelte';
	import { getFilters, getOverdueTask, selectedFilters } from '$lib/store/filterStore';
	import axios from 'axios';
	import { PUBLIC_URL } from '$env/static/public';
	import { mergeArraywithGID, mergeTasks } from '$lib/utils/queryUtils';
	import { getUserByTeam } from '$lib/api/user';
	export let data: PageData;
	export let fetchCharts: () => any;
	let title: string = '';
	onMount(() => {
		// emptyChartData();
		title = $chart_data.title ? $chart_data.title : '';
	});
	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
	let all_task: any = [];

	const filterTask = () => {
		let filters = getFilters($selectedFilters);
		let tasks = $allChartTask;
		if (filters.priority_level) {
			let list: any[] = [];
			tasks.forEach((val: any) => {
				if (val.custom_fields) {
					let priority_level = _.find(val.custom_fields, { value: filters.priority_level });
					let priority_level_2 = _.find(val.custom_fields, {
						value: filters.priority_level.replace('priority', '')
					});
					if (priority_level || priority_level_2) {
						list.push(val);
					}
				}
			});
			tasks = list;
		}
		if (filters.task_status) {
			tasks = getOverdueTask(tasks);
		}
		if (filters.assignees) {
			let no_assignees = [];
			if (filters.is_assignees_included === false) {
				no_assignees = _.filter(tasks, { assignee: null });
			}

			const filteredAssignees = _.filter(tasks, (task) => {
				if (task.assignee && filters.assignees.includes(task.assignee.gid)) {
					return task;
				}
			});
			tasks = [...filteredAssignees, ...no_assignees];
		}
		if (filters.creators) {
			const filteredCreators = _.filter(tasks, (task) => {
				if (task.created_by && filters.creators.includes(task.created_by.gid)) {
					return task;
				}
			});
			tasks = filteredCreators;
		}
		if (filters.completed !== undefined) {
			const filteredCreators = _.filter(tasks, { completed: filters.completed });
			tasks = filteredCreators;
		}

		if (filters.date) {
			let date = filters.date;

			const fromDate = new Date(date.from_date);
			const toDate = new Date(date.to_date);
			tasks = _.filter(tasks, (item) => {
				if (date.sub === 'Completion date') {
					if (item.completed_at) {
						const itemDate = new Date(item.completed_at);
						return itemDate >= fromDate && itemDate <= toDate;
					}
				}
				if (date.sub === 'Creation date') {
					if (item.created_at) {
						const itemDate = new Date(item.created_at);
						return itemDate >= fromDate && itemDate <= toDate;
					}
				}
				if (date.sub === 'Due date') {
					if (item.due_on) {
						const itemDate = new Date(item.due_on);
						return itemDate >= fromDate && itemDate <= toDate;
					}
				}
			});
		}
		all_task = tasks;
	};
	const queryTask = async (array: any) => {
		let projectids: any[] = [];
		let assignees: any[] = [];
		let params: any = {
			included_from: $chart_data.include_from
		};

		if ($chart_data.include_from === 'Teams') {
			array.forEach(async (element: any) => {
				assignees.push(element.gid);
			});
			if (assignees.length > 0) {
				params.assignees = JSON.stringify(assignees);
			}
		} else {
			array.forEach(async (element: any) => {
				projectids.push(element.gid);
			});
			if (projectids.length > 0) {
				params.projectids = JSON.stringify(projectids);
			}
		}

		let allTask = [];
		const response: any = await axios.get(PUBLIC_URL + '/tasks', {
			params: {
				...params
				// included_from: $chart_data.include_from,
				// projectids: JSON.stringify(projectids)
				// ...filters
			}
		});
		const result = response.data;
		allTask = result.tasks;
		// allChartTask.set([...$allChartTask, ...result.tasks]);
		allChartTask.set(result.tasks);
		if ($selectedFilters.length > 0) {
			filterTask();
		}
		return projectids;
	};

	const fetchTask = async () => {
		isFetching.set(true);
		chartMessage.set('Fetching...');
		let filters: any = getFilters($selectedFilters);
		if ($chart_data.include_from === 'wela.online') {
			await queryTask([]);
			// if (filters.assignees) {
			// 	filters.assignees = JSON.stringify(filters.assignees);
			// }
			// if (filters.creators) {
			// 	filters.creators = JSON.stringify(filters.creators);
			// }
			// let params: any = {
			// 	included_from: $chart_data.include_from,
			// 	...filters
			// };
			// const response: any = await axios.get(PUBLIC_URL + '/tasks', {
			// 	// params: { included_from: $chart_data.include_from }
			// 	params: params
			// });
			// const result = response.data;
			// allChartTask.set(result.tasks);
			// if ($selectedFilters.length > 0) {
			// 	filterTask();
			// }
		} else if ($chart_data.include_from === 'Teams') {
			// let allProject: any = [];
			let teamMembers: any[] = [];
			// let new_included_array = $chart_data.include_from_array.forEach(async (element: any) => {
			// 	let result = await getUserByTeam(element.gid, data.access_token);
			// 	let members = result.map((element: any) => element.user);
			// 	teamMembers = [...teamMembers, ...members];
			// 	element.fetch = true;

			// });
			for (const element of $chart_data.include_from_array) {
				let result = await getUserByTeam(element.gid, data.access_token);
				let members = result.map((element: any) => element.user);
				teamMembers = [...teamMembers, ...members];
				element.fetch = true;
			}
			teamMembers = mergeArraywithGID(teamMembers);
			const isQuery = await queryTask(teamMembers);
			// if (isQuery.length > 0) {
			// 	chart_data.set({ ...$chart_data, include_from_array: new_included_array });
			// }
		} else if ($chart_data.include_from === 'Projects owned by') {
			let allProject: any = [];
			let chart_included_array = [...$chart_data.include_from_array];
			let new_included_array = chart_included_array.map((element: any) => {
				// if (!element.fetch) {
				element.fetch = true;
				let filteredData = data.allProject.filter((item: any) => {
					if (item.owner !== null && item.owner.gid === element.gid) {
						return item;
					}
				});
				// let filteredData = data.allProject.filter((item: any) => {
				// 	let isExistMember;
				// 	if (item.members) {
				// 		isExistMember = item.members.find((val: any) => val.gid === element.gid);
				// 	}
				// 	if (isExistMember) {
				// 		return item;
				// 	}
				// });
				allProject = [...allProject, ...filteredData];
				// }

				return element;
			});
			const isQuery = await queryTask(allProject);
			// if (isQuery.length > 0) {
			// 	chart_data.set({ ...$chart_data, include_from_array: new_included_array });
			// }
		} else if ($chart_data.include_from === 'Specific projects') {
			// let projectids: any[] = [];
			// $chart_data.include_from_array.forEach(async (element: any) => {
			// 	if (!element.fetch) {
			// 		projectids.push(element.gid);
			// 	}
			// });

			const isQuery = await queryTask($chart_data.include_from_array);
			let new_included_array = $chart_data.include_from_array.map((element: any) => {
				element.fetch = true;
				return element;
			});
			// if (isQuery.length > 0) {
			// 	chart_data.set({ ...$chart_data, include_from_array: new_included_array });
			// }
		}
		filterTask();
		isFetching.set(false);
		chartMessage.set('');
	};
	$: {
		if ($chart_data.include_from_array.length === 0) {
			allChartTask.set([]);
		}
	}

	$: {
		if (
			// $selectedFilters ||
			$chart_data.include_from_array.length > 0 ||
			$chart_data.include_from === 'wela.online'
		) {
			fetchTask();
		}
	}
	$: {
		if ($selectedFilters) {
			filterTask();
		}
	}
	// $: {
	// 	if ($selectedFilters.length > 0 && $chart_data.include_from === 'wela.online') {
	// 		fetchTask();
	// 	}
	// }

	$: {
		if ($allChartTask) {
			if ($allChartTask.length === 0) {
				all_task = [];
			} else {
				let mergeTask = mergeTasks($allChartTask);
				all_task = mergeTask;
			}
		}
	}

	let isSaving = false;
	const saveChart = async () => {
		isSaving = true;
		let current_date = new Date();
		let data = {
			dashboard_id: $dashboard_details.id,
			...$chart_data,
			title: title,
			filters: $selectedFilters
		};
		let result: any;
		if ($chart_method === 'create') {
			const response: any = await axios.post(PUBLIC_URL + '/charts', {
				...data,
				created_at: current_date
			});
			result = response.data;
		} else {
			delete data.id;
			const response: any = await axios.put(PUBLIC_URL + `/charts/${$chart_data.id}`, {
				...data,
				updated_at: current_date
			});
			result = response.data;
		}

		if (result && result.success) {
			// let data = result.data;
			isSaving = false;
			isOpenModal.set(false);
			await fetchCharts();
		} else {
			isSaving = false;
		}
	};
</script>

<div
	id="content-2"
	class="fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center sm:bg-black sm:bg-opacity-50 sm:backdrop-blur-sm"
>
	<div
		class="rounded relative w-full h-[85%] xl:w-[65%] lg:w-[80%] bg-white sm:shadow-md flex flex-col"
	>
		<div class=" w-full px-6 flex justify-between py-3 z-30 bg-white rounded-t-md">
			<h4 class="text-xl font-bold">{$chart_method === 'create' ? 'Add chart' : 'Edit chart'}</h4>
			<button
				on:click={() => {
					isOpenModal.set(false);
					// goto('/dashboard');
				}}
				class=""
			>
				<img src="/x.svg" alt="" />
			</button>
		</div>
		<div class="w-full border-b" />

		<div class="flex flex-1 overflow-y-auto">
			<div class=" pt-11 col-span-2 w-full flex flex-col items-center justify-start">
				<input
					bind:value={title}
					type="text"
					placeholder="Chart Name"
					name=""
					id=""
					class="p-3 text-4xl rounded-md"
				/>
				<div class="flex-1 w-full flex flex-col items-center">
					<h6 class="text-7xl py-16">{all_task.length}</h6>
					<div class="flex gap-2">
						{#if $isFetching}
							<div role="status">
								<svg
									aria-hidden="true"
									class="w-8 h-8 text-gray-200 animate-spin dark:text-white fill-blue-600"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
								<span class="sr-only">Loading...</span>
							</div>
						{/if}

						<p class="">{$chartMessage}</p>
					</div>
				</div>
			</div>
			<div class="flex flex-col w-[600px]">
				<div class="overflow-y-auto flex-1">
					<div class=" border-l">
						<ChartDetails />
						<div class="border-b py-6" />
						<!-- <h5 class=" py-6 px-3">Chart Axes</h5>
						<div class="px-3">
							<div class=" space-y-2">
								<p class="text-xs font-medium text-gray-600">Value</p>
								<div class="dropdown w-full">
									<div
										tabindex="0"
										role="button"
										class=" px-2 text-sm w-full bg-white border py-2 rounded-md flex justify-between"
									>
										<p>Task count</p>
										<img src="/arrow-down.svg" alt="" />
									</div>
									<div
										tabindex="0"
										class="dropdown-content z-[1] menu py-2 px-0 shadow w-52 border bg-white rounded"
									>
										<button
											class="flex justify-start hover:bg-gray-50 px-2 py-1"
											on:click={() => {
												handleClick();
											}}
											>Task Count
										</button>
									</div>
								</div>
							</div>
						</div> -->
						<!-- <div class="border-b py-6" /> -->
						<div class=" py-6 px-3">
							<ChartFilters />
						</div>
					</div>
				</div>
				<div class=" h-[60px] flex justify-end items-center gap-3 px-4 border-l border-t">
					<button
						on:click={() => {
							isOpenModal.set(false);
						}}
						class="text-sm right-0 px-3 py-2 border border-slate-700 rounded-md"
					>
						Cancel
					</button>
					<button
						disabled={isSaving}
						on:click={saveChart}
						class="text-sm text-white right-0 px-3 py-2 border bg-blue-500 rounded-md"
					>
						{isSaving ? '...Saving' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
