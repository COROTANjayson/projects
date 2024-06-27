<script lang="ts">
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import { IconNews, IconListCheck, IconExclamationCircle, IconTarget } from '@tabler/icons-svelte';
	import { quintOut } from 'svelte/easing';
	import { sideBarRight } from '$lib/stores/sideBar';
	import GoalsForm from './GoalsForm.svelte';
	import { formName, onNewForm, editForm } from '$lib/stores/forms';
	import HeadlineForm from './HeadlineForm.svelte';
	import IssueForm from './IssueForm.svelte';
	import TodoForm from './TodoForm.svelte';
	import KpiForm from './KPIForm.svelte';
	import { clickOutside, clickInside } from '$lib/utils/clickOutside';

	export let data: any;
	const onClose = () => {
		formName.set('');
		sideBarRight.set(false);
		editForm.set(false);
	};
</script>

{#if $sideBarRight}
	<div
		use:clickInside={onClose}
		class="fixed inset-0 bg-black/50 top-0 right-0 z-30"
	></div>
{/if}

<div class="fixed inset-y-0 top-0 right-0 flex h-full z-50">
	<AppRail width=" w-14" height="h-full">
		<AppRailAnchor
			on:click={() => {
				onNewForm('Headline');
			}}
			selected={$formName === 'Headline'}
			title="Headlines"
		>
			<svelte:fragment slot="lead">
				<IconNews size={20} />
			</svelte:fragment>
		</AppRailAnchor>
		<AppRailAnchor
			on:click={() => {
				onNewForm('Todo');
			}}
			selected={$formName === 'Todo'}
			title="Todos"
		>
			<svelte:fragment slot="lead">
				<IconListCheck size={20} />
			</svelte:fragment>
		</AppRailAnchor>

		<AppRailAnchor
			on:click={() => {
				onNewForm('Issue');
			}}
			selected={$formName === 'Issue'}
			title="Issues"
		>
			<svelte:fragment slot="lead">
				<IconExclamationCircle size={20} />
			</svelte:fragment>
		</AppRailAnchor>
		<AppRailAnchor
			on:click={() => {
				onNewForm('Goal');
			}}
			selected={$formName === 'Goal'}
			title="Goals"
		>
			<svelte:fragment slot="lead">
				<IconTarget size={20} />
			</svelte:fragment>
		</AppRailAnchor>
	</AppRail>

	<div
		transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
		class={` h-full transition-all   bg-white  ${$sideBarRight ? 'w-[415px]' : 'w-0'} `}
	>
		{#if $sideBarRight && $formName === 'Goal'}
			<GoalsForm {data} />
		{:else if $sideBarRight && $formName === 'Headline'}
			<HeadlineForm {data} />
		{:else if $sideBarRight && $formName === 'Issue'}
			<IssueForm {data} />
		{:else if $sideBarRight && $formName === 'Todo'}
			<TodoForm {data} />
		{:else if $sideBarRight && $formName === 'KPI'}
			<KpiForm {data} />
		{/if}
	</div>
</div>
