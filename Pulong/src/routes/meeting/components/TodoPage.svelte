<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import GoalsList from '../../dashboard/goals/GoalsList.svelte';
	import TodoList from '../../dashboard/todos/TodoList.svelte';
	import { getTodoList, todoList } from '$lib/stores/ItemListstore';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: todos = $todoList as any[];
	let teamId = data.teamMeeting.teamId;
	let isLoading = false;

	onMount(async () => {
		isLoading = true;
		await getTodoList({ teamId: teamId, isComplete: false });
		isLoading = false;
	});
</script>

<div>
	{#if isLoading}
		<SkeletonList />
	{:else if todos.length > 0}
		<TodoList team={teamId} list={todos} endpoint={'todos'} />

		<!-- <TableKpi list={kpi} groupedTeam={undefined} {teamId} {data} /> -->
	{/if}
</div>
