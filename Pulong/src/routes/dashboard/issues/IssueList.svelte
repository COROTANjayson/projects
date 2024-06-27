<script lang="ts">
	import type { PageData } from './$types';
	import { IconPlus } from '@tabler/icons-svelte';

	import {
		onNewForm,
		issueData,
		relatedFrom,
		onUpdateForm,
		handleRelation
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
		let relation = handleRelation(data, 'Issue');
		if (relation) {
			formData = {
				...formData,
				...relation
			};
		}
		issueData.set(formData);
		onUpdateForm('Issue', data);
	};

	const handleNewRelatedIssue = (value: any, type: string) => {
		relatedFrom.set({
			issueId: value.id,
			name: value.name
		});
		onNewForm(type, true);
	};
	$: isLoading = false;
	const checkStatus = async (item: any) => {
		isLoading = true;
		let resp = await axios.put(`/api/issue/status/${item.id}`, {
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
			handleNewRelatedIssue(item, 'Issue');
		}}
		onHandleRelatedNewTodoForm={() => {
			handleNewRelatedIssue(item, 'Todo');
		}}
	/>
{/each}
