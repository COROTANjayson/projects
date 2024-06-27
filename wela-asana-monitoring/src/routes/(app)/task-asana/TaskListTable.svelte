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
		taskType,

		taskTotalPages

	} from '$lib/store/taskStore';

	import Pagination from './Pagination.svelte';
	let taskList: any[] = [];
	$: {
		if ($taskType === 'incomplete') {
			taskList = $incompleteTasks;
		} else if ($taskType === 'completed') {
			taskList = $completedTasks;
		} else if ($taskType === 'overdue') {
			taskList = $overdueTasks;
		} else if ($taskType === 'total') {
			taskList = $taskLists;
		}
        taskTotalPages.set(Math.ceil(taskList.length / limitPage));

	}

	$: loading = false;
	$: currentPage = 1;
	let limitPage = 10;
	const onPageChange = async (page: any) => {
		loading = true;
		currentPage = page;
        taskList
		loading = false;
	};
    $: paginatedTaskList  = taskList.slice((currentPage - 1) * limitPage, currentPage * limitPage);

</script>

<div class="relative overflow-x-auto ">
	<div class="w-[1200px]">
		<table class=" divide-y">
			<thead class="">
				<tr>
					<th class="text-xs text-left sticky left-0 bg-white px-6 py-3 border-b w-[500px]"
						>Task Name</th
					>
					<th class=" px-6 py-3 text-left text-xs font-medium text-gray-500">Assignee</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Due date</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Projects</th>

					<th class=" px-6 py-3 text-left text-xs font-medium text-gray-500">Tags</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each paginatedTaskList as task}
					<tr
						class="cursor-pointer hover:bg-slate-50 group"
						on:click={() => {
							window.open(task.permalink_url, '_blank');
						}}
					>
						<td
							class="text-sm px-6 py-2 sticky bg-white group-hover:bg-slate-50 left-0 whitespace-nowrap border-b border-gray-200 "
						>
							<div class=" w-[500px] text-ellipsis overflow-hidden">
								{task.name}
							</div>
						</td>
						<td class="px-6 py-2 text-xs whitespace-nowrap"
							>{task.assignee ? task.assignee.name : ''}</td
						>
						<td class="px-6 py-2 text-xs whitespace-nowrap">{task.due_on?task.due_on:'No due'}</td>
						<td class="px-6 py-2 text-xs whitespace-nowrap w-full">
							<div class="flex gap-2">
								{#each task.projects as project}
									<div class="w-[50px] p-1 border rounded-[20px] text-ellipsis overflow-hidden">
										{project.name}
									</div>
								{/each}
							</div>
						</td>
						<td class="px-6 py-2 text-xs whitespace-nowrap w-full">
							<div class="flex gap-2">
								{#each task.tags as tag}
									<div class=" p-1 border rounded-[20px] text-ellipsis overflow-hidden">
										{tag.name}
									</div>
								{/each}
							</div></td
						>

						<!-- Add more data cells as needed -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class="w-full flex justify-end">
    <Pagination {currentPage} {onPageChange} />

</div>
