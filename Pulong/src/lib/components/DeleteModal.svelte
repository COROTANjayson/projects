<script lang="ts">
	import { IconX } from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';
	import _ from 'lodash';
	import IconButton from '$lib/components/IconButton.svelte';
	import {
		deleteItem,
		isDeleteModalKPIOpen,
		isDeleteModalOpen,
		endpointStore
	} from '$lib/stores/sideBar';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import {
		getKPIList,
		getGoalList,
		getHeadlineList,
		getTodoList,
		getIssueList,
		triggerToast
	} from '$lib/stores/ItemListstore';
	interface Props {
		// onHandleUpdate?: () => void;
		// onHandleRelatedNewIssueForm?: () => void;
		// onHandleRelatedNewTodoForm?: () => void;
		// onCheckStatus?: () => void;
		isLoading?: boolean;
		item: any;
		team: any;
		index: number;
		endpoint?: string;
	}
	
	// export let item: Props['item'];
	// export let team: Props['team'];
	// export let index: Props['index'];
	// export let isLoading: Props['isLoading'];

	// export let onHandleUpdate: Props['onHandleUpdate'] = () => {};
	// export let onHandleRelatedNewIssueForm: Props['onHandleRelatedNewIssueForm'] = () => {};
	// export let onHandleRelatedNewTodoForm: Props['onHandleRelatedNewTodoForm'] = () => {};
	// export let onCheckStatus: Props['onCheckStatus'] = () => {};
	// export let endpoint: Props['endpoint'];
	$: item = $deleteItem;
	let endpoints;
	let label = '';
	onMount(() => {
		let path = $page.url.pathname;
		if (path === 'dashboard/kpi' || $endpointStore === 'kpi') {
			endpoints = 'kpi';
			label = 'kpi';
		} else if (path === 'dashboard/goals' || $endpointStore === 'goals') {
			endpoints = 'goals';
			label = 'goal';
		} else if (path === 'dashboard/headlines' || $endpointStore === 'headlines') {
			label = 'headline';
		} else if (path === 'dashboard/todos' || $endpointStore === 'todos') {
			label = 'to-do';
		} else if (path === 'dashboard/issues' || $endpointStore === 'issues') {
			label = 'issue';
		}
	});
	let isLoading = false;
	const onDeletResult = () => {
		isLoading = true;
		return async (event: any) => {
			const { result } = event;
			if (result.data.success) {
				// invalidateAll();
				let { kpi, goal, headline, todo, issue } = result.data;
				let filters: any = {};
				if ($page.params && $page.params.id) {
					filters.teamId = $page.params.id;
				}
				if (kpi) {
					await getKPIList(filters);
					triggerToast('delete', 'Deleted a KPI item');
				}
				if (goal) {
					await getGoalList(filters);
					triggerToast('delete', 'Deleted a goal item');
				}
				if (headline) {
					filters.isComplete = false;
					await getHeadlineList(filters);
					triggerToast('delete', 'Deleted a headline item');
				}
				if (todo) {
					filters.isComplete = false;
					await getTodoList(filters);
					triggerToast('delete', 'Deleted a to-do item');
				}
				if (issue) {
					filters.isComplete = false;
					await getIssueList(filters);
					triggerToast('delete', 'Deleted a issue item');
				}
				isDeleteModalOpen.set(false);
				isDeleteModalKPIOpen.set(false);
				isLoading = true;
			}
		};
	};
</script>

<div class="fixed flex justify-center -top-5 inset-0 bg-black/50 z-50">
	<div class="relative mt-14 card w-[400px] h-[200px] flex flex-col p-6">
		<button
			class="absolute top-4 right-4"
			on:click={() => {
				isDeleteModalOpen.set(false);
				isDeleteModalKPIOpen.set(false);
			}}
		>
			<IconX size={20} />
		</button>
		<div class="flex-1">
			<p class="text-2xl uppercase">DELETE {label}</p>
			<p>Are you sure you want to remove this {label}?</p>
		</div>

		<div class="flex w-full items-end justify-end gap-3">
			<button
				on:click={() => {
					isDeleteModalOpen.set(false);
					isDeleteModalKPIOpen.set(false);
				}}
				class="btn variant-outline-surface rounded-lg">Cancel</button
			>
			<form
				method="POST"
				action={$endpointStore
					? `/dashboard/${$endpointStore}?/delete&id=${item.id}`
					: `?/delete&id=${item.id}`}
				use:enhance={onDeletResult}
			>
				<!-- <form method="POST" action={`?/delete&id=${item.id}`} use:enhance={onDeletResult}> -->
				<button disabled={isLoading} class="btn variant-filled-surface rounded-lg">Delete</button>
			</form>
		</div>
	</div>
</div>

<!-- <form
class="w-full"
method="POST"
action={endpoint
    ? `/dashboard/${endpoint}?/delete&id=${item.id}`
    : `?/delete&id=${item.id}`}
use:enhance
>
<button
    id="will-close"
    class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left w-full"
>
    <div class="flex gap-3">
        <IconTrash size={20} />
        <p>Delete</p>
    </div>
</button>
</form> -->
