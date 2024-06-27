<script lang="ts">
	import { asanaData } from '$lib/store/chartStore';
	import { removeFilter, updateFilter } from '$lib/store/filterStore';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { onMount } from 'svelte';
	import _ from 'lodash';

	export let filter_data: any;
	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
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

	let creatorFilterArray: string | any[] = [];
	let searchInput: string = '';
	let creator_filter: any = {};
	let creators: any = [];

	onMount(() => {
		creatorFilterArray = $asanaData.allUsers;
		creator_filter = filter_data;
		creators = filter_data.creators ? filter_data.creators : [];
	});

	const addToCreator = (data: any) => {
		const isFind = creators.find((val: { name: any }) => {
			return val.name === data.name;
		});
		if (!isFind) {
			creators = [...creators, data];
			updateCreatorArray();
		}
		searchInput = '';
		handleBlur();
	};
	const removeFromCreators = (data: any) => {
		const array = creators.filter((val: { name: any }) => {
			return val.name !== data.name;
		});

		creators = array;
		updateCreatorArray();

		handleBlur();
	};
	export const searchCreators = (searchInput: string) => {
		if (searchInput === '' || !searchInput) {
			creatorFilterArray = $asanaData.allUsers;
		} else {
			const filteredArray = $asanaData.allUsers.filter((item: { name: string }) =>
				item.name.toLowerCase().includes(searchInput.toLowerCase())
			);
			creatorFilterArray = filteredArray;
		}
	};
	const updateCreatorArray = () => {
		creator_filter.creators = creators;
		updateFilter(creator_filter);
	};
</script>

<div class="space-y-3">
	<div class="flex justify-between">
		<p class="text-xs font-medium text-gray-600">Creators</p>
		<button
			on:click={() => {
				removeFilter(filter_data);
			}}
			class="p-0.5 hover:bg-slate-100 rounded"><img src="/x.svg" width="15" alt="" /></button
		>
	</div>
	<div class="dropdown">
		<div
			tabindex="0"
			role="button"
			class=" px-2 text-sm bg-white border py-2 rounded-md flex justify-between w-[100px]"
		>
			<p>{creator_filter.is_included ? 'Include' : 'Exclude'}</p>
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
					creator_filter.is_included = true;
					updateCreatorArray();

					handleClick();
				}}
				>Include
			</button>
			<button
				class="flex justify-start hover:bg-gray-50 px-2 py-1"
				on:click={() => {
					creator_filter.is_included = false;
					updateCreatorArray();
					handleClick();
				}}
				>Exclude
			</button>
		</div>
	</div>
	<div class=" px-2 text-sm w-full border py-2 rounded-md space-y-1">
		{#each creators as creator}
			<div
				class="flex justify-between hover:bg-gray-50 px-2 py-1 rounded-full border bg-gray-100 w-auto"
			>
				{creator.name}
				<button
					on:click={() => {
						removeFromCreators(creator);
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
					searchCreators(searchInput);
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
					class={`absolute rounded left-0 bottom-7 border bg-white p-2 flex flex-col  overflow-y-auto z-30   w-full
                ${creatorFilterArray.length <= 4 ? '' : 'h-[250px]'}
                `}
				>
					{#if creatorFilterArray.length > 0}
						{#each creatorFilterArray as creator}
							<button
								on:click={() => {
									addToCreator(creator);
								}}
								class="flex justify-start hover:bg-gray-50 px-2 py-1 text-left"
							>
								{creator.name}
							</button>
						{/each}
					{:else}
						<div class="w-full">No matches found</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
