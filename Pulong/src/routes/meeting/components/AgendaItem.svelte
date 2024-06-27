<script lang="ts">
	import { AppRail, AppRailAnchor, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import {
		IconNews,
		IconListCheck,
		IconExclamationCircle,
		IconTarget,
		IconUsersGroup,
		IconChartDots2,
		IconBulb
	} from '@tabler/icons-svelte';
	import { selectedAgenda } from '$lib/stores/meetingStore';
	interface Props {
		onClick?: () => void;
		item: any;
		className?: string;
	}
	export let onClick: Props['onClick'] = () => {};
	export let item: Props['item'];

	const onSelect = () => {
		selectedAgenda.set(item.name);
	};
</script>

<button
	on:click={onSelect}
	class={`flex gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
${item.name === $selectedAgenda ? 'bg-green-100' : ''}
`}
>
	{#if item.name === 'Segue'}
		<IconUsersGroup size={20} />
	{:else if item.name === 'KPI'}
		<IconChartDots2 size={20} />
	{:else if item.name === 'Goals'}
		<IconTarget size={20} />
	{:else if item.name === 'Headlines'}
		<IconNews size={20} />
	{:else if item.name === 'To-Do'}
		<IconListCheck size={20} />
	{:else if item.name === 'IDS'}
		<IconExclamationCircle size={20} />
	{:else if item.name === 'Conclude'}
		<IconBulb size={20} />
	{/if}
	<p>{item.name} <span class="text-gray-400">{item.minutes}m</span></p>
</button>
