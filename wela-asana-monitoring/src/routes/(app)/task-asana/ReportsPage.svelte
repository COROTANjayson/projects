<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getCurrentDateFormatted } from '$lib/utils/dateUtils';
	import TaskReports from './TaskReports.svelte';
	import { getTasksRecursive, getTasks } from '$lib/api/task';
	import {
		completedTasks,
		getByCompleteStatus,
		getOverdueTask,
		getTaskByProject,
		incompleteTasks,
		isLoadingReport,
		openTaskList,
		overdueTasks,
		taskFilter,
		taskLists,
		tasksByProject
	} from '$lib/store/taskStore';
	export let data: PageData;

	let allProjects: any = [];
	let allUsers: any = [];
	let searchProject: string = '';
	let searchUsers: string = '';
	let isLoading: boolean = false;
	onMount(() => {
		allProjects = data.allProject;
		allUsers = data.allUsers;
	});

	const filterProject = (searchTerm: string) => {
		if (searchTerm === '' || !searchTerm) {
			allProjects = data.allProject;
		} else {
			const filteredData = data.allProject.filter((item: { name: string }) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			allProjects = filteredData;
		}
	};
	const filterUsers = (searchTerm: string) => {
		if (searchTerm === '' || !searchTerm) {
			allUsers = data.allUsers;
		} else {
			const filteredData = data.allUsers.filter((item: { name: string }) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			allUsers = filteredData;
		}
	};
	$: {
		filterUsers(searchUsers);
	}

	$: {
		filterProject(searchProject);
	}

	const getTaskInFilter = async (val: any, filter: any) => {
		taskFilter.set(val);
		if (val.gid && data.access_token) {
			isLoadingReport.set(true);
			openTaskList.set(false);
			const tasks = await getTasks(filter, data.access_token);
			if (tasks) {
				taskLists.set(tasks);
				getByCompleteStatus();
				getOverdueTask();
				isLoadingReport.set(false);
			} else {
				taskLists.set([]);
				await getTasksRecursive(filter, data.access_token);
				getByCompleteStatus();
				getOverdueTask();
			}
			isLoadingReport.set(false);
		}
	};

	// $: {
	// 	if (isLoading) {
	// 		// $taskLists = [...tasksByProject[projectFilter]];
	// 		// taskLists.set([...$tasksByProject[projectFilter]]);
	// 		getByCompleteStatus();
	// 		getOverdueTask();
	// 	}
	// }
</script>

<div class=" w-full ">
	<div class=" space-y-2 border-b-2 py-3 w-full">
		<h1 class=" text-4xl font-bold">Reports</h1>
		<p class="text-sm font-medium">{getCurrentDateFormatted()}</p>
	</div>
	<div class=" space-y-2 py-3 w-full">
		<div class="dropdown">
			<div tabindex="0" role="button" class=" m-1 w-52">
				<div class=" bg-slate-200 rounded-lg flex gap-2 items-center px-3 py-2">
					<h3 class="text-sm font-medium">Total Projects:</h3>
					<h3 class=" font-medium">{data.allProject.length}</h3>
				</div>
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="dropdown-content z-[1] menu p-2 shadow rounded-box w-[215px] bg-white">
				<div class="w-full">
					<div class="relative h-11 w-full min-w-[200px]">
						<input
							bind:value={searchProject}
							placeholder=""
							class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
						/>
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label
							class="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
						>
							Search Project
						</label>
					</div>
				</div>

				<div class="w-full space-y-1 pt-2 h-64 overflow-auto">
					{#each allProjects as project}
						<button
							on:click={() => {
								let filter = {
									project: project.gid
								};
								getTaskInFilter(project, filter);
							}}
							class=" w-full rounded hover:bg-slate-100"
						>
							<p class="whitespace-pre text-ellipsis overflow-hidden text-left p-1">
								{project.name}
							</p>
						</button>
					{/each}
				</div>
			</div>
		</div>
		<div class="dropdown">
			<div tabindex="0" role="button" class=" m-1 w-52">
				<div class=" bg-slate-200 rounded-lg flex gap-2 items-center px-3 py-2">
					<h3 class="text-sm font-medium">Total Users:</h3>
					<h3 class=" font-medium">{data.allUsers.length}</h3>
				</div>
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="dropdown-content z-[1] menu p-2 shadow rounded-box w-[215px] bg-white">
				<div class="w-full">
					<div class="relative h-11 w-full min-w-[200px]">
						<input
							bind:value={searchUsers}
							placeholder=""
							class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
						/>
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label
							class="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
						>
							Search User
						</label>
					</div>
				</div>

				<div class="w-full space-y-1 pt-2 h-64 overflow-auto">
					{#each allUsers as user}
						<button
							on:click={() => {
								let filter = {
									assignee: user.gid,
									workspace: data.user_data.workspace_id
								};
								getTaskInFilter(user, filter);
							}}
							class=" w-full rounded hover:bg-slate-100"
						>
							<p class="whitespace-pre text-ellipsis overflow-hidden text-left p-1">
								{user.name}
							</p>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<TaskReports {data} />
</div>
