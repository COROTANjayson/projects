<script lang="ts">
	import type { PageData } from './$types';
	import { sideBarRight } from '$lib/stores/sideBar';
	import {
		editForm,
		formName,
		onNewForm,
		headlineData,
		creatorName,
		relatedFrom
	} from '$lib/stores/forms';
	import _ from 'lodash';
	import ListItemPage from '$lib/components/ListItemPage.svelte';
	import axios from 'axios';
	import { invalidateAll } from '$app/navigation';
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
			// dueDate: formatInputDate(data.dueDate),
			notes: data.notes,
			creatorId: data.creatorId
		};
		creatorName.set(data.creator.name);

		headlineData.set(formData);
		sideBarRight.set(true);
		formName.set('Headline');
		editForm.set(true);
	};

	const handleNewRelatedHeadline = (value: any, type: string) => {
		relatedFrom.set({
			headlineId: value.id,
			name: value.name
		});
		onNewForm(type, true);
	};
	
</script>

{#each list as item, i}
	<ListItemPage
		
		{endpoint}
		bind:item
		index={i}
		{team}
	
		onHandleUpdate={() => {
			handleUpdate(item);
		}}
		onHandleRelatedNewIssueForm={() => {
			handleNewRelatedHeadline(item, 'Issue');
		}}
		onHandleRelatedNewTodoForm={() => {
			handleNewRelatedHeadline(item, 'Todo');
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
