<script lang="ts">
	import { removeFilter } from '$lib/store/filterStore';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	export let filter_data: any;
	import {
		getCurrentDateAtMidnight,
		getDateByDays,
		getDateByMonth,
		getCurrentDateAt1159PM,
		getDateByWeeks,
		getDateAt1159PM,
		getDateAtMidnight
	} from '$lib/utils/dateUtils';
	import { updateFilter } from '$lib/store/filterStore';

	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};

	let dateFilter = filter_data;


	onMount(() => {
		dateFilter = filter_data
	});
	let number = 1;

	let fromChosenDate: any;
	let toChosenDate: any;

	let isGetDate = true;
	let debounceTimer: any;

	const fetchDate = () => {
		let fromDate: any;
		let toDate: any;
		if (dateFilter.date_option === 'On') {
			fromDate = fromChosenDate ? getDateAtMidnight(fromChosenDate).toISOString() : undefined;
			toDate = fromChosenDate ? getDateAt1159PM(fromChosenDate).toISOString() : undefined;
			delete dateFilter.number_date_span;
			delete dateFilter.date_span;
		}
		if (dateFilter.date_option === 'Between') {
			fromDate = fromChosenDate ? getDateAtMidnight(fromChosenDate).toISOString() : undefined;
			toDate = toChosenDate ? getDateAt1159PM(toChosenDate).toISOString() : undefined;
			delete dateFilter.number_date_span;
			delete dateFilter.date_span;
		}
		if (dateFilter.date_span === 'Days') {
			if (dateFilter.date_option === 'Within the last') {
				fromDate = getDateByDays('prev', dateFilter.number_date_span).toISOString();
				toDate = getCurrentDateAt1159PM().toISOString();
			}
			if (dateFilter.date_option === 'Within the next') {
				fromDate = getCurrentDateAtMidnight().toISOString();
				toDate = getDateByDays('next', dateFilter.number_date_span).toISOString();
			}
		}
		if (dateFilter.date_span === 'Weeks') {
			if (dateFilter.date_option === 'Within the last') {
				fromDate = getDateByWeeks('prev', dateFilter.number_date_span).toISOString();
				toDate = getCurrentDateAt1159PM().toISOString();
			}
			if (dateFilter.date_option === 'Within the next') {
				fromDate = getCurrentDateAtMidnight().toISOString();
				toDate = getDateByWeeks('next', dateFilter.number_date_span).toISOString();
			}
		}
		if (dateFilter.date_span === 'Month') {
			if (dateFilter.date_option === 'Within the last') {
				fromDate = getDateByMonth(dateFilter.number_date_span, 'prev');
				toDate = getDateByMonth(0, 'next');
			}
			if (dateFilter.date_option === 'Within the next') {
				fromDate = getDateByMonth(-1, 'next');
				toDate = getDateByMonth(dateFilter.number_date_span, 'next');
			}
		}
		if (fromDate && toDate) {
			dateFilter = {
				...dateFilter,
				from_date: fromDate,
				to_date: toDate
			};
			updateFilter(dateFilter);
		}
	};

	$: {
		if (dateFilter) {
			fetchDate();
		}
	}

	let dateOnChange = (event: any) => {
		fromChosenDate = event.target.value;
		fetchDate();
	};
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<p class="text-xs font-medium text-gray-600">{filter_data.sub}</p>
		<button
			on:click={() => {
				removeFilter(filter_data);
			}}
			class="p-0.5 hover:bg-slate-100 rounded"><img src="/x.svg" width="15" alt="" /></button
		>
	</div>
	<div class="flex flex-col gap-4">
		<div class="dropdown dropdown-top">
			<div
				tabindex="0"
				role="button"
				class=" px-2 text-sm bg-white border py-2 rounded-md flex justify-between"
			>
				<p>{dateFilter.date_option}</p>
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
						dateFilter.date_option = 'Within the last';
						dateFilter.number_date_span = 1
						dateFilter.date_span = 'Month'
						handleClick();
					}}
					>Within the last
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						dateFilter.date_option = 'Within the next';
						dateFilter.number_date_span = 1
						dateFilter.date_span = 'Month'
						handleClick();
					}}
					>Within the next
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						dateFilter.date_option = 'Between';
						handleClick();
					}}
					>Between
				</button>
				<button
					class="flex justify-start hover:bg-gray-50 px-2 py-1"
					on:click={() => {
						dateFilter.date_option = 'On';
						handleClick();
					}}
					>On
				</button>
			</div>
		</div>
		{#if dateFilter.date_option === 'Within the next' || dateFilter.date_option === 'Within the last'}
			<div class="flex gap-3">
				<input
					type="number"
					min="1"
					bind:value={dateFilter.number_date_span}
					class="py-1 px-2 rounded-md focus:outline-none border w-[50px]"
				/>
				<div class="dropdown dropdown-top">
					<div
						tabindex="0"
						role="button"
						class=" px-2 text-sm bg-white border py-2 rounded-md flex justify-between w-[100px]"
					>
						<p>{dateFilter.date_span}</p>
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
								dateFilter.date_span = 'Days';
								handleClick();
							}}
							>Days
						</button>
						<button
							class="flex justify-start hover:bg-gray-50 px-2 py-1"
							on:click={() => {
								dateFilter.date_span = 'Weeks';
								handleClick();
							}}
							>Weeks
						</button>
						<button
							class="flex justify-start hover:bg-gray-50 px-2 py-1"
							on:click={() => {
								dateFilter.date_span = 'Month';
								handleClick();
							}}
							>Month
						</button>
					</div>
				</div>
			</div>
		{:else if dateFilter.date_option === 'Between'}
			<div class="flex items-center justify-between">
				<input
					bind:value={fromChosenDate}
					on:change={fetchDate}
					type="date"
					class="py-2 px-2 rounded-md focus:outline-none border text-sm"
				/>
				<p class="text-xs font-medium text-gray-600">and</p>
				<input
					type="date"
					bind:value={toChosenDate}
					on:change={fetchDate}
					class="py-2 px-2 rounded-md focus:outline-none border text-sm"
				/>
			</div>
		{:else}
			<input
				bind:value={fromChosenDate}
				on:change={fetchDate}
				type="date"
				class="py-2 px-2 rounded-md focus:outline-none border text-sm w-[200px]"
			/>
		{/if}
	</div>
</div>
