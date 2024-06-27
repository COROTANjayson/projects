<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import { IconChevronDown } from '@tabler/icons-svelte';
	export let list: any[];
	export let name;
	export let value: string;

	let valueName = '';
	$: {
		if (value === 'All') {
			valueName = 'All';
		} else {
			let item = _.find(list, { id: value });
			valueName = item ? item.name : '';
		}
	}

	onMount(() => {});
	let comboboxTarget = 'inputCombobox' + name;
	const inputCombobox: PopupSettings = {
		event: 'click',
		target: comboboxTarget,
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
	let filteredItems = list;
</script>

<!-- <input type="text" bind:value={searchTerm} on:input={handleSearch} /> -->
<button
	type="button"
	use:popup={inputCombobox}
	class={`btn variant-outline flex justify-between dark:bg-white bg-white rounded-md dark:text-black h-[44px]  w-[220px]`}
>
	<div class="truncate">
		<span class="font-medium">Teams: </span>
		<span>{valueName}</span>
	</div>
	<IconChevronDown stroke={1} />
</button>

<div
	class={`card   bg-white dark:bg-white shadow-xl py-2 z-10`}
	data-popup={comboboxTarget}
>
	<div class={`${filteredItems.length > 3 ? 'h-[180px]' : ''}  overflow-x-hidden overflow-y-auto`}>
		<ListBox rounded="rounded-none" active="bg-blue-100  ">
			<ListBoxItem bind:group={value} {name} value={'All'}
				><span class="text-gray-700">All</span>
			</ListBoxItem>
			{#each filteredItems as item}
				<ListBoxItem class=" " bind:group={value} {name} value={item.id}
					> 
					<p class="text-gray-700 truncate w-[200px]">{item.name}</p>
				</ListBoxItem>
			{/each}
		</ListBox>
	</div>
</div>
