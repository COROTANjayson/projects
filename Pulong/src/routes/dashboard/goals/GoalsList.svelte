<script lang="ts">
	import { sideBarRight } from '$lib/stores/sideBar';
	import {
		editForm,
		formName,
		onNewForm,
		goalsData,
		creatorName,
		relatedFrom
	} from '$lib/stores/forms';
	import { formatInputDate } from '$lib/utils/formatDate';
	import _ from 'lodash';
	import ListItemPage from '$lib/components/ListItemPage.svelte';
	export let team: any;
	export let list: any[];
	export let endpoint: any;

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
		creatorName.set(data.creator.name);
		goalsData.set(formData);
		sideBarRight.set(true);
		formName.set('Goal');
		editForm.set(true);
	};
	const handleNewRelatedGoal = (value: any, type: string) => {
		relatedFrom.set({
			goalId: value.id,
			name: value.name
		});
		onNewForm(type, true);
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
			handleNewRelatedGoal(item, 'Issue');
		}}
		onHandleRelatedNewTodoForm={() => {
			handleNewRelatedGoal(item, 'Todo');
		}}
	/>
{/each}
