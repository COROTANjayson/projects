<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import TodoList from '../../../todos/TodoList.svelte';
	import { page } from '$app/stores';
	import { getTodoList, todoList } from '$lib/stores/ItemListstore';
	import { onNewForm } from '$lib/stores/forms';
	import { IconCirclePlus } from '@tabler/icons-svelte';
	interface Props {
		data?: any;
	}
	export let data: Props['data'];
	export let skeletonDivNum = 5;

	$: teamId = $page.params.id;
	$: todos = $todoList as any[];
	let isLoading = false;

	onMount(async () => {
		isLoading = true;
		await getTodoList({ teamId: teamId, isComplete: false });
		isLoading = false;
	});
</script>

<div class="px-5 space-y-4">
	<div class="flex justify-between items-center">
		<p class="text-xl">To-Dos</p>
		<button
			on:click={() => {
				onNewForm('Todo');
			}}
			class="btn items-center hover:bg-slate-50/20 rounded-lg"
		>
			<IconCirclePlus class=" text-primary-500 " />
			<p class="font-medium">Add To-do</p>
		</button>
	</div>
	{#if isLoading}
		<SkeletonList number={skeletonDivNum} />
	{:else if todos.length > 0}
	<div>
		<TodoList team={teamId} list={todos} endpoint={'todos'} />
	</div>
		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
