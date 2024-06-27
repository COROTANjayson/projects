<script lang="ts">
	import _ from 'lodash';
	import { PUBLIC_URL } from '$env/static/public';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import {
		filterTask,
		getFilters,
		selectedFilters,
		updateFilterSelection
	} from '$lib/store/filterStore';
	import { isOpenModal } from '$lib/store/reportingStore';
	import {
		chart_data,
		chart_method,
		emptyChartData,
		handleIncludedArray
	} from '$lib/store/chartStore';
	import { goto } from '$app/navigation';
	import { getUserByTeam } from '$lib/api/user';
	import { mergeArraywithGID } from '$lib/utils/queryUtils';

	export let chart: any;
	export let data: any;
	export let fetchCharts: () => any;

	let chart_details: any;
	let isFetching = false;
	onMount(async () => {
		chart_details = chart;
		if (chart_details) {
			await fetchTask();
		}
	});

	let all_chart_task: any[] = [];
	let filtered_task = [];

	// const filterTask = () => {
	// 	let filters = getFilters(chart_details.filters);
	// 	let tasks = all_chart_task;
	// 	if (filters.task_status) {
	// 		tasks = getOverdueTask(tasks);
	// 	}
	// 	if (filters.assignees) {
	// 		let no_assignees = [];
	// 		if (!filters.is_assignees_included) {
	// 			no_assignees = _.filter(tasks, { assignee: null });
	// 		}

	// 		const filteredAssignees = _.filter(tasks, (task) => {
	// 			if (task.assignee && filters.assignees.includes(task.assignee.gid)) {
	// 				return task;
	// 			}
	// 		});
	// 		tasks = [...filteredAssignees, ...no_assignees];
	// 	}
	// 	if (filters.creators) {
	// 		const filteredCreators = _.filter(tasks, (task) => {
	// 			if (task.created_by && filters.creators.includes(task.created_by.gid)) {
	// 				return task;
	// 			}
	// 		});
	// 		tasks = filteredCreators;
	// 	}
	// 	if (filters.completed !== undefined) {
	// 		const filteredCreators = _.filter(tasks, { completed: filters.completed });
	// 		tasks = filteredCreators;
	// 	}

	// 	filtered_task = tasks;
	// };
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

	const editChart = () => {
		chart_method.set('edit');
		emptyChartData();
		selectedFilters.set([]);
		selectedFilters.set(chart.filters);
		handleIncludedArray(chart.include_from);
		chart_data.set({
			id: chart.id,
			title: chart.title,
			chart_style: chart.chart_style,
			report_on: chart.report_on,
			include_from: chart.include_from,
			include_from_array: chart.include_from_array
		});

		chart.filters.forEach((val: any) => {
			updateFilterSelection(val);
		});

		isOpenModal.set(true);
	};
	let isDeleting = false;
	const deleteChart = async () => {
		isDeleting = true;

		const response: any = await axios.delete(PUBLIC_URL + `/charts/${chart.id}`);
		let result = response.data;
		if (result && result.success) {
			await fetchCharts();
		}
		isDeleting = false;
	};
</script>

<div
	class={`group relative h-[140px] border-2 rounded-lg flex flex-col items-center px-5 py-2 gap-2  ${isDeleting ? '' : 'hover:border-gray-400 '}`}
>
	<div
		class=" hidden absolute right-0 top-0 mx-2 px-1 my-2 h-6 rounded-md group-hover:flex items-center bg-white"
	>
		<div class={`${isDeleting ? 'hidden' : ''} dropdown dropdown-end`}>
			<div tabindex="0" role="button">
				<img src="/ellipses.svg" alt="" width="24" />
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="m-0 p-0 space-y-2 dropdown-content z-[1] menu shadow w-32 border rounded bg-white"
			>
				<button
					class="hover:bg-slate-100 py-2 px-4 flex"
					on:click={() => {
						editChart();
						handleClick();
					}}><p>Edit Chart</p></button
				>
				<button
					class="hover:bg-slate-100 py-2 px-4 flex text-red-700"
					on:click={() => {
						deleteChart();

						handleClick();
					}}><p>Delete Chart</p></button
				>
			</div>
		</div>
	</div>
	<h3
		class={`text-xl text-overflow truncate text-ellipsis w-full ${isDeleting ? 'text-gray-300' : 'text-black '}`}
	>
		{chart.title}
	</h3>
	<button
		disabled={isDeleting}
		on:click={() => {
			goto(`/task/${chart.id}`);
		}}
		class={`text-4xl font-medium mt-4  ${isDeleting ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`}
		>{filtered_task.length}</button
	>
	{#if isFetching}
		<div class="flex items-center justify-center gap-3">
			<div role="status">
				<svg
					aria-hidden="true"
					class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600"
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
			<div class=" text-gray-400">fetching...</div>
		</div>
	{/if}
</div>
