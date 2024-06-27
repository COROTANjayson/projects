<script lang="ts">
	import { Avatar, popup } from '@skeletonlabs/skeleton';
	import {
		IconDotsVertical,
		IconTrash,
		IconEdit,
		IconExclamationCircle,
		IconSquareRoundedPlusFilled,
		IconListCheck,
		IconCheck,
		IconLoader2
	} from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';
	import _ from 'lodash';
	import IconButton from '$lib/components/IconButton.svelte';
	import DeleteModal from './DeleteModal.svelte';
	import { deleteItem, isDeleteModalOpen, endpointStore } from '$lib/stores/sideBar';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { getHeadlineList, getIssueList, getTodoList } from '$lib/stores/ItemListstore';

	interface Props {
		onHandleUpdate?: () => void;
		onHandleRelatedNewIssueForm?: () => void;
		onHandleRelatedNewTodoForm?: () => void;
		// onCheckStatus?: () => void;
		// isLoading?: boolean;
		item: any;
		team: any;
		index: number;
		endpoint?: string;
	}
	export let item: Props['item'];
	export let team: Props['team'];
	export let index: Props['index'];
	// export let isLoading: Props['isLoading'];

	export let onHandleUpdate: Props['onHandleUpdate'] = () => {};
	export let onHandleRelatedNewIssueForm: Props['onHandleRelatedNewIssueForm'] = () => {};
	export let onHandleRelatedNewTodoForm: Props['onHandleRelatedNewTodoForm'] = () => {};
	// export let onCheckStatus: Props['onCheckStatus'] = () => {};
	export let endpoint: Props['endpoint'];
	const popupClick: any = {
		event: 'click',
		target: 'popupClick',
		placement: 'left',
		middleware: {
			offset: 0,
			shift: {
				crossAxis: true
			}
		}
	};
	let isHideMenu = false;
	onMount(() => {
		if ($page.url.pathname.includes('meeting')) {
			isHideMenu = true;
		}
	});
	$: isLoading = false;
	const checkStatus = async (item: any) => {
		isLoading = true;
		let resp = await axios.put(`/api/${endpoint}/status/${item.id}`, {
			isComplete: !item.isComplete
		});

		if (endpoint === 'headline') {
			getHeadlineList({ isComplete: false });
		} else if (endpoint === 'todo') {
			getTodoList({ isComplete: false });
		} else if (endpoint === 'issue') {
			getIssueList({ isComplete: false });
		}
		isLoading = false;

		// invalidateAll();
	};
</script>

<div
	class="flex items-center justify-between gap-2 bg-white py-2 px-4 dark:text-black cursor-pointer hover-shadow"
>
	<div class="flex items-center">
		{#if item.isComplete !== undefined}
			{#if isLoading}
				<div class="animate-spin">
					<IconLoader2 size={32} />
				</div>
			{:else if item.isComplete === false}
				<button
					disabled={isLoading}
					on:click={() => {
						checkStatus(item);
					}}
					class=" w-8 h-8 rounded-md border border-gray-400 hover:border-black"
				>
				</button>
			{:else}
				<button
					disabled={isLoading}
					on:click={() => {
						checkStatus(item);
					}}
					class=" w-8 h-8 rounded-md border bg-green-500 flex items-center justify-center text-white"
				>
					<IconCheck />
				</button>
			{/if}
		{/if}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="flex items-center gap-2 w-full" on:click={onHandleUpdate}>
		<Avatar width="w-10" initials={item.owner.name || ''} background="bg-primary-500" />
		<h2 class="dark:text-black">{item.name}</h2>
	</div>
	<div class="flex items-center gap-2">
		<IconButton onClick={onHandleRelatedNewIssueForm}>
			<div class="relative">
				<IconExclamationCircle size={35} />
				<IconSquareRoundedPlusFilled
					class="rounded-full text-primary-500 absolute -bottom-1 -right-1 bg-white"
					size={20}
				/>
			</div>
		</IconButton>
		<IconButton onClick={onHandleRelatedNewTodoForm}>
			<div class="relative">
				<IconListCheck size={30} />
				<IconSquareRoundedPlusFilled
					class="rounded-full text-primary-500 absolute -bottom-1 -right-1 bg-white"
					size={20}
				/>
			</div>
		</IconButton>
		{#if !isHideMenu}
			<button
				class="hover:bg-surface-50 rounded-full w-[40px] h-[40px] flex items-center justify-center"
				use:popup={{
					...popupClick,
					target: `popupClick-${team}-${index}`
				}}
			>
				<IconDotsVertical size={30} />
			</button>

			<div
				class="card py-4 variant-secondary w-[150px] z-10"
				data-popup={`popupClick-${team}-${index}`}
			>
				<div class="flex flex-col dark:text-white">
					<button
						on:click={onHandleUpdate}
						id="will-close"
						class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left"
					>
						<div class="flex gap-3">
							<IconEdit size={20} />
							<p>Edit</p>
						</div>
					</button>

					<button
						on:click={() => {
							if (endpoint) endpointStore.set(endpoint);
							deleteItem.set(item);
							isDeleteModalOpen.set(true);
						}}
						id="will-close"
						class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left w-full"
					>
						<div class="flex gap-3">
							<IconTrash size={20} />
							<p>Delete</p>
						</div>
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.hover-shadow {
		position: relative;
		transition: all 0.3s ease-in-out;
	}

	.hover-shadow:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		z-index: 10;
	}
</style>
