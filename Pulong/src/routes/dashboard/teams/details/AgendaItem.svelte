<script lang="ts">
	import {
		IconBulb,
		IconChartDots2,
		IconCircleCheck,
		IconEdit,
		IconExclamationCircle,
		IconListCheck,
		IconNews,
		IconTarget,
		IconUsers,
		IconUsersGroup
	} from '@tabler/icons-svelte';
	interface Props {
		form?: any;
		errors?: any;
		item: any;
		// icon?: any;
	}
	export let form: Props['form'];
	export let errors: Props['errors'];
	export let item: Props['item'];

	// export let icon: Props['icon'];

	let isEdit = false;

	const onChangeInput = () => {
		isEdit = false;
	};
</script>

<div class="card flex items-center justify-between varient-ghost-surface rounded-md py-3 px-4">
	<div class="flex items-center gap-5">
		<!-- <svelte:component this={icon} /> -->
		{#if item.name === 'Segue'}
			<IconUsersGroup />
		{:else if item.name === 'KPI'}
			<IconChartDots2 />
		{:else if item.name === 'Goals'}
			<IconTarget />
		{:else if item.name === 'Headlines'}
			<IconNews />
		{:else if item.name === 'To-Do'}
			<IconListCheck />
		{:else if item.name === 'IDS'}
			<IconExclamationCircle />
		{:else if item.name === 'Conclude'}
			<IconBulb />
		{/if}

		<div class="flex items-end gap-2">
			<p class="text-xl font-normal">{item.name}</p>
			{#if !isEdit}
				<p class="text-gray-500 dark:text-gray-500">{item.minutes}m</p>
			{/if}
		</div>
	</div>
	<div class="flex gap-2">
		{#if isEdit}
			<input type="number" bind:value={item.minutes} class="border-none w-24 h-7 rounded-sm" />
			<button
				on:click={() => {
					onChangeInput();
				}}
				type="button"
				class="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100/30 dark:hover:bg-gray-300/30"
			>
				<IconCircleCheck size={20} class="text-green-500 dark:text-green-500" />
			</button>
		{:else}
			<button
				on:click={() => {
					isEdit = true;
				}}
				type="button"
				class="w-[30px] h-[30px] flex items-center justify-center rounded-full"
			>
				<IconEdit size={20} class="text-gray-500 dark:text-gray-500" />
			</button>
		{/if}
	</div>
</div>

<!-- <style>
	/* Apply styles specifically to the input with the class "no-spinners" */

	/* For Chrome, Safari, Edge, and Opera */
	.no-spinners::-webkit-outer-spin-button,
	.no-spinners::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* For Firefox */
	.no-spinners {
		-moz-appearance: textfield;
	}
</style> -->
