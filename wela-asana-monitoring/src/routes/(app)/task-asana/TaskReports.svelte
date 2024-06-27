<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getCurrentDateFormatted } from '$lib/utils/dateUtils';
	import {
		completedTasks,
		incompleteTasks,
		isLoadingReport,
		overdueTasks,
		taskFilter,
		taskLists,
		openTaskList,
		taskType
	} from '$lib/store/taskStore';

	import TaskListTable from './TaskListTable.svelte';

	export let data: PageData;
	$: tasks = [] as any;
	let isLoading: boolean = true;
	onMount(async () => {
		taskFilter.set({});
		let user = data.user_data;
	});

	const openTask = (task_type: string) => {
		openTaskList.set(true);
		taskType.set(task_type);
	};
</script>

<div class="  space-y-2 max-w-[1920px] ">
	<h1 class=" text-1xl font-bold">{$taskFilter.name ? $taskFilter.name : 'Your'} Asana Report</h1>
	{#if $isLoadingReport}
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
		<div
			class={` ${$openTaskList ? 'flex' : 'grid grid-cols-2 lg:grid-cols-4 '} gap-4 transition-all`}
		>
			<button
				on:click={() => {
					openTask('incomplete');
				}}
				class={`transition-all  rounded-lg flex  items-center px-2 py-2
					${
						$openTaskList
							? ` gap-2 grow justify-center 
						${$taskType === 'incomplete' ? 'bg-yellow-200' : 'bg-slate-100 hover:bg-slate-200'}`
							: 'flex-col h-[130px] bg-yellow-200'
					}
				`}
			>
				<h3 class={`transition-all ${$openTaskList ? '' : 'text-xl'} `}>Incomplete Tasks</h3>
				<h3 class={`font-medium  ${$openTaskList ? '' : 'text-4xl mt-4'}`}>
					{$incompleteTasks.length}
				</h3>
			</button>

			<button
				on:click={() => {
					openTask('completed');
				}}
				class={`transition-all   rounded-lg flex  items-center px-2 py-2
					${
						$openTaskList
							? ` gap-2 grow justify-center 
						${$taskType === 'completed' ? 'bg-green-200' : 'bg-slate-100 hover:bg-slate-200'}`
							: 'flex-col h-[130px] bg-green-200'
					}
			`}
			>
				<h3 class={`transition-all  ${$openTaskList ? '' : 'text-xl'} `}>Completed Tasks</h3>
				<h3 class={`transition-all font-medium  ${$openTaskList ? '' : 'text-4xl mt-4'}`}>
					{$completedTasks.length}
				</h3>
			</button>
			<button
				on:click={() => {
					openTask('overdue');
				}}
				class={`transition-all  bg-red-200 rounded-lg flex  items-center px-2 py-2
				${
					$openTaskList
						? ` gap-2 grow justify-center 
						${$taskType === 'overdue' ? 'bg-red-200' : 'bg-slate-100 hover:bg-slate-200'}`
						: 'flex-col h-[130px] bg-red-200'
				}
			`}
			>
				<h3 class={`transition-all  ${$openTaskList ? '' : 'text-xl'} `}>Overdue Tasks</h3>
				<h3 class={`transition-all font-medium  ${$openTaskList ? '' : 'text-4xl mt-4'}`}>
					{$overdueTasks.length}
				</h3>
			</button>
			<button
				on:click={() => {
					openTask('total');
				}}
				class={`transition-all  bg-gray-200 rounded-lg flex  items-center px-2 py-2
					${
					$openTaskList
						? ` gap-2 grow justify-center 
						${$taskType === 'total' ? 'bg-gray-200' : 'bg-slate-100 hover:bg-slate-200'}`
						: 'flex-col h-[130px] bg-gray-200'
				}
			`}
			>
				<h3 class={`transition-all  ${$openTaskList ? '' : 'text-xl'} `}>Total Tasks</h3>
				<h3 class={`transition-all font-medium  ${$openTaskList ? '' : 'text-4xl mt-4'}`}>
					{$taskLists.length}
				</h3>
			</button>
		</div>
	{/if}
	{#if $openTaskList}
		<TaskListTable />
	{:else}	
	<div class="h-[300px]">

	</div>
	{/if}
</div>
