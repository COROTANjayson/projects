<script lang="ts">
	import { filterOptions, selectedFilters } from '$lib/store/filterStore';
	import AssigneeFilter from '$component/chart-filters/AssigneeFilter.svelte';
	import CreatorFilter from '$component/chart-filters/CreatorFilter.svelte';
	import DateFilter from '$component/chart-filters/DateFilter.svelte';
	import ExcludeFilter from '$component/chart-filters/ExcludeFilter.svelte';
	import SubtaskFilter from '$component/chart-filters/SubtaskFilter.svelte';
	import TaskCompletionStatus from '$component/chart-filters/TaskCompletionStatus.svelte';
	import TaskStatusFilter from '$component/chart-filters/TaskStatusFilter.svelte';
	import PrioritLevelFilter from '$component/chart-filters/PrioritLevelFilter.svelte';
	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};

	const addToSelectedFilters = (val: any) => {
		let value: any = {
			...val
		};
		if (val.name == 'Assignee' || val.name == 'Creator') {
			value.is_included = true;
		} else if (val.name == 'Subtask') {
			value.show_subtask = '0';
		} else if (val.name == 'Date') {
			value.date_option = 'Within the last';
			value.number_date_span = 1;
			value.date_span = 'Month'
		} else if (val.name == 'Task completion status') {
			value.completed = '0';
		} else if (val.name == 'Task status') {
			value.status = 'Overdue';
		} else if (val.name == 'Priority level') {
			value.level = 'High priority';
		}
		let filters;
		if (value.name === 'Excluded tasks') {
			let excluded = $filterOptions.find((data: any) => data.name == value.name);
			if (excluded.sub.length > 0) {
				let sub_array = excluded.sub.filter((sub: any) => sub.name !== value.sub);
				let map = $filterOptions.map((data: any) => {
					if (data.name == value.name) {
						data.sub = sub_array;
					}
					return data;
				});
				excluded.sub = sub_array;
				filterOptions.set(map);
			} else {
				filters = $filterOptions.map((data: any) => {
					if (data.name === value.name) {
						data.show = false;
					}
					return data;
				});
				filterOptions.set(filters);
			}
		} else {
			filters = $filterOptions.map((data: any) => {
				if (data.name === value.name) {
					data.show = false;
				}
				return data;
			});
			filterOptions.set(filters);
		}
		selectedFilters.set([...$selectedFilters, value]);
	};

</script>

<h5 class="pb-6">Filters</h5>
<div class="w-full space-y-3">
	<div class="space-y-5">
		{#each $selectedFilters as filterComp}
			{#if filterComp.name === 'Assignee'}
				<AssigneeFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Creator'}
				<CreatorFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Subtask'}
				<SubtaskFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Date'}
				<DateFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Task status'}
				<TaskStatusFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Excluded tasks'}
				<ExcludeFilter filter_data={filterComp} />
			{:else if filterComp.name === 'Task completion status'}
				<TaskCompletionStatus filter_data={filterComp} />
			{:else if filterComp.name === 'Priority level'}
				<PrioritLevelFilter filter_data={filterComp} />
			{/if}
		{/each}
	</div>

	<div class="dropdown dropdown-top">
		<div
			tabindex="0"
			role="button"
			class=" px-2 text-xs font-semibold text-gray-500 bg-white py-1 hover:bg-slate-200 rounded"
		>
			<p>+ Add Filter</p>
		</div>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<ul tabindex="0" class=" dropdown-content z-[1] menu w-56 border bg-white rounded px-0">
			{#each $filterOptions as option}
				{#if option.sub && option.show}
					<li>
						<details>
							<summary class="hover:bg-gray-50">{option.name}</summary>
							<ul>
								{#each option.sub as sub}
									<li>
										<button
											class="hover:bg-gray-50"
											on:click={() => {
												addToSelectedFilters({ name: option.name, sub: sub.name });

												handleClick();
											}}>{sub.name}</button
										>
									</li>
								{/each}
							</ul>
						</details>
					</li>
				{:else if option.show}
					<li>
						<button
							on:click={() => {
								addToSelectedFilters({ name: option.name });
								handleClick();
							}}
							class="hover:bg-gray-50"
							>{option.name}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>
