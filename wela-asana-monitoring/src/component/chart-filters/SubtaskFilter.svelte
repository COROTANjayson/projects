<script lang="ts">
	import { removeFilter } from '$lib/store/filterStore';

	export let filter_data: any;

	let selectedOption = true;
	function handleOptionChange(event: any) {
		selectedOption = event.target.value;
	}
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<p class="text-xs font-medium text-gray-600">Subtask</p>
		<button
			on:click={() => {
				removeFilter(filter_data);
			}}
			class="p-0.5 hover:bg-slate-100 rounded"><img src="/x.svg" width="15" alt="" /></button
		>
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex gap-3">
			<input type="radio" value={'0'} bind:group={selectedOption} on:change={handleOptionChange} />
			<p class="text-sm">Don't show subtasks</p>
		</div>
		<div class="flex gap-3">
			<input type="radio" value={'1'} bind:group={selectedOption} on:change={handleOptionChange} />
			<p class="text-sm">Only show subtasks</p>
		</div>
	</div>
</div>
