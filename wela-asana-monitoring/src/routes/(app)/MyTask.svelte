<script lang="ts">
	import { completedTasks, incompleteTasks, overdueTasks, taskLists } from '$lib/store/taskStore';
	$: taskType = 'incomplete';
	const today = new Date();
	const year = today.getFullYear();
	let month: any = today.getMonth() + 1;
	let day: any = today.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const formattedDate = `${year}-${month}-${day}`;
	let taskList = $incompleteTasks;
	$: {
		if (taskType === 'incomplete') {
			taskList = $incompleteTasks;
		} else if (taskType === 'completed') {
			taskList = $completedTasks;
		} else if (taskType === 'overdue') {
			taskList = $overdueTasks;
		} else if (taskType === 'total') {
			taskList = $taskLists;
		}
		// taskTotalPages.set(Math.ceil(taskList.length / limitPage));
	}
</script>

<div class="border rounded-lg py-3 grow h-[500px] w-full">
	<div class="flex border-b h-[40px] px-4">
		<h2 class=" font-medium text-xl w-[100px]">My Tasks</h2>
		<div class="flex transition-all w-full ml-10">
			<button
				on:click={() => {
					taskType = 'incomplete';
				}}
				class={`p-2 text-sm font-medium hover:text-black w-[100px] transition-all
                ${taskType === 'incomplete' ? 'text-black border-b-2  border-black' : 'text-gray-500'}
                `}
			>
				Tasks
			</button>
			<button
				on:click={() => {
					taskType = 'overdue';
				}}
				class={`p-2 text-sm font-medium hover:text-black w-[100px] transition-all
                    ${taskType === 'overdue' ? 'text-black border-b-2  border-black' : 'text-gray-500'}
                    `}>Overdue</button
			>
		</div>
	</div>

	<div class="my-2 px-3">
		{#each taskList as task}
			<button
				on:click={() => {
					window.open(task.permalink_url, '_blank');
				}}
				class=" py-2 border-b w-full hover:bg-slate-50"
			>
				<div class="mx-4 flex justify-between">
					<p class="text-sm">
						{task.name}
					</p>
					<p class={`text-xs ${task.due_on < formattedDate ? 'text-red-500' : ''}`}>
						{task.due_on ? task.due_on : ''}
					</p>
				</div>
			</button>
		{/each}
	</div>
</div>
