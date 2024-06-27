<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getCurrentDateFormatted } from '$lib/utils/dateUtils';
	import {
		completedTasks,
		getByCompleteStatus,
		getOverdueTask,
		getTaskByProject,
		incompleteTasks,
		overdueTasks,
		taskLists,
		tasksByProject
	} from '$lib/store/taskStore';
	import { getTaskByUser } from '$lib/api/task';
	import MyTask from './MyTask.svelte';

	export let data: PageData;
	$: tasks = [] as any;
	let isLoading: boolean = true;
	let noProject: any[] = [];
	onMount(async () => {
		let user = data.user_data;
		if (data.access_token) {
			const task_resp = await getTaskByUser(user, data.access_token);
			tasks = task_resp ? task_resp : [];
			isLoading = false;
		}

		taskLists.set(tasks ? tasks : []);
		getTaskByProject();
	});
	let projectFilter = 'all';
	$: {
		if (projectFilter !== 'all') {
			// $taskLists = [...tasksByProject[projectFilter]];
			taskLists.set([...$tasksByProject[projectFilter]]);
			getByCompleteStatus();
			getOverdueTask();
		} else {
			taskLists.set([...tasks]);
			getByCompleteStatus();
			getOverdueTask();
			// $taskLists = [...data.tasks];
		}
	}
</script>

<div class=" w-full">
	<div class=" space-y-2 border-b-2 py-3 w-full">
		<h1 class=" text-4xl font-bold">Task Report</h1>
		<p class="text-sm font-medium">{getCurrentDateFormatted()}</p>
	</div>
	<div class=" space-y-2 py-3 w-full">
		<div class="flex justify-between">
			<h1 class=" text-1xl font-bold">Your Asana Reports</h1>
			<select bind:value={projectFilter} class="select select-ghost w-full max-w-xs">
				<option value="all">All Projects</option>
				{#each Object.keys($tasksByProject) as project}
					<option value={project}>{project}</option>
				{/each}
			</select>
		</div>
		{#if isLoading}
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<div
					class="h-[130px] bg-slate-200 rounded-lg flex flex-col items-center px-2 py-2 animate-pulse"
				></div>
				<div
					class="h-[130px] bg-slate-200 rounded-lg flex flex-col items-center px-2 py-2 animate-pulse"
				></div>
				<div
					class="h-[130px] bg-slate-200 rounded-lg flex flex-col items-center px-2 py-2 animate-pulse"
				></div>
				<div
					class="h-[130px] bg-slate-200 rounded-lg flex flex-col items-center px-2 py-2 animate-pulse"
				></div>
			</div>
		{:else}
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
				<div class="h-[130px] bg-yellow-200 rounded-lg flex flex-col items-center px-2 py-2">
					<h3 class="text-xl">Incomplete Tasks</h3>
					<h3 class="text-4xl font-medium mt-4">{$incompleteTasks.length}</h3>
				</div>
				<div class="h-[130px] bg-green-200 rounded-lg flex flex-col items-center px-2 py-2">
					<h3 class="text-xl">Completed Tasks</h3>
					<h3 class="text-3xl font-medium mt-4">{$completedTasks.length}</h3>
				</div>
				<div class="h-[130px] bg-red-200 rounded-lg flex flex-col items-center px-2 py-2">
					<h3 class="text-xl">Overdue Tasks</h3>
					<h3 class="text-3xl font-medium mt-4">{$overdueTasks.length}</h3>
				</div>
				<!-- <div class="h-[130px] bg-gray-100 rounded-lg flex flex-col items-center px-2 py-2">
					<h3 class="text-xl">Total Tasks</h3>
					<h3 class="text-3xl font-medium mt-4">{$taskLists.length}</h3>
				</div> -->
			</div>
		{/if}
		<!-- <div class="flex justify-end">
			<button 
			on:click={()=>{
				goto('/task')
				
			}}
			class="font-bold underline mx-5">
				See more of tasks
				</button>
		</div> -->
		<div>
			<div class="flex gap-2">
				<MyTask />
				<!-- <div class="border rounded-lg px-4 py-3 grow">
					<div class=" flex justify-between">
						<h2 class="font-medium">Your Teams' Project</h2>
						<select class="select select-xs max-w-xs">
							<option value="all">All Teams</option>
							{#each $teams as team}
								<option value={team}>{team.name}</option>
							{/each}
						</select>
					</div>
					<div>
						{#each $projectByTeams as project}
							<div class="w-[300px]">{project.name}</div>
						{/each}
					</div>
				</div> -->
			</div>
		</div>
	</div>
</div>
