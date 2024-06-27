<script lang="ts">
	import {
		onNewForm,
		relatedFrom,
		onUpdateForm,
		handleRelation,
		todoData
	} from '$lib/stores/forms';
	import _ from 'lodash';

	import { formatInputDate } from '$lib/utils/formatDate';
	import ListItemPage from '$lib/components/ListItemPage.svelte';
	import { invalidateAll } from '$app/navigation';
	import axios from 'axios';

	interface Props {
		team: any;
		list: any[];
		index: number;
		endpoint?: string;
	}
	export let team: Props['team'];
	export let list: Props['list'];
	export let endpoint: Props['endpoint'];
	const handleUpdate = (data: any) => {
		let formData = {
			id: data.id,
			name: data.name,
			ownerId: data.ownerId,
			teamId: data.team.id,
			dueDate:
				data.dueDate instanceof Date
					? formatInputDate(data.dueDate)
					: formatInputDate(new Date(data.dueDate)),
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

	const handleNewRelatedTodo = (value: any, type: string) => {
		relatedFrom.set({
			todoId: value.id,
			name: value.name
		});
		onNewForm(type, true);
	};
	$: isLoading = false;
	const checkStatus = async (item: any) => {
		isLoading = true;
		let resp = await axios.put(`/api/todo/status/${item.id}`, {
			isComplete: !item.isComplete
		});
		invalidateAll();
		isLoading = false;
	};
</script>

{#each list as item, i}
	<ListItemPage
		{endpoint}
		{item}
		index={i}
		{team}
		onHandleUpdate={() => {
			handleUpdate(item);
		}}
		onHandleRelatedNewIssueForm={() => {
			handleNewRelatedTodo(item, 'Issue');
		}}
		onHandleRelatedNewTodoForm={() => {
			handleNewRelatedTodo(item, 'Todo');
		}}
	/>
{/each}

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
