<script lang="ts">
	import { clickOutside } from '$lib/utils/clickOutside';
	import {
		addToIncludedArray,
		allChartTask,
		chart_data,
		filtered_included_array,
		handleIncludedArray,
		removeFromIncludedArray,
		searchInIncludedArray
	} from '$lib/store/chartStore';

	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};

	let searchInput: string = '';

	let isFocused: boolean;
	let isDropdown: boolean;
	function handleFocus() {
		isFocused = true;
		isDropdown = true;
	}

	function handleBlur() {
		isFocused = false;
		isDropdown = false;
	}

	const onChangeIncludedFrom = (value: string) => {
		if ($chart_data.include_from !== value) {
			allChartTask.set([]);
			handleIncludedArray(value);
		}
		handleClick();
	};
</script>

<h5 class="font-bold py-6 px-3">Chart details</h5>
<div class="px-3 space-y-4">
	<div class=" space-y-2">
		<p class="text-xs font-medium text-gray-600">Chart Style</p>
		<div class="dropdown w-full">
			<div
				tabindex="0"
				role="button"
				class=" px-2 text-sm w-full bg-white border py-2 rounded-md flex justify-between"
			>
				<p>Number</p>
				<img src="/arrow-down.svg" alt="" />
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow w-52 border bg-white rounded">
				<button
					class="flex justify-start"
					on:click={() => {
						handleClick();
					}}>Number</button
				>
			</div>
		</div>
	</div>
	<div class=" space-y-2">
		<p class="text-xs font-medium text-gray-600">Report on</p>
		<div class="dropdown w-full">
			<div
				tabindex="0"
				role="button"
				class=" px-2 text-sm w-full bg-white border py-2 rounded-md flex justify-between"
			>
				<p>{$chart_data.report_on}</p>
				<img src="/arrow-down.svg" alt="" />
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="dropdown-content z-[1] menu py-2 px-0 shadow w-52 border bg-white rounded"
			>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						// chart_data.report_on = 'Tasks';
						chart_data.set({
							...$chart_data,
							report_on: 'Tasks'
						});
						handleClick();
					}}
					>Tasks
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						// chart_data.report_on = 'Projects';
						chart_data.set({
							...$chart_data,
							report_on: 'Projects'
						});
						handleClick();
					}}
					>Projects
				</button>
			</div>
		</div>
	</div>
	<div class=" space-y-2">
		<p class="text-xs font-medium text-gray-600">
			Included <span class=" lowercase">{$chart_data.report_on}</span> from
		</p>
		<div class="dropdown w-full">
			<div
				tabindex="0"
				role="button"
				class=" px-2 text-sm w-full bg-white border py-2 rounded-md flex justify-between"
			>
				<p>{$chart_data.include_from}</p>
				<img src="/arrow-down.svg" alt="" />
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="dropdown-content z-[1] menu py-2 px-0 shadow w-52 border bg-white rounded"
			>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						onChangeIncludedFrom('wela.online');
						// handleClick();
					}}
					>wela.online
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						onChangeIncludedFrom('Teams');
						handleClick();
					}}
					>Teams
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						onChangeIncludedFrom('Projects owned by');
						handleClick();
					}}
					>Projects owned by
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						onChangeIncludedFrom('Specific projects');
						handleClick();
					}}
					>Specific projects
				</button>
			</div>
		</div>
		{#if $chart_data.include_from !== 'wela.online' && $chart_data.include_from !== ''}
			<div class=" px-2 text-sm w-full border py-2 rounded-md space-y-1">
				{#each $chart_data.include_from_array as data}
					<div
						class="flex justify-between hover:bg-gray-50 px-2 py-1 rounded-full border bg-gray-100 w-auto"
					>
						{data.name}
						<button
							on:click={() => {
								removeFromIncludedArray(data);
								handleBlur();
							}}
							class="hover:bg-slate-600 rounded-full p-1 text-white group w-auto"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 20 21"
								fill="none"
							>
								<path
									class=" group-hover:fill-white"
									d="M6.28033 5.86185C5.98744 5.56167 5.51256 5.56167 5.21967 5.86185C4.92678 6.16203 4.92678 6.64872 5.21967 6.9489L8.93934 10.7611L5.21967 14.5733C4.92678 14.8735 4.92678 15.3602 5.21967 15.6603C5.51256 15.9605 5.98744 15.9605 6.28033 15.6603L10 11.8481L13.7197 15.6603C14.0126 15.9605 14.4874 15.9605 14.7803 15.6603C15.0732 15.3602 15.0732 14.8735 14.7803 14.5733L11.0607 10.7611L14.7803 6.9489C15.0732 6.64872 15.0732 6.16203 14.7803 5.86185C14.4874 5.56167 14.0126 5.56167 13.7197 5.86185L10 9.67405L6.28033 5.86185Z"
									fill="#0F172A"
								/>
							</svg>
						</button>
					</div>
				{/each}

				<div class="relative w-full">
					<input
						on:focus={handleFocus}
						on:blur={() => {
							isFocused = false;
						}}
						bind:value={searchInput}
						on:input={() => {
							searchInIncludedArray(searchInput);
						}}
						type="text"
						class="h-[18px] focus:outline-none w-full"
					/>
					{#if isDropdown}
						<div
							use:clickOutside={() => {
								if (!isFocused && isDropdown) {
									handleBlur();
								}
							}}
							class={`absolute rounded left-0 border bg-white p-2 flex flex-col  overflow-y-auto z-30 
                            ${$filtered_included_array.length <= 4 ? '' : 'h-[250px]'}
                            `}
						>
							{#each $filtered_included_array as includes}
								<button
									on:click={() => {
										addToIncludedArray({ gid: includes.gid, name: includes.name });
										searchInput = '';
										handleBlur();
									}}
									class="flex justify-start hover:bg-gray-50 px-2 py-1 text-left"
								>
									{includes.name}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
