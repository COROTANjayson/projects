<script lang="ts">
	import { removeFilter, updateFilter } from '$lib/store/filterStore';
	import { onMount } from 'svelte';

	export let filter_data: any;

	let filterData: any = {};
	onMount(() => {
		filterData = filter_data;
	});

	const updateSelectedFilterData = () => {
		updateFilter(filterData);
	};

	function handleOptionChange(event: any) {
		filterData.completed = event.target.value;
		updateSelectedFilterData();
	}
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<p class="text-xs font-medium text-gray-600">Task completion status</p>
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
				value={'0'}
				bind:group={filterData.completed}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">Incomplete</p>
		</div>
		<div class="flex gap-3">
			<input
				type="radio"
				value={'1'}
				bind:group={filterData.completed}
				on:change={handleOptionChange}
			/>
			<p class="text-sm">Completed</p>
		</div>
	</div>
</div>
