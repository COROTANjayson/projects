<script lang="ts">
	import { removeFilter, updateFilter } from '$lib/store/filterStore';
	import { onMount } from 'svelte';

	export let filter_data: any;

	let priority_level: any = filter_data;
	let selectedOption = '';

	onMount(() => {
		priority_level = filter_data;
		selectedOption = priority_level.level;
	});
	function handleOptionChange(event: any) {
		selectedOption = event.target.value;
		priority_level.level = event.target.value;
		updateFilter(priority_level);
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
		<div class="flex gap-3">
			<input
				type="radio"
				value={'High priority'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">High Priority</p>
		</div>
		<div class="flex gap-3">
			<input
				type="radio"
				value={'Medium priority'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">Medium Priority</p>
		</div>
		<div class="flex gap-3">
			<input
				type="radio"
				value={'Low priority'}
				bind:group={selectedOption}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">Low Priority</p>
		</div>
	</div>
</div>
