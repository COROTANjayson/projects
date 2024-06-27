<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import _ from 'lodash';
	import { onMount } from 'svelte';
	interface Props {
		className?: string;
		cardClassName?: string;
	}
	export let className: Props['className'] = '';
	export let cardClassName: Props['cardClassName'] = '';

	export let list: any[];
	// export let super_form;
	export let name;
	export let target_name;
	export let form: any;

	// const { form } = super_form;

	let valueName = '';
	$: {
		if ($form[name]) {
			let item = _.find(list, { id: $form[name] });
			valueName = item ? item.name : '';
		}
	}

	let comboboxTarget = 'inputCombobox' + target_name + name;
	const inputCombobox: PopupSettings = {
		event: 'click',
		target: comboboxTarget,
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<!-- <input type="text" bind:value={searchTerm} on:input={handleSearch} /> -->
<button
	type="button"
	use:popup={inputCombobox}
	class={`btn variant-ghost-surface flex justify-start  rounded-md w-[200px] ${className}`}
>
	{valueName}
</button>

<div class={`card   shadow-xl py-2 z-10 w-[190px] ${cardClassName}`} data-popup={comboboxTarget}>
	<!-- <div class="m-2">
		<input
			type="text"
			placeholder="Search "
			bind:value={searchTerm}
			on:input={handleSearch}
			class="input w-full bg-white dark:bg-white rounded-md dark:text-black"
		/>
	</div> -->
	<div class={`${list.length > 3 ? 'h-[180px]' : ''}  overflow-y-auto`}>
		<ListBox rounded="rounded-none">
			{#each list as item}
				<ListBoxItem bind:group={$form[name]} {name} value={item.id}
					><span class="">{item.name}</span>
				</ListBoxItem>
			{/each}
		</ListBox>
	</div>
</div>
