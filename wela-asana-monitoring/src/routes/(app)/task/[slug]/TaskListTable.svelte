<script lang="ts">
	import Pagination from './Pagination.svelte';
	import { taskTotalPages } from '$lib/store/taskStore';
	import { FormatDateInWords, getFormattedDate } from '$lib/utils/dateUtils';

	export let tasks: any;

	let taskList: any[] = [];
	let limitPage = 20;
	const currentDate = getFormattedDate();
	$: taskTotalPages.set(Math.ceil(tasks.length / limitPage));
	$: loading = false;
	$: currentPage = 1;
	const onPageChange = async (page: any) => {
		loading = true;
		currentPage = page;
		taskList;
		loading = false;
	};
	$: paginatedTaskList = tasks.slice((currentPage - 1) * limitPage, currentPage * limitPage);
	$: {
		if (tasks) {
			currentPage = 1;
		}
	}

	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
</script>

<div class="relative overflow-x-auto">
	<div
		class={`w-[1250px] ${paginatedTaskList && paginatedTaskList.length <= 3 ? 'h-[300px]' : ''}`}
	>
		<table class=" divide-y">
			<thead class="">
				<tr>
					<th class="text-xs text-left sticky left-0 bg-white px-6 py-3 border-b z-10">Priority</th>
					<th class="text-xs text-left sticky left-0 bg-white px-6 py-3 border-b w-[350px]"
						>Task Name</th
					>
					<th class=" px-6 py-3 text-left text-xs font-medium text-gray-500">Assignee</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Creation date</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Due date</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
					<th class="  px-6 py-3 text-left text-xs font-medium text-gray-500">Projects</th>
					<th class=" px-6 py-3 text-left text-xs font-medium text-gray-500">Tags</th>
					<th class=" px-6 py-3 text-left text-xs font-medium text-gray-500">Date Completed</th>

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
							class=" z-10 gap-2 text-sm px-6 py-2 sticky bg-white group-hover:bg-slate-50 left-0 whitespace-nowrap border-b border-gray-200"
						>
							{#if task.priority_level && task.priority_level.value !== ''}
								<div
									class={`${
										task.priority_level.color === 'red'
											? 'bg-red-500'
											: task.priority_level.color === 'orange'
												? 'bg-orange-500'
												: ' bg-yellow-500'
									} text-xs px-3 rounded-lg  text-center text-white`}
								>
									{task.priority_level.value.replace('priority', '')}
								</div>
							{/if}
						</td>
						<td
							class=" text-sm px-6 py-2 sticky bg-white group-hover:bg-slate-50 left-0 whitespace-nowrap border-b border-gray-200"
						>
							<!-- {#each task.custom_fields as custom} -->

							<!-- {/each} -->

							<div class=" w-[350px] text-ellipsis overflow-hidden">
								{task.name}
							</div>
						</td>
						<td class="px-6 py-2 text-xs whitespace-nowrap"
							>{task.assignee ? task.assignee.name : ''}</td
						>
						<td class={`px-6 py-2 whitespace-nowrap text-xs w-full  `}
							>{task.created_at ? FormatDateInWords(task.created_at) : ''}</td
						>
						<td
							class={`px-6 py-2 whitespace-nowrap text-xs w-full   ${task.due_on < currentDate ? 'text-red-500' : ''}`}
							>{task.due_on ? FormatDateInWords(task.due_on) : 'No due'}</td
						>
						<td
							class={`px-6 py-2 whitespace-nowrap text-xs w-full font-medium  ${task.completed ? 'text-green-500' : 'text-red-500'} `}
							>{task.completed ? 'Completed' : 'Incomplete'}</td
						>
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
						<td class="px-6 py-2 text-xs whitespace-nowrap w-full">
							{task.completed_at ? FormatDateInWords(task.completed_at) : ''}</td
						>

						<!-- Add more data cells as needed -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class="w-full flex justify-between mt-4">
	<div class="flex items-center gap-2">
		<p class="text-sm font-medium text-gray-600">No. per page</p>
		<div class="dropdown dropdown-top">
			<div
				tabindex="0"
				role="button"
				class=" px-2 text-xs bg-white border py-2 rounded-md w-20 flex justify-between"
			>
				<p class="font-medium">{limitPage}</p>
				<img width="16" src="/arrow-down.svg" alt="" />
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="dropdown-content z-30 menu py-2 px-0 shadow w-20 border bg-white rounded overflow-y-auto"
			>
				<div class="w-full text-xs">
					<button
						class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full text-nowrap text-ellipsis"
						on:click={() => {
							currentPage = 1
							limitPage = 20;
							handleClick();
						}}
						>20
					</button>
					<button
						class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full text-nowrap text-ellipsis"
						on:click={() => {
							currentPage = 1
							limitPage = 50;
							handleClick();
						}}
						>50
					</button>
					<button
						class="flex justify-start hover:bg-gray-50 px-4 py-1 w-full text-nowrap text-ellipsis"
						on:click={() => {
							currentPage = 1
							limitPage = 100;
							handleClick();
						}}
						>100
					</button>
				</div>
			</div>
		</div>
	</div>
	<Pagination {currentPage} {onPageChange} />
</div>
