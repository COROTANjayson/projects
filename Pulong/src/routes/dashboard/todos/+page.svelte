<script lang="ts">
	import type { PageData } from './$types';

	import { Avatar, getToastStore, popup } from '@skeletonlabs/skeleton';
	import {
		IconDotsVertical,
		IconTrash,
		IconEdit,
		IconPlus,
		IconExclamationCircle,
		IconSquareRoundedPlusFilled,
		IconListCheck
	} from '@tabler/icons-svelte';
	import {
		onNewForm,
		relatedFrom,
		onUpdateForm,
		handleRelation,
		todoData
	} from '$lib/stores/forms';
	import { enhance } from '$app/forms';
	import _ from 'lodash';
	import DropDown from '$lib/components/DropDown.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { formatInputDate } from '$lib/utils/formatDate';
	import ListItemPage from '$lib/components/ListItemPage.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { io } from 'socket.io-client';
	import TodoList from './TodoList.svelte';
	export let data: PageData;
	import { isDeleteModalOpen } from '$lib/stores/sideBar';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import NoDisplay from '$lib/components/NoDisplay.svelte';
	import { getTodoList, todoList, toastContent } from '$lib/stores/ItemListstore';
	import SkeletonList from '$lib/components/SkeletonList.svelte';

	// $: todos = data.todos ? data.todos : ([] as any[]);
	$: todos = $todoList;
	let toastStore = getToastStore();

	$: {
		if ($toastContent) {
			toastStore.trigger($toastContent);
			toastContent.set(undefined);
		}
	}
	let isLoading = false;
	onMount(async () => {
		isLoading = true;
		await getTodoList({ isComplete: false });
		isLoading = false;
	});

	let groupedRock: any[] = [];
	let teamIds: any[] = [];
	let teamIdsFilter: any[] = [];
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
	onMount(() => {
		// const url = 'http://localhost:3000/issue?apiKey=hello';
		// const url = 'http://localhost:3000';
		// const socket = io(url);
		// socket.on('issue_added', async (event: any) => {
		// 	console.log('received UPDATE event from server', event);
		// 	let resp = await axios.get(`/api/issue`);
		// 	todos = resp.data.todos;
		// });
		// socket.on('issue_added', async (event) => {
		// 	console.log('received UPDATE event from server', event.created);
		// 	issues.push(event.created)
		// 	let resp = await axios.get(`/api/issue`);
		// 	issues = resp.data.issues
		// });
		// return () => {
		// 	socket.off('issue_added');
		// 	socket.disconnect();
		// };
	});

	// onMount(() => {
	// 	const url = 'http://localhost:3000';

	// 	const socket = io(url);
	// 	socket.on('todo_added', async (event: any) => {
	// 		console.log('received UPDATE event from server', event);
	// 		todos.push(event.created);
	// 		let resp = await axios.get(`/api/issue`);
	// 		todos = resp.data.issues;
	// 	});

	// 	return () => {
	// 		socket.off('issue_added');
	// 	};
	// });
	const handleUpdate = (data: any) => {
		let formData = {
			id: data.id,
			name: data.name,
			ownerId: data.ownerId,
			teamId: data.team.id,
			dueDate: formatInputDate(data.dueDate),
			notes: data.notes,
			creatorId: data.creatorId
		};
		let relation = handleRelation(data, 'Todo');
		if (relation) {
			formData = {
				...formData,
				...relation
			};
		}
		todoData.set(formData);
		onUpdateForm('Todo', data);
	};

	const getTeamName = (teamId: string) => {
		let team = _.find(data.teams, { id: teamId });
		return team.name;
	};
	const groupedHeadlineByTeamId = () => {
		let arrayList = todos.reduce((acc: any, obj: any) => {
			const { teamId, ...rest } = obj;
			acc[teamId] = acc[teamId] || [];
			acc[teamId].push(rest);
			return acc;
		}, {});
		return arrayList;
	};

	const handleNewRelatedTodo = (value: any, type: string) => {
		relatedFrom.set({
			todoId: value.id,
			name: value.name
		});
		onNewForm(type, true);
	};
	$: {
		if (todos) {
			groupedRock = groupedHeadlineByTeamId();
			teamIds = Object.keys(groupedRock);
		}
	}
	let teamFilter = 'All';
	$: {
		if (teamFilter == 'All') {
			teamIdsFilter = teamIds;
		} else {
			teamIdsFilter = teamIds.filter((element) => element === teamFilter);
		}
	}
</script>

{#if $isDeleteModalOpen}
	<DeleteModal />
{/if}
<div class="w-full relative">
	<div
		class="px-5 sticky top-0 right-0 w-full h-[60px] dark:bg-surface-900 bg-surface-200 shadow-md z-20 flex justify-between items-center"
	>
		<DropDown list={data.teams} bind:value={teamFilter} name={'team_filter'} />
		<button
			on:click={() => {
				onNewForm('Todo');
			}}
			type="button"
			class={`btn  variant-filled-primary flex justify-between  rounded-md h-[44px]  dark:text-white font-semibold`}
		>
			<span class="text-xl">ADD</span>
			<span><IconPlus size={25} /></span>
		</button>
	</div>
	{#if isLoading}
		<div class="px-5 py-3">
			<SkeletonList />
		</div>
	{:else if teamIdsFilter.length <= 0}
		<NoDisplay label="To-do" />
	{:else}
		<div class="w-full space-y-3 px-5 py-3">
			{#each teamIdsFilter as team}
				<div class="space-y-2">
					<p class="font-normal text-xl uppercase tracking-widest">
						{getTeamName(team)}
					</p>
					<div>
						<TodoList {team} list={groupedRock[team]} endpoint={'todo'} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
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

	.flex-item {
		margin-bottom: 10px; /* Adjust as necessary */
	}
</style>
