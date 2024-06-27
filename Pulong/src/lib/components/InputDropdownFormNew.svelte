<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import _ from 'lodash';
	import { onMount } from 'svelte';

	interface Props {
		isSearch: boolean;
		className?: string;
		cardClassName?: string;
	}
	export let className: Props['className'] = '';
	export let cardClassName: Props['cardClassName'] = '';
	export let isSearch: Props['isSearch'] = true;
	export let list: any[];
	export let super_form;
	export let name;
	export let target_name;

	const { form } = super_form;

	let valueName = '';
	$: {
		if ($form[name]) {
			let item = _.find(list, { id: $form[name] });
			valueName = item ? item.name : '';
		}
	}

	onMount(() => {
		if ($form[name]) {
			let item = _.find(list, { id: $form[name] });
			valueName = item ? item.name : '';
		}
	});
	let comboboxTarget = 'inputCombobox' + target_name + name;
	const inputCombobox: PopupSettings = {
		event: 'click',
		target: comboboxTarget,
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
	let searchTerm = '';
	let filteredItems = list;

	function handleSearch() {
		filteredItems = list.filter((item: any) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
</script>

<!-- <input type="text" bind:value={searchTerm} on:input={handleSearch} /> -->
<button
	type="button"
	use:popup={inputCombobox}
	class={`btn variant-outline flex justify-start dark:bg-white bg-white rounded-md dark:text-black w-[170px] ${className}`}
>
	{valueName}
</button>

<div
	class={`card  bg-white dark:bg-white shadow-xl py-2 z-10  w-[160px] ${cardClassName ? cardClassName : ''}`}
	data-popup={comboboxTarget}
>
	{#if isSearch}
		<div class="m-2">
			<input
				type="text"
				placeholder="Search "
				bind:value={searchTerm}
				on:input={handleSearch}
				class="input w-full bg-white dark:bg-white rounded-md dark:text-black"
			/>
		</div>
	{/if}
	<div class={`${filteredItems.length > 3 ? 'h-[180px]' : ''}  overflow-y-auto `}>
		<ListBox rounded="rounded-none" active="bg-blue-100  ">
			{#each filteredItems as item}
				<ListBoxItem bind:group={$form[name]} {name} value={item.id}
					><span class="text-gray-700">{item.name}</span>
				</ListBoxItem>
			{/each}
		</ListBox>
	</div>
</div>
