<script lang="ts">
	import { removeFilter, updateFilter } from '$lib/store/filterStore';
	import { onMount } from 'svelte';

	export let filter_data: any;

	let task_status: any = filter_data;
	onMount(() => {
		task_status = filter_data;
	});
	let selectedOption = 'Overdue';
	function handleOptionChange(event: any) {
		selectedOption = event.target.value;
		task_status.status = event.target.value;
		updateFilter(task_status);
	}
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<p class="text-xs font-medium text-gray-600">Task status</p>
		<button
			on:click={() => {
				removeFilter(filter_data);
			}}
			class="p-0.5 hover:bg-slate-100 rounded"><img src="/x.svg" width="15" alt="" /></button
		>
	</div>
	<div class="flex flex-col gap-4">
		<!-- <div class="flex gap-3">
			<input
				type="radio"
				value={'Upcoming'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
            <p class="text-sm">Upcoming</p>
		</div> -->
		<div class="flex gap-3">
			<input
				type="radio"
				value={'Overdue'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">Overdue</p>
		</div>
		<!-- <div class="flex gap-3">
			<input
				type="radio"
				value={'Unscheduled'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
            <p class="text-sm">Unscheduled</p>
			
		</div> -->
		<!-- <div class="flex gap-3">
			<input
				type="radio"
				value={'Completed'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
            <p class="text-sm">Completed</p>
			
		</div> -->
	</div>
</div>
